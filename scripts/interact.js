// scripts/interact.js
const hre = require("hardhat");

async function main() {
  const [deployer, user] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("User address:", user.address);

  // Replace with your deployed contract addresses
  const BondingCurveToken = await hre.ethers.getContractFactory("BondingCurveToken");
  const bondingCurveTokenAddress = "<DEPLOYED_BONDING_CURVE_TOKEN_ADDRESS>";
  const bondingCurveToken = await BondingCurveToken.attach(bondingCurveTokenAddress);

  // Buy tokens as the user
  const buyAmount = hre.ethers.utils.parseEther("1"); // 1 ETH
  const buyTx = await bondingCurveToken.connect(user).buyTokens({ value: buyAmount });
  await buyTx.wait();
  console.log(`User bought tokens with 1 ETH`);

  // Check user's token balance
  const userBalance = await bondingCurveToken.balanceOf(user.address);
  console.log(`User balance: ${hre.ethers.utils.formatUnits(userBalance, 18)} BCT`);

  // Check total supply
  const totalSupply = await bondingCurveToken.totalSupply();
  console.log(`Total Supply: ${hre.ethers.utils.formatUnits(totalSupply, 18)} BCT`);

  // Check market cap
  const marketCap = await bondingCurveToken.marketCap();
  console.log(`Market Cap: ${hre.ethers.utils.formatEther(marketCap)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
