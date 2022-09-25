// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (token/common/ERC2981.sol)
pragma solidity =0.8.9;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IERC2981MultipleRoyalties.sol";

/**
 * @dev Implementation of the NFT Royalty Standard, a standardized way to retrieve royalty payment information. enable to set multiple royalties
 */
abstract contract ERC2981MultipleRoyalties is IERC2981MultipleRoyalties, ERC165 {
    struct RoyaltyInfo {
        address receiver;
        uint16 royaltyFraction;
    }

    mapping(uint256 => RoyaltyInfo[]) private _tokenRoyaltyInfo;

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
        return interfaceId == type(IERC2981MultipleRoyalties).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IERC2981MultipleRoyalties
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        virtual
        override
        returns (address[] memory, uint256[] memory)
    {
        address[] memory receivers;
        uint256[] memory royaltyAmounts;

        // set royalty info
        if (_tokenRoyaltyInfo[tokenId].length == 0) {
            receivers = new address[](0);
            royaltyAmounts = new uint256[](0);
        } else if (_tokenRoyaltyInfo[tokenId].length != 0) {
            receivers = new address[](_tokenRoyaltyInfo[tokenId].length);
            royaltyAmounts = new uint256[](_tokenRoyaltyInfo[tokenId].length);
            for (uint256 i = 0; i < _tokenRoyaltyInfo[tokenId].length; i++) {
                receivers[i] = _tokenRoyaltyInfo[tokenId][i].receiver;
                royaltyAmounts[i] = (salePrice * _tokenRoyaltyInfo[tokenId][i].royaltyFraction) / _feeDenominator();
            }
        }

        return (receivers, royaltyAmounts);
    }

    /**
     * @dev Adds the royalty information for a specific token id, NOT overriding the global default
     */
    function _addRoyaltyInfo(
        uint256 tokenId,
        address receiver,
        uint16 feeNumerator
    ) internal {
        // count total fee
        uint16 totalFeeNumerator = feeNumerator;
        for (uint256 i = 0; i < _tokenRoyaltyInfo[tokenId].length; i++) {
            totalFeeNumerator += _tokenRoyaltyInfo[tokenId][i].royaltyFraction;
        }
        // todo: add duplicated address check
        require(feeNumerator <= _feeDenominator(), "ERC2981: over denominator");
        require(totalFeeNumerator <= _feeDenominator(), "ERC2981: over total royalty fee");
        require(receiver != address(0), "ERC2981: Invalid parameters");
        _tokenRoyaltyInfo[tokenId].push(RoyaltyInfo(receiver, feeNumerator));
        emit AddRoyaltyInfo(tokenId, receiver, feeNumerator);
    }

    /**
     * @dev Resets royalty information for the token id back to only the global default.
     */
    function _resetTokenRoyalty(uint256 tokenId) internal {
        delete _tokenRoyaltyInfo[tokenId];
        emit ResetTokenRoyalty(tokenId);
    }

    /**
     * @dev The denominator with which to interpret the fee set in {_setTokenRoyalty} and {_setDefaultRoyalty} as a
     * fraction of the sale price. Defaults to 10000 so fees are expressed in basis points, but may be customized by an
     * override.
     */
    function _feeDenominator() internal pure returns (uint16) {
        return 10000;
    }
}
