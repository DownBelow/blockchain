// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.1;

interface botProtect {
    function protect(address from, address to, uint256 amount) external;
    function isBot(address _addr) external view returns (bool);
    function setPairAddress(address _addr) external;
}