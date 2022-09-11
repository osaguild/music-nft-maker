// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IMteToken {
    /**
     * @dev make the MTE token and send to the address
     */
    function mint(address to, uint256 amount) external;
}
