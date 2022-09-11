// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IStakingToken {
    /**
     * @dev make the staking nft and send to the address
     */
    function mint(address to, string memory tokenURI) external;

    /**
     * @dev burn the staking nft
     */
    function burn(uint256 tokenId) external;
}
