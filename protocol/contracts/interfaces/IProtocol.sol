// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

interface IProtocol {
    struct Staking {
        address staker;
        uint256 startBlockNumber;
        uint256 endBlockNumber;
        uint256 value;
        uint256 stakingTokenId;
    }

    /**
     * @dev stake MTE to protocol and receive staking token as proof of stake.
     * approve amount of staking MTE to protocol first.
     */
    function stake(uint256 amount) external;

    /**
     * @dev stake MTE to protocol and receive staking token as proof of stake.
     * approve amount of staking MTE to protocol first.
     */
    function stakeSales(uint256 saleId) external payable;

    /**
     * @dev withdraw MTE from protocol with APY.
     */
    function withdraw(uint256 amount) external;

    /**
     * @dev amount of MTE which account is staking.
     */
    function balanceOfStaking(address account) external view returns (uint256);

    /**
     * @dev amount of reward MTE which account earned by staking.
     */
    function balanceOfReward(address account) external view returns (uint256);

    /**
     * @dev total staking amount.
     */
    function totalStaking() external view returns (uint256);

    /**
     * @dev check whether account can mint oringin token and fanfic token.
     */
    function mintable(address account) external view returns (bool);

    /**
     * @dev provide liquidity to ETH-MTE pool of uniswap.
     */
    function provideLiquidity(
        address payable to,
        uint256 ethAmount,
        uint256 mteAmount
    ) external payable;

    /**
     * @dev rate of liquidity which pool is ETH and MTE.
     * 10000    ->  ETH : MTE  =  1   : 1
     * 1000000  ->  ETH : MTE  =  100 : 1
     * 100      ->  ETH : MTE  =  1   : 100
     */
    function rateOfLiquidity() external pure returns (uint256);

    /**
     * @dev set MTE token address.
     */
    function setMteToken(address mteToken) external;

    /**
     * @dev set staking token address.
     */
    function setStakingToken(address stakingToken) external;

    /**
     * @dev set fanfic token address.
     */
    function setFanficToken(address fanficToken) external;

    /**
     * @dev set market address.
     */
    function setMarket(address market) external;

    /**
     * @dev emit staking event.
     */
    event Stake(address indexed staker, address indexed from, uint256 amounts);
}
