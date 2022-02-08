const hre = require("hardhat");
async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);       

    let token_address="0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28";
    //0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28
    
    const Vesting = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting = await Vesting.deploy(token_address);

    await vesting.deployed();
    console.log("ABYSS Vesting deployed to:", vesting.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});