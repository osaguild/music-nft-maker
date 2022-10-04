// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FanficToken.sol";
import "./interfaces/IMarket.sol";
import "./Protocol.sol";

contract Market is Ownable, IMarket {
    using Counters for Counters.Counter;
    Counters.Counter private _saleIds;
    address private _fanficToken;
    address private _protocol;
    mapping(uint256 => Sale) private _sales;

    constructor(address owner) {
        _transferOwnership(owner);
    }

    /**
     * @inheritdoc IMarket
     */
    function startSale(uint256 tokenId, uint256 price) external override returns (uint256) {
        Sale memory currentSale = _currentSale(tokenId);
        require(FanficToken(_fanficToken).ownerOf(tokenId) == _msgSender(), "Market: not owner");
        require(FanficToken(_fanficToken).getApproved(tokenId) == address(this), "Market: not approved");
        require(currentSale.tokenId == 0 || currentSale.endBlockNumber != 0, "Market: already on sale");
        _saleIds.increment();
        _sales[_saleIds.current()] = Sale(
            tokenId, // tokenId
            price, // price
            address(0), // buyer
            block.number, // startBlockNumber
            0, // endBlockNumber
            false // isSold
        );
        emit StartSale(_saleIds.current(), tokenId, price, _msgSender());
        return _saleIds.current();
    }

    /**
     * @inheritdoc IMarket
     */
    function closeSale(uint256 saleId) external override {
        Sale memory _sale = _sales[saleId];
        require(FanficToken(_fanficToken).ownerOf(_sale.tokenId) == _msgSender(), "Market: not owner");
        require(_sale.endBlockNumber == 0, "Market: already closed");
        _sale.endBlockNumber = block.number;
        _sales[saleId] = _sale;
        emit CloseSale(saleId, _sale.tokenId);
    }

    /**
     * @inheritdoc IMarket
     */
    function purchase(uint256 saleId) external payable override {
        Sale memory _sale = _sales[saleId];
        require(_sale.price == msg.value, "Market: not match price");
        require(_sale.endBlockNumber == 0, "Market: already closed");
        _sale.buyer = _msgSender();
        _sale.endBlockNumber = block.number;
        _sale.isSold = true;
        _sales[saleId] = _sale;
        Protocol(_protocol).stakeSales{value: msg.value}(saleId);
        FanficToken(_fanficToken).transferFrom(
            FanficToken(_fanficToken).ownerOf(_sale.tokenId),
            _msgSender(),
            _sale.tokenId
        );
        emit Purchase(saleId, _sale.tokenId, _sale.price, _msgSender());
    }

    /**
     * @inheritdoc IMarket
     */
    function setFanficToken(address fanficToken) external override onlyOwner {
        _fanficToken = fanficToken;
    }

    /**
     * @inheritdoc IMarket
     */
    function setProtocol(address protocol) external override onlyOwner {
        _protocol = protocol;
    }

    /**
     * @inheritdoc IMarket
     */
    function totalSupply() external view override returns (uint256) {
        return _saleIds.current();
    }

    /**
     * @inheritdoc IMarket
     */
    function sale(uint256 saleId) external view override returns (Sale memory) {
        return _sales[saleId];
    }

    /**
     * @dev return current sale of tokenId
     */
    function _currentSale(uint256 tokenId) internal view returns (Sale memory) {
        for (uint256 i = _saleIds.current(); i > 0; i--) {
            if (_sales[i].tokenId == tokenId) {
                return _sales[i];
            }
        }
        return Sale(0, 0, address(0), 0, 0, false);
    }
}
