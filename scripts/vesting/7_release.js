const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const VESTING = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting_address = '0x5959ed1dC9fAb86E80d97A05C6d91c591420A693';

    const vesting = await VESTING.attach(vesting_address);

    await vesting.connect(deployer).release();

    console.log("done=========>");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});