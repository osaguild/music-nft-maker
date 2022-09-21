// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IProtocol.sol";
import "./MteToken.sol";
import "./StakingToken.sol";
import "./FanficToken.sol";
import "./Market.sol";

contract Protocol is Ownable, IProtocol {
    uint16 private _apyNumerator;
    uint16 private _apyDenominator = 10000;
    address private _mteToken;
    address private _stakingToken;
    address private _fanficToken;
    address private _market;
    using Counters for Counters.Counter;
    Counters.Counter private _stakingId;
    mapping(uint256 => Staking) private _stakings;

    struct Staking {
        address staker;
        uint256 blockNumber;
        uint256 value;
        uint256 stakingTokenId;
    }

    /**
     * @dev set the name and symbol of the MTE token and set owner address
     */
    constructor(address owner, uint16 apy) {
        _transferOwnership(owner);
        _setApy(apy);
    }

    /**
     * @inheritdoc IProtocol
     */
    function stake(uint256 amount) external override {
        _stake(_msgSender(), amount);
        MteToken(_mteToken).transferFrom(_msgSender(), address(this), amount);
    }

    /**
     * @inheritdoc IProtocol
     */
    function stakeSales(uint256 saleId) external payable override {
        // error check
        Market.Sale memory sale = Market(_market).sale(saleId);
        require(msg.value == sale.price, "Market: not enough ETH");
        // calc staking amount of mte
        uint256 mteAmount = (msg.value * _apyDenominator) / _rateOfLiquidity();
        uint256 ownerReward = mteAmount;
        (address[] memory receivers, uint256[] memory royaltyAmounts) = FanficToken(_fanficToken).royaltyInfo(
            sale.tokenId,
            mteAmount
        );
        // stake royalty
        for (uint256 i = 0; i < receivers.length; i++) {
            _stake(receivers[i], royaltyAmounts[i]);
            ownerReward -= royaltyAmounts[i];
        }
        // stake to owner
        _stake(FanficToken(_fanficToken).ownerOf(sale.tokenId), ownerReward);
    }

    /**
     * @inheritdoc IProtocol
     */
    function withdraw(uint256 amount) external override {
        Staking memory staking = _currentStaking(_msgSender());
        if (staking.value == 0) {
            revert("Protocol: staking not found");
        } else if (staking.value < amount) {
            revert("Protocol: staking is not enough");
        } else {
            uint256 apyAmount = _calcReward(amount, staking.blockNumber);
            MteToken(_mteToken).transfer(_msgSender(), amount + apyAmount);
            _setStaking(_msgSender(), staking.value - amount, staking.stakingTokenId);
            if (staking.value == amount) {
                StakingToken(_stakingToken).burn(staking.stakingTokenId);
            }
        }
    }

    /**
     * @inheritdoc IProtocol
     */
    function balanceOfStaking(address account) external view override returns (uint256) {
        Staking memory staking = _currentStaking(account);
        return staking.value;
    }

    /**
     * @inheritdoc IProtocol
     */
    function balanceOfReward(address account) external view override returns (uint256) {
        Staking memory staking = _currentStaking(account);
        return _calcReward(staking.value, staking.blockNumber);
    }

    /**
     * @inheritdoc IProtocol
     */
    function mintable(address account) external view override returns (bool) {
        Staking memory staking = _currentStaking(account);
        return staking.value > 0;
    }

    /**
     * @dev IProtocol
     * !!! this is test function. just send ETH and MTE to specified address from contract !!!
     * todo: implement to provide liquidity to ETH-MTE pool of uniswap.
     */
    function provideLiquidity(
        address payable to,
        uint256 ethAmount,
        uint256 mteAmount
    ) external payable override onlyOwner {
        to.transfer(ethAmount);
        MteToken(_mteToken).mint(to, mteAmount);
    }

    /**
     * @inheritdoc IProtocol
     */
    function setMteToken(address mteToken) external override onlyOwner {
        _mteToken = mteToken;
    }

    /**
     * @inheritdoc IProtocol
     */
    function setStakingToken(address stakingToken) external override onlyOwner {
        _stakingToken = stakingToken;
    }

    /**
     * @inheritdoc IProtocol
     */
    function setFanficToken(address fanficToken) external override onlyOwner {
        _fanficToken = fanficToken;
    }

    /**
     * @inheritdoc IProtocol
     */
    function setMarket(address market) external override onlyOwner {
        _market = market;
    }

    /**
     * @dev set the APY of the protocol between 0 and 65,536
     * denominator is 10,000. 10,000 means 100%.
     */
    function _setApy(uint16 numerator) internal {
        _apyNumerator = numerator;
    }

    /**
     * @dev set staking, and mint staking token if you don't have it.
     */
    function _stake(address to, uint256 value) internal {
        Staking memory staking = _currentStaking(to);
        if (staking.value == 0) {
            uint256 stakingTokenId = StakingToken(_stakingToken).mint(to, "https://osaguild.com/");
            _setStaking(to, value, stakingTokenId);
        } else {
            _setStaking(to, staking.value + value, staking.stakingTokenId);
        }
    }

    /**
     * @dev set Staking infroamtion
     */
    function _setStaking(
        address staker,
        uint256 amount,
        uint256 stakingTokenId
    ) internal {
        _stakingId.increment();
        _stakings[_stakingId.current()] = Staking(staker, block.number, amount, stakingTokenId);
    }

    /**
     * @dev calculate Reward of APY
     * !!! this is test APY !!!
     * reward = block diff * apyNumenator / apyDenominator * staking amount
     * todo: update reward calculation
     */
    function _calcReward(uint256 amount, uint256 blockNumber) internal view returns (uint256) {
        uint256 blockDiff = block.number - blockNumber;
        return (blockDiff * _apyNumerator * amount) / _apyDenominator;
    }

    /**
     * @dev find Staking by address. if not found, return Staking(address(0), 0, 0).
     */
    function _currentStaking(address staker) internal view returns (Staking memory) {
        for (uint256 i = _stakingId.current(); i > 0; i--) {
            if (_stakings[i].staker == staker) {
                return _stakings[i];
            }
        }
        return Staking(address(0), 0, 0, 0);
    }

    /**
     * @dev rate of liquidity which pool is ETH and MTE.
     * 10000    ->  ETH : MTE  =  1   : 1
     * 1000000  ->  ETH : MTE  =  100 : 1
     * 100      ->  ETH : MTE  =  1   : 100
     * todo: implement me.
     */
    function _rateOfLiquidity() internal pure returns (uint256) {
        return 100; // return constant rate for test.
    }
}
