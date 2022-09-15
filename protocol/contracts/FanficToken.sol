// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./erc2981/IERC2981MultipleRoyalties.sol";
import "./erc2981/ERC2981MultipleRoyalties.sol";
import "./Protocol.sol";
import "./OriginToken.sol";
import "./interface/IFanficToken.sol";

contract FanficToken is ERC721URIStorage, ERC2981MultipleRoyalties, Ownable, IFanficToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private _protocol;
    address private _originToken;

    constructor(
        address owner,
        address protocol,
        address originToken,
        address defaultReceiver,
        uint16 defaultFeeNumerator
    ) ERC721("FanficToken", "FANFIC") {
        _transferOwnership(owner);
        _setDefaultRoyalty(defaultReceiver, defaultFeeNumerator);
        _protocol = protocol;
        _originToken = originToken;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC2981MultipleRoyalties, ERC721)
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC2981MultipleRoyalties).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IFanficToken
     */
    function mint(string memory tokenURI, uint256[] memory originIds) external override returns (uint256) {
        require(!Protocol(_protocol).mintable(_msgSender()), "FanficToken: not mintable");
        _tokenIds.increment();
        _mint(msg.sender, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);
        for (uint256 i = 0; i < originIds.length; i++) {
            // set 10% royality every origin token owner
            _addRoyaltyInfo(_tokenIds.current(), OriginToken(_originToken).ownerOf(originIds[i]), 1000);
        }
        return _tokenIds.current();
    }
}
