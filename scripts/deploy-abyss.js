const hre = require("hardhat");
async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // We get the contract to deploy
    const Abyss = await hre.ethers.getContractFactory("ABYSS");
    const abyss = await Abyss.deploy();
    

    await abyss.deployed();

    console.log("ABYSS deployed to:", abyss.address);
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});