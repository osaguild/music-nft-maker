// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IProtocol {
    /**
     * @dev stake MTE to protocol and receive staking token as proof of stake.
     * approve amount of staking MTE to protocol first.
     */
    function stake(uint256 amount) external;

    /**
     * @dev withdraw MTE from protocol with APY.
     */
    function withdraw(uint256 amount) external;

    /**
     * @dev amount of MTE which account is staking.
     */
    function balanceOfStaking(address account) external view returns (uint256);

    /**
     * @dev amount of reward MTE which account earned by staking.
     */
    function balanceOfReward(address account) external view returns (uint256);

    /**
     * @dev check whether account can mint oringin token and fanfic token.
     */
    function mintable(address account) external view returns (bool);

    /**
     * @dev provide liquidity to ETH-MTE pool of uniswap.
     */
    function provideLiquidity(
        address payable to,
        uint256 ethAmount,
        uint256 mteAmount
    ) external payable;

    /**
     * @dev set MTE token address.
     */
    function setMteToken(address mteToken) external;

    /**
     * @dev set staking token address.
     */
    function setStakingToken(address stakingToken) external;
}
