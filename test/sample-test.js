const { expect } = require("chai");
const { ethers } = require("hardhat");

let ABYSS;

describe("ABYSS Token Tests", function() {
  this.beforeEach(async function() {
    
    [account1] = await ethers.getSigners();
    
    const abyss = await ethers.getContractFactory("ABYSS");
    ABYSS = await abyss.deploy();
    await ABYSS.deployed();

  })

  it("Simple Test", async function() {
  })
});
