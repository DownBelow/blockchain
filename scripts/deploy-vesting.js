const hre = require("hardhat");
async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // We get the contract to deploy
    const Vesting = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting = await Vesting.deploy("0x08452576D1Cd1F9420034F77fd4eCCd62165bfa5");
    

    await vesting.deployed();

    console.log("ABYSS Vesting deployed to:", vesting.address);
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});