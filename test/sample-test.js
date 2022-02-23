const { expect } = require("chai");
const { ethers } = require("hardhat");

let ABYSS, DOWNBELOW;
let domain = {
    name: 'Downbelow',
    version: '1',
    chainId: 31337,
    verifyingContract: '0x3CC5A9309f690aA430BF2145537a8eb4337aC617'
}

const types = {
    Downbelow: [
        {name: "account", type: "address"},  
        {name: "amount", type: "uint256"},
        {name: "credit", type: "uint256"},
        {name: "nonce", type: "uint256"},
        {name: "deadline", type: "uint256"},
      ]
};

function getBigNumber(value) {
    return ethers.utils.parseEther(value.toString());
}

describe("Downbelow Tests", function() {
    this.beforeEach(async function() {

        [account1, account2, account3, account4, account5] = await ethers.getSigners();

        const abyss = await ethers.getContractFactory("ABYSSF");      
        ABYSS = await abyss.deploy();
        await ABYSS.deployed();

        const downbelow = await ethers.getContractFactory("Downbelow");
        DOWNBELOW = await downbelow.deploy(
            ABYSS.address,
            account1.address, //signer
            account2.address, //depositPoolWallet
            account3.address, //withdrawPoolWallet
            account4.address  //rewardPoolWallet
        );

        await DOWNBELOW.deployed();

        console.log("DOWNBELOW deployed:", DOWNBELOW.address);

        domain.verifyingContract = DOWNBELOW.address;
    })

    it("Deposit_Withdraw", async function() {
        [account1, account2, account3, account4, account5] = await ethers.getSigners();

        //account5: transfer to user
        await ABYSS.connect(account1).transfer(account5.address, getBigNumber(200000));
        //withdraw: transfer to withdrawWallet
        await ABYSS.connect(account1).transfer(account3.address, getBigNumber(1200000));

        //exclude fee
        await ABYSS.connect(account1).excludeFromFee(account2.address);
        await ABYSS.connect(account1).excludeFromFee(account3.address);

        //approve
        await ABYSS.connect(account5).approve(DOWNBELOW.address, getBigNumber(200000));
        await ABYSS.connect(account3).approve(DOWNBELOW.address, getBigNumber(1200000));

        //deposit
        let value = {
            account: account5.address,
            amount: getBigNumber(2000),
            credit: 0,
            nonce: 0,
            deadline: 1685499796 
        };
        let signature = await account1._signTypedData(domain, types, value);
        const { r, s, v } = ethers.utils.splitSignature(signature);

        await DOWNBELOW.connect(account5).deposit(getBigNumber(2000), 1685499796, v, r, s);

        //after deposit
        console.log("=====================after deposit=======================");
        console.log("user balance: ", (await ABYSS.balanceOf(account5.address)));
        console.log("depositPoolWallet balance: ", (await ABYSS.balanceOf(account2.address)));

        //withdraw
        value = {
            account: account5.address,
            amount: getBigNumber(1000),
            credit: getBigNumber(2000),
            nonce: 1,
            deadline: 1685499796 
        };
        let signature1 = await account1._signTypedData(domain, types, value);
        let split_data = ethers.utils.splitSignature(signature1);
        await DOWNBELOW.connect(account5).withdraw(getBigNumber(1000), getBigNumber(2000), 1685499796, split_data.v, split_data.r, split_data.s);

        //after withdraw
        console.log("=====================after withdraw=======================");
        console.log("user balance: ", (await ABYSS.balanceOf(account5.address)));
        console.log("withdrawPoolWallet balance: ", (await ABYSS.balanceOf(account3.address)));
    })
})