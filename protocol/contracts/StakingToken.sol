// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interface/IStakingToken.sol";

contract StakingToken is ERC721URIStorage, Ownable, IStakingToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /**
     * @dev set the name and symbol of the staking token and set owner address
     */
    constructor(address owner) ERC721("StakingToken", "STN") {
        _transferOwnership(owner);
    }

    /**
     * @dev mint the staking nft and send to the address
     */
    function mint(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        _mint(to, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);
        return _tokenIds.current();
    }

    /**
     * @dev burn the staking token
     */
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
}
