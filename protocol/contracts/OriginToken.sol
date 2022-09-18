// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IOriginToken.sol";
import "./Protocol.sol";

contract OriginToken is ERC721URIStorage, Ownable, IOriginToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private _protocol;

    /**
     * @dev set the name and symbol of the origin token and set owner address
     */
    constructor(address owner) ERC721("OriginToken", "ORIGIN") {
        _transferOwnership(owner);
    }

    /**
     * @inheritdoc IOriginToken
     */
    function mint(string memory tokenURI) external override returns (uint256) {
        require(Protocol(_protocol).mintable(_msgSender()), "OriginToken: not mintable");
        _tokenIds.increment();
        _mint(_msgSender(), _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);
        return _tokenIds.current();
    }

    /**
     * @inheritdoc IOriginToken
     */
    function totalSupply() external view override returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @inheritdoc IOriginToken
     */
    function setProtocol(address protocol) external override onlyOwner {
        _protocol = protocol;
    }
}
