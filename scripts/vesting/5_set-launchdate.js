const hre = require("hardhat");

function getTimeStamp(strDate) {
    const dt = new Date(strDate).getTime();  
    return dt / 1000;
}

async function main() {
    let vestingStartDate = "2022-02-10 13:00:00";
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const VESTING = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting_address = '0x8101910A78A1E2252112c9658Eed7db71936BDb4';

    const vesting = await VESTING.attach(vesting_address);

    await vesting.connect(deployer).setLaunchDate(getTimeStamp(vestingStartDate));

    // console.log("done=========>", getTimeStamp(vestingStartDate));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

//1644292800
//1644300239