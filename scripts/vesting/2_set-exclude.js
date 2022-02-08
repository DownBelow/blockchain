const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const ABYSS = await hre.ethers.getContractFactory("ABYSS");
    const address = '0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28';   
    //0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28
    const vesting_address = '0x5959ed1dC9fAb86E80d97A05C6d91c591420A693';
    
    const abyss = await ABYSS.attach(address);

    await abyss.connect(deployer).excludeFromFee(vesting_address);

    console.log("done=========>");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});