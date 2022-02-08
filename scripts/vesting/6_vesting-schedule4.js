let vestingSchedule = [
    //Team
    {
      beneficiary: "0xd5Ec83303e00411Ee458018C516C300386314CE2", 
      vestingPeriod: [
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
        2678400,   // 2022-06-04
        2592000,   // 2022-07-04
        2678400,   // 2022-08-04
        2678400,   // 2022-09-04
        2592000,   // 2022-10-04
        2678400,   // 2022-11-04
        2592000,   // 2022-12-04
        2678400,   // 2023-01-04
        2678400   // 2023-02-04
      ],
      releaseAmount: [
        720000, 720000, 720000, 720000,
        1440000, 1440000, 1440000, 1440000,
        2340000, 2340000, 2340000, 2340000 
      ],
      vestAmount: 18000000
    },
    //Strategic Partnerships
    {
      beneficiary: "0x2235eea78958dE034418Ad77B5fec322F7026218", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        1750000, 1750000, 1750000, 1750000
      ],
      vestAmount: 7000000
    },
    //Marketing
    {
      beneficiary: "0x1052854ebA9aB3de9d81008fbE9E4FA58d4623e8", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        750000, 750000, 750000, 750000
      ],
      vestAmount: 3000000
    },
    //Investors
    {
      beneficiary: "0xB703842a09D6680763B4409B7E1CD8B4f1d030b4", 
      vestingPeriod: [
        0,
        2419200,   // 2022-03-04
        2678400,   // 2022-04-04
        2592000,   // 2022-05-04
      ],
      releaseAmount: [
        500000, 500000, 500000, 500000
      ],
      vestAmount: 2000000
    }
];

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const VESTING = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting_address = '0x5959ed1dC9fAb86E80d97A05C6d91c591420A693';

    const vesting = await VESTING.attach(vesting_address);
    
    await vesting.connect(deployer).createVestingSchedule(vestingSchedule[3]['beneficiary'], vestingSchedule[3]['vestAmount'],
    vestingSchedule[3]['vestingPeriod'], 
    vestingSchedule[3]['releaseAmount']); 

    console.log("done=========>");
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

