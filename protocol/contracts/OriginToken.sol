// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/IOriginToken.sol";

contract OriginToken is ERC721URIStorage, IOriginToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /**
     * @dev set the name and symbol of the origin token and set owner address
     */
    constructor() ERC721("OriginToken", "ORIGIN") {}

    /**
     * @inheritdoc IOriginToken
     */
    function mint(string memory tokenURI) external override returns (uint256) {
        _tokenIds.increment();
        _mint(_msgSender(), _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);
        return _tokenIds.current();
    }
}
