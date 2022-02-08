const hre = require("hardhat");
async function main() {

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);       

    let token_address="0x8da33f73461b04021249f0248b88f1c5a99ce158";
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