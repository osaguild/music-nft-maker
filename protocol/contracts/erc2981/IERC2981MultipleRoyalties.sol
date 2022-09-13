// SPDX-License-Identifier: MIT
// extended OpenZeppelin Contracts (last updated v4.6.0) (interfaces/IERC2981.sol)
pragma solidity =0.8.9;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/**
 * @dev Interface for the NFT Royalty Standard. enable to set multiple royalties
 */
interface IERC2981MultipleRoyalities is IERC165 {
    /**
     * @dev Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
     */
    function royaltyInfos(uint256[] memory tokenId, uint256[] memory salePrice)
        external
        view
        returns (address receivers, uint256 royaltyAmounts);
}
