// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/IProtocol.sol";
import "./MteToken.sol";
import "./StakingToken.sol";

contract Protocol is Ownable, IProtocol {
    uint16 private _apyDenominator = 10000;
    uint16 private _apyNumerator;
    address private _mteTokenAddress;
    address private _stakingTokenAddress;
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
    constructor(address owner, uint8 apy) {
        _transferOwnership(owner);
        _setApy(apy);
    }

    /**
     * @dev stake MTE to protocol and receive staking token as proof of stake.
     * approve amount of staking MTE to protocol first.
     */
    function stake(uint256 amount) external {
        MteToken(_mteTokenAddress).transferFrom(_msgSender(), address(this), amount);
        uint256 stakingTokenId = StakingToken(_stakingTokenAddress).mint(_msgSender(), "");
        _setStaking(_msgSender(), amount, stakingTokenId);
    }

    /**
     * @dev withdraw MTE from protocol with APY.
     */
    function withdraw(uint256 amount) external {
        Staking memory staking = _findStaking(_msgSender());
        if (staking.value < 0) {
            revert("Protocol: staking not found");
        } else if (staking.value < amount) {
            revert("Protocol: staking is not enough");
        } else {
            uint256 apyAmount = _calcApy(amount, staking.blockNumber);
            MteToken(_mteTokenAddress).transferFrom(address(this), _msgSender(), amount + apyAmount);
            // todo: If you doesn't withdraw all MTE, staking token isn't burned
            StakingToken(_stakingTokenAddress).burn(staking.stakingTokenId);
            _setStaking(_msgSender(), staking.value - amount, staking.stakingTokenId);
        }
    }

    /**
     * @dev amount of MTE which account is staking.
     */
    function balanceOfStaking(address account) external view returns (uint256) {
        Staking memory staking = _findStaking(account);
        return staking.value;
    }

    /**
     * @dev amount of MTE which account earned by staking.
     */
    function balanceOfApy(address account) external view returns (uint256) {
        Staking memory staking = _findStaking(account);
        return _calcApy(staking.value, staking.blockNumber);
    }

    /**
     * @dev check whether account can mint oringin token and fanfic token.
     */
    function mintable(address account) external view returns (bool) {
        Staking memory staking = _findStaking(account);
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
        MteToken(_mteTokenAddress).mint(to, mteAmount);
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
     * @dev calculate APY
     * !!! this is test APY !!!
     * APY = block diff * apyNumenator / apyDenominator * staking amount
     * todo: update APY calculation
     */
    function _calcApy(uint256 amount, uint256 blockNumber) internal view returns (uint256) {
        uint256 blockDiff = block.number - blockNumber;
        return ((blockDiff * _apyNumerator) / _apyDenominator) * amount;
    }

    /**
     * @dev find Staking by address. if not found, return Staking(address(0), 0, 0).
     */
    function _findStaking(address staker) internal view returns (Staking memory) {
        for (uint256 i = 1; i <= _stakingId.current(); i++) {
            if (_stakings[i].staker == staker) {
                return _stakings[i];
            }
        }
        return Staking(address(0), 0, 0, 0);
    }
}
