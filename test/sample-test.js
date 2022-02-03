const { expect } = require("chai");
const { ethers } = require("hardhat");

let ABYSS, VESTING;

let vestingStartDate = '2022-02-04';    // This is the vesting start date
let vestingSchedule = [
  //Team
  {
    beneficiary: "", 
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
    beneficiary: "", 
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
    beneficiary: "", 
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
    beneficiary: "", 
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

function getTimeStamp(strDate) {
  const dt = new Date(strDate).getTime();  
  return dt / 1000;
}

function getBigNumber(value) {
  return ethers.utils.parseEther(value.toString());
}

describe("ABYSS Token Tests", function() {
  this.beforeEach(async function() {
    
    [account1, account2, account3, account4, account5] = await ethers.getSigners();
    vestingSchedule[0]['beneficiary'] = account2.address;
    vestingSchedule[1]['beneficiary'] = account3.address;
    vestingSchedule[2]['beneficiary'] = account4.address;
    vestingSchedule[3]['beneficiary'] = account5.address;
    

    const abyss = await ethers.getContractFactory("ABYSSF");
    ABYSS = await abyss.deploy();
    await ABYSS.deployed();

    const vesting = await ethers.getContractFactory("ABYSSVestingF");
    VESTING = await vesting.deploy(ABYSS.address);
    await VESTING.deployed();

    //exclude
    await ABYSS.connect(account1).excludeFromFee(VESTING.address);
    await ABYSS.connect(account1).setMaxTxPercent(30);

    let vestingTotalAmount = 30000000;
    await ABYSS.connect(account1).transfer(VESTING.address, getBigNumber(vestingTotalAmount));

    await VESTING.connect(account1).setLaunchDate(getTimeStamp(vestingStartDate));

    for(let i = 0; i < vestingSchedule.length; i ++) {
      await VESTING.connect(account1).createVestingSchedule(vestingSchedule[i]['beneficiary'], vestingSchedule[i]['vestAmount'],
      vestingSchedule[i]['vestingPeriod'], 
      vestingSchedule[i]['releaseAmount']); 
    }
  })

  it("ReleaseDate: 2022-03-05", async function() {
    let releaseDate = "2022-03-05";
    [account1] = await ethers.getSigners();

    await VESTING.connect(account1).setCurrentTime(getTimeStamp(releaseDate));
    await VESTING.connect(account1).release();

    //Team
    expect (await ABYSS.balanceOf(vestingSchedule[0]['beneficiary'])).to.equal(getBigNumber(720000));
    //Strategic
    expect (await ABYSS.balanceOf(vestingSchedule[1]['beneficiary'])).to.equal(getBigNumber(3500000));
    //Marketing
    expect (await ABYSS.balanceOf(vestingSchedule[2]['beneficiary'])).to.equal(getBigNumber(1500000));
    //Investors
    expect (await ABYSS.balanceOf(vestingSchedule[3]['beneficiary'])).to.equal(getBigNumber(1000000));
  })


  it("ReleaseDate: 2022-04-12", async function() {
    let releaseDate = "2022-04-12";
    [account1] = await ethers.getSigners();

    await VESTING.connect(account1).setCurrentTime(getTimeStamp(releaseDate));
    await VESTING.connect(account1).release();

    //Team
    expect (await ABYSS.balanceOf(vestingSchedule[0]['beneficiary'])).to.equal(getBigNumber(1440000));
    //Strategic
    expect (await ABYSS.balanceOf(vestingSchedule[1]['beneficiary'])).to.equal(getBigNumber(5250000));
    //Marketing
    expect (await ABYSS.balanceOf(vestingSchedule[2]['beneficiary'])).to.equal(getBigNumber(2250000));
    //Investors
    expect (await ABYSS.balanceOf(vestingSchedule[3]['beneficiary'])).to.equal(getBigNumber(1500000));
  })
});
