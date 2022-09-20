// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FanficToken.sol";
import "./interfaces/IMarket.sol";

contract Market is Ownable, IMarket {
    using Counters for Counters.Counter;
    Counters.Counter private _saleIds;
    address private _fanficToken;
    mapping(uint256 => Sale) private _sales;

    constructor(address owner) {
        _transferOwnership(owner);
    }

    /**
     * @inheritdoc IMarket
     */
    function startSale(uint256 tokenId, uint256 price) external override returns (uint256) {
        require(FanficToken(_fanficToken).ownerOf(tokenId) == _msgSender(), "Market: not owner");
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
        (address[] memory receivers, uint256[] memory royaltyAmounts) = FanficToken(_fanficToken).royaltyInfo(
            _sale.tokenId,
            _sale.price
        );
        uint256 _amount = _sale.price;
        for (uint256 i = 0; i < receivers.length; i++) {
            payable(receivers[i]).transfer(royaltyAmounts[i]);
            _amount -= royaltyAmounts[i];
        }
        if (_amount > 0) {
            payable(FanficToken(_fanficToken).ownerOf(_sale.tokenId)).transfer(_amount);
        }
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
    function totalSupply() external view override returns (uint256) {
        return _saleIds.current();
    }

    /**
     * @inheritdoc IMarket
     */
    function sale(uint256 saleId) external view override returns (Sale memory) {
        return _sales[saleId];
    }
}
