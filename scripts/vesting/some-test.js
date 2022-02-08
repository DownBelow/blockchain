const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const VESTING = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting_address = '0xfb41e407aBa0dea9fc33b16aF5e06454721980fC';

    const vesting = await VESTING.attach(vesting_address);

    console.log("getCurrentTime=========>", (await vesting.getVestingSchedule(1)));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});