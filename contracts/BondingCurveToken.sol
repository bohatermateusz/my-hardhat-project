pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./INonfungiblePositionManager.sol";
import "./IWETH9.sol";

contract BondingCurveToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 1000000 * (10 ** 18);
    uint256 public marketCap;
    address public owner;

    IWETH9 public weth9;
    INonfungiblePositionManager public nonfungiblePositionManager;

    int24 public constant MIN_TICK = -887272;
    int24 public constant MAX_TICK = 887272;

    constructor(
        string memory name,
        string memory symbol,
        address positionManagerAddress,
        address wethAddress
    ) ERC20(name, symbol) {
        owner = msg.sender;
        nonfungiblePositionManager = INonfungiblePositionManager(positionManagerAddress);
        weth9 = IWETH9(wethAddress);
    }

    function buyTokens() public payable {
        uint256 tokensToMint = msg.value * getCurrentPrice();
        require(totalSupply() + tokensToMint <= MAX_SUPPLY, "Exceeds max supply");
        _mint(msg.sender, tokensToMint);
        marketCap += msg.value;
        checkMarketCap();
    }

    function getCurrentPrice() public view returns (uint256) {
        // Simple linear price increase
        return (totalSupply() + 1) / (10 ** decimals());
    }

    function checkMarketCap() internal {
        if (marketCap >= 700 ether) {
            deployToUniswap();
        }
    }

    function deployToUniswap() internal {
        // Approve the NonfungiblePositionManager to spend this token
        _approve(address(this), address(nonfungiblePositionManager), totalSupply());

        // Wrap ETH balance to WETH
        uint256 ethBalance = address(this).balance;
        weth9.deposit{value: ethBalance}();

        // Approve the NonfungiblePositionManager to spend WETH
        weth9.approve(address(nonfungiblePositionManager), ethBalance);

        // Determine token0 and token1
        (address token0, address token1, uint256 amount0Desired, uint256 amount1Desired) = address(this) < address(weth9)
            ? (address(this), address(weth9), totalSupply(), ethBalance)
            : (address(weth9), address(this), ethBalance, totalSupply());

        // Define the fee tier (e.g., 0.3%)
        uint24 fee = 3000;

        // Set the tick ranges for a full-range position
        int24 tickLower = MIN_TICK;
        int24 tickUpper = MAX_TICK;

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0Desired,
                amount1Desired: amount1Desired,
                amount0Min: 0,
                amount1Min: 0,
                recipient: owner,
                deadline: block.timestamp
            });

        // Mint the position
        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = nonfungiblePositionManager.mint(params);

        // Emit an event or update state as needed
    }

    // Function to receive ETH when `weth9.deposit{value: ethBalance}()` is called
    receive() external payable {}
}
