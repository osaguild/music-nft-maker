// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IOriginToken {
    /**
     * @dev mint the origin token.
     */
    function mint(string memory tokenURI) external returns (uint256);
}
