const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const ABYSS = await hre.ethers.getContractFactory("ABYSS");
    const address = '0x8da33f73461b04021249f0248b88f1c5a99ce158';   
    //0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28
    
    const abyss = await ABYSS.attach(address);

    await abyss.connect(deployer).setMaxTxPercent(30);
    console.log("done=========>");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});