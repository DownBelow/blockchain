const { expect } = require("chai");
const { ethers } = require("hardhat");

let ABYSS, VESTING;

describe("ABYSS Token Tests", function() {
  this.beforeEach(async function() {
    
    [account1] = await ethers.getSigners();
    
    const abyss = await ethers.getContractFactory("ABYSS");
    ABYSS = await abyss.deploy();
    await ABYSS.deployed();

    const vesting = await ethers.getContractFactory("ABYSSVesting");
    VESTING = await vesting.deploy(ABYSS.address);
    await VESTING.deployed();
  })

  it("Simple Test", async function() {
    [account1, account2, account3] = await ethers.getSigners();
    // expect (await binamon_cash.balanceOf(account3.address)).to.equal(50000);
    let _balance = await ABYSS.balanceOf(account1.address);
    console.log("initial========>", _balance);
    // 100000000
    await ABYSS.connect(account1).transfer(VESTING.address, 100000000);

    _balance = await ABYSS.balanceOf(account1.address);
    _totalSupply = await ABYSS.totalSupply();

    console.log("after========>", _balance, _totalSupply);

    //exclude
    await ABYSS.connect(account1).excludeFromFee(VESTING.address);

    //launch date
    //2022 01 25
    await VESTING.connect(account1).setLaunchDate(1643036400);


    await VESTING.connect(account1).setCurrentTime(1643295600);


    await VESTING.connect(account1).createVestingSchedule(account2.address, 3000000,
        [0, 
        2678400,  //02-
        2419200,  //03- 
        2678400], //04-
        [500000, 500000, 800000, 1200000]);


    await VESTING.connect(account1).createVestingSchedule(account3.address, 4100000,
          [2678400, //02-
          2419200, //03- 
          2678400, //04-
          2592000, //05-
          2678400, //06-
          2592000 //07
        ], 
          [500000, 
          800000, 
          900000, 
          1500000,
          200000,
          200000]);

      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))
      await VESTING.connect(account1).release();
      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))
      
      await VESTING.connect(account1).release();
      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))

      await VESTING.connect(account1).setCurrentTime(1645801200);
      console.log("2022-02-25--------------------")
      await VESTING.connect(account1).release();
      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))

      console.log("getVestingSchedule:", await VESTING.getVestingSchedule(0))

      await VESTING.connect(account1).setCurrentTime(1650812400);
      console.log("2022-04-25--------------------")
      await VESTING.connect(account1).release();
      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))

      console.log("getVestingSchedule:", await VESTING.getVestingSchedule(0))
      console.log("getVestingSchedule:", await VESTING.getVestingSchedule(1))



      await VESTING.connect(account1).setCurrentTime(1656082800);
      console.log("2022-06-25--------------------")
      await VESTING.connect(account1).release();
      console.log("account2", await ABYSS.balanceOf(account2.address))
      console.log("account3", await ABYSS.balanceOf(account3.address))

      console.log("getVestingSchedule:", await VESTING.getVestingSchedule(0))
      console.log("getVestingSchedule:", await VESTING.getVestingSchedule(1))
  })
});
