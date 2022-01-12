// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "./dependencies/Context.sol";
import "./dependencies/Ownable.sol";
import "./dependencies/interface/IERC20.sol";
import "./dependencies/libraries/SafeMath.sol";
import "./dependencies/libraries/Address.sol";

contract ABYSS is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    string private _name = "$ABYSS";
    string private _symbol = "$ABYSS";
    uint8 private _decimals = 9;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;

    bool inSwapAndLiquify;

    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }

    constructor ()  {    
    }
}