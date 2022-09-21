// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IMarket {
    /**
     * @dev sale info on market
     */
    struct Sale {
        uint256 tokenId;
        uint256 price;
        address buyer;
        uint256 startBlockNumber;
        uint256 endBlockNumber;
        bool isSold;
    }

    /**
     * @dev start sale on market, need to approve the market contract to transfer the token before sale
     */
    function startSale(uint256 tokenId, uint256 price) external returns (uint256);

    /**
     * @dev close sale on market, only sale owner can close sales
     */
    function closeSale(uint256 saleId) external;

    /**
     * @dev purchase fanfic token from market. need to call this function with sale amount of ETH.
     * transfer fanfic token to buyer and send ETH to seller and orign token owners according to the royalty.
     */
    function purchase(uint256 saleId) external payable;

    /**
     * @dev total supply of sales
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev set fanfic token address
     */
    function setFanficToken(address fanficToken) external;

    /**
     * @dev set protocol address
     */
    function setProtocol(address protocol) external;

    /**
     * @dev get sale info by saleId
     */
    function sale(uint256 saleId) external view returns (Sale memory);

    /**
     * @dev emit start sale event
     */
    event StartSale(uint256 indexed saleId, uint256 indexed tokenId, uint256 price, address seller);

    /**
     * @dev emit close sale event
     */
    event CloseSale(uint256 indexed saleId, uint256 indexed tokenId);

    /**
     * @dev emit purchase event
     */
    event Purchase(uint256 indexed saleId, uint256 indexed tokenId, uint256 price, address buyer);
}
