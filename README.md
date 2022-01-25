# ABYSS-Final.sol
This token was developed based on reflection token model(safeMoon).

Total Supply: 100,000,000
Decimals:     18

# ABYSSVesting-Final.sol

distribution ABYSS Token
- Total                             100%                100,000,000     
- PublicSale                        25%                 25,000,000                    
- Liquidity                         10%                 10,000,000      
    (Vesting 1year)
- P2E Rewards                       30%                 30,000,000      
    (No vesting)
- Team                              18%                 18,000,000      
    (Vesting 1year: first 4 months-4%, next 4 months-8%, last 4 months-13%)
- Strategic Partnerships            7%                  7,000,000
    (Vesting 3 months: 25% on launch and 25% each month)
- Reserve Funds                     3%                  3,000,000
    (No vesting)
- Marketing                         3%                  3,000,000
    (Vesting 3 months: 25% on launch and 25% each month)
- Investors                         2%                  2,000,000
    (Vesting 3 months: 25% on launch and 25% each month)
- Community / Airdrop               2%                  2,000,000
    (No vesting)

Each distribution corresponds to one VestingSchedule structure.
 * initialized: this is true by default.
 * beneficiary: This is wallet which receives unlock tokens after vesting period.
   We can set different wallets for each distribution or set the same wallet for all distributions
 * amountTotal: This is total vesting amount(token supply) for each distribution
 It will decrease each time the vesting amount is released.
 * durations: This is array of vesting period(calculated by seconds) for each distribution
 * releaseAmounts: This is array of release amount for each vesting period.
 * released: This will be set true when user releases all vested amounts from distribution.
 * revoked: This will be set true when user revokes vesting of distribution.
 * startIndex: When admin releases tokens , it will indicate index of durations which is still vesting period.
 * vestedEnd: When admin releases tokens, it will be set as last vesting time. (UNIX timestamp)

<h1>ex- </h1>
durations <br/>
[ <br/>
    &nbsp&nbsp&nbsp0,       // 0 day <br/>
    &nbsp&nbsp&nbsp2678400, // 31 days <br/>
    &nbsp&nbsp&nbsp2419200, // 28 days<br/>
    &nbsp&nbsp&nbsp2678400  // 31 days<br/>
]<br/>
releaseAmounts<br/>
[<br/>
    &nbsp&nbsp&nbsp500000,<br/>
    &nbsp&nbsp&nbsp500000,<br/>
    &nbsp&nbsp&nbsp800000,<br/>
    &nbsp&nbsp&nbsp1200000<br/>
]<br/>
   - when token launch date is 2022-01-24,<br/>
    and you release in 2022-01-25<br/>
       &nbsp&nbsp&nbsp* startIndex will be 1<br/>
       &nbsp&nbsp&nbsp* vestedEnd will be 2022-01-24<br/>
       &nbsp&nbsp&nbsp* amountTotal will be 2500000<br/>
       <p></p>
   - when you release in 2022-03-28<br/>
       &nbsp&nbsp&nbsp* startIndex will be 3<br/>
       &nbsp&nbsp&nbsp* vestedEnd will be 2022-03-24<br/>
       &nbsp&nbsp&nbsp* amountTotal will be 1200000<br/>

<h1>Methods- </h1>
<p></p>
- <strong>createVestingSchedule</strong><br/>
add distribution to VestingScheduleArray<br/>
<p></p>
- <strong>release</strong><br/>
release vesting amount from all registered distributions. <br/>
Corresponding wallet will receive released amounts.<br/>
<p></p>
- <strong>revoke</strong><br/>
Revoke vesting for distribution set as parameter <br/>
   &nbsp&nbsp&nbsp* get releasableamount from contract<br/>
   &nbsp&nbsp&nbsp* set revoke as true<br/>
