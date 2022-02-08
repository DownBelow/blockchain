const hre = require("hardhat");

function getBigNumber(value) {
    return hre.ethers.utils.parseEther(value.toString());
}

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const ABYSS = await hre.ethers.getContractFactory("ABYSS");
    const address = '0x8DA33f73461b04021249f0248B88F1C5a99cE158';   
    //0x73eC9D20c6a1E8cf34e7E446d76aeb742EB6aE28
    const vesting_address = '0x8101910A78A1E2252112c9658Eed7db71936BDb4';
    
    const abyss = await ABYSS.attach(address);

    let vestingTotalAmount = 30000000;
    
    await abyss.connect(deployer).transfer(vesting_address, getBigNumber(vestingTotalAmount));

    console.log("done=========>");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});