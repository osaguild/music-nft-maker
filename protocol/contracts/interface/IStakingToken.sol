// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IStakingToken {
    /**
     * @dev mint the staking token and send to the address
     */
    function mint(address to, string memory tokenURI) external returns (uint256);

    /**
     * @dev burn the staking token
     */
    function burn(uint256 tokenId) external;
}
