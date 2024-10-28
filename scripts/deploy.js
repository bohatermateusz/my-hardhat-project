// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockWETH9
  const MockWETH9 = await hre.ethers.getContractFactory("MockWETH9");
  const mockWETH9 = await MockWETH9.deploy();
  await mockWETH9.deployed();
  console.log("MockWETH9 deployed to:", mockWETH9.address);

  // Deploy MockNonfungiblePositionManager
  const MockNonfungiblePositionManager = await hre.ethers.getContractFactory("MockNonfungiblePositionManager");
  const mockPositionManager = await MockNonfungiblePositionManager.deploy();
  await mockPositionManager.deployed();
  console.log("MockNonfungiblePositionManager deployed to:", mockPositionManager.address);

  // Deploy BondingCurveToken
  const BondingCurveToken = await hre.ethers.getContractFactory("BondingCurveToken");
  const bondingCurveToken = await BondingCurveToken.deploy(
    "BondingCurveToken",
    "BCT",
    mockPositionManager.address,
    mockWETH9.address
  );
  await bondingCurveToken.deployed();
  console.log("BondingCurveToken deployed to:", bondingCurveToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });