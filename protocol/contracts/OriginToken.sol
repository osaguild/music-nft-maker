// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/IOriginToken.sol";
import "./Protocol.sol";

contract OriginToken is ERC721URIStorage, IOriginToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private _protocol;

    /**
     * @dev set the name and symbol of the origin token and set owner address
     */
    constructor(address protocol) ERC721("OriginToken", "ORIGIN") {
        _protocol = protocol;
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
}
