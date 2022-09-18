// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IOriginToken {
    /**
     * @dev mint the origin token.
     */
    function mint(string memory tokenURI) external returns (uint256);

    /**
     * @dev return total count of fanfic token. it is based on counter.
     */
    function totalSupply() external returns (uint256);

    /**
     * @dev set protocol address.
     */
    function setProtocol(address protocol) external;
}
