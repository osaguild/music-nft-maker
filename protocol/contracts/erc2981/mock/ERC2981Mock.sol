// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "../ERC2981MultipleRoyalties.sol";

contract ERC2981Mock is ERC2981MultipleRoyalties {
    function addRoyaltyInfo(
        uint256 tokenId,
        address receiver,
        uint16 feeNumerator
    ) external {
        _addRoyaltyInfo(tokenId, receiver, feeNumerator);
    }

    function resetTokenRoyalty(uint256 tokenId) external {
        _resetTokenRoyalty(tokenId);
    }

    function feeDenominator() external pure returns (uint16) {
        return _feeDenominator();
    }
}
