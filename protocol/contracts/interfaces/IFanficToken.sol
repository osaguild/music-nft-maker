// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IFanficToken {
    /**
     * @dev mint the fanfic token with royalty of origin token owners.
     */
    function mint(string memory tokenURI, uint256[] memory originIds) external returns (uint256);

    /**
     * @dev return total count of fanfic token. it is based on counter.
     */
    function totalSupply() external returns (uint256);

    /**
     * @dev set origin token address.
     */
    function setOriginToken(address originToken) external;

    /**
     * @dev set protocol address.
     */
    function setProtocol(address protocol) external;

    /**
     * @dev Sets the royalty information that all ids in this contract will default to.
     */
    function setDefaultRoyalty(address receiver, uint16 feeNumerator) external;
}
