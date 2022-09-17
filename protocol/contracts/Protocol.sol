// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IProtocol.sol";
import "./MteToken.sol";
import "./StakingToken.sol";

contract Protocol is Ownable, IProtocol {
    uint16 private _apyNumerator;
    uint16 private _apyDenominator = 10000;
    address private _mteToken;
    address private _stakingToken;
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
     * @dev stake MTE to protocol and receive staking token as proof of stake.
     * approve amount of staking MTE to protocol first.
     */
    function stake(uint256 amount) external {
        MteToken(_mteToken).transferFrom(_msgSender(), address(this), amount);
        uint256 stakingTokenId = StakingToken(_stakingToken).mint(_msgSender(), "https://osaguild.com/");
        _setStaking(_msgSender(), amount, stakingTokenId);
    }

    /**
     * @dev withdraw MTE from protocol with APY.
     */
    function withdraw(uint256 amount) external {
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
     * @dev amount of MTE which account is staking.
     */
    function balanceOfStaking(address account) external view returns (uint256) {
        Staking memory staking = _currentStaking(account);
        return staking.value;
    }

    /**
     * @dev amount of reward MTE which account earned by staking.
     */
    function balanceOfReward(address account) external view returns (uint256) {
        Staking memory staking = _currentStaking(account);
        return _calcReward(staking.value, staking.blockNumber);
    }

    /**
     * @dev check whether account can mint oringin token and fanfic token.
     */
    function mintable(address account) external view returns (bool) {
        Staking memory staking = _currentStaking(account);
        return staking.value > 0;
    }

    /**
     * @dev provide liquidity to ETH-MTE pool of uniswap.
     * !!! this is test function. just send ETH and MTE to specified address from contract !!!
     * todo: implement to provide liquidity to ETH-MTE pool of uniswap.
     */
    function provideLiquidity(
        address payable to,
        uint256 ethAmount,
        uint256 mteAmount
    ) external payable onlyOwner {
        to.transfer(ethAmount);
        MteToken(_mteToken).mint(to, mteAmount);
    }

    /**
     * @dev set MTE token address.
     */
    function setMteToken(address mteToken) external onlyOwner {
        _mteToken = mteToken;
    }

    /**
     * @dev set staking token address.
     */
    function setStakingToken(address stakingToken) external onlyOwner {
        _stakingToken = stakingToken;
    }

    /**
     * @dev set the APY of the protocol between 0 and 65,536
     * denominator is 10,000. 10,000 means 100%.
     */
    function _setApy(uint16 numerator) internal {
        _apyNumerator = numerator;
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
}
