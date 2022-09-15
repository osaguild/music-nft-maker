// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IFanficToken {
    /**
     * @dev mint the fanfic token with royalty of origin token owners.
     */
    function mint(string memory tokenURI, uint256[] memory originIds) external returns (uint256);
}
