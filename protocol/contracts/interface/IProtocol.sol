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
     * @dev amount of MTE which account earned by staking.
     */
    function balanceOfApy(address account) external view returns (uint256);

    /**
     * @dev check whether account can mint oringin token and fanfic token.
     */
    function canMint(address account) external view returns (bool);
}
