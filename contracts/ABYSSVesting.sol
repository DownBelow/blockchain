// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "./dependencies/interface/IERC20.sol";
import "./dependencies/libraries/SafeERC20.sol";
import "./dependencies/Trustable.sol";
import "./dependencies/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract ABYSSVesting is Trustable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct VestingSchedule {
        bool initialized;
        address  beneficiary;
        uint256 amountTotal;
        uint256[] durations;
        uint256[] releaseAmounts;
        bool revoked;
        bool released;
        uint256 startIndex;
        uint256 vestedEnd;
    }

    uint256 private currentTime;

    uint256 private start;
    uint256 private decimals = 18;
    IERC20 immutable private token;

    VestingSchedule[] private vestingSchedules;
    uint256 private vestingSchedulesTotalAmount;

    modifier onlyIfVestingScheduleExists(uint256 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true);
        _;
    }

    modifier onlyIfVestingScheduleValid(uint256 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true
             && !vestingSchedules[vestingScheduleId].revoked
             && !vestingSchedules[vestingScheduleId].released);
        _;
    }

    constructor(address token_) {
        require(token_ != address(0x0));
        token = IERC20(token_);
    }

    function setLaunchDate(uint256 _launchDate) external isTrusted {
        start = _launchDate;
    }

    function createVestingSchedule(
        address _beneficiary,
        uint256 _vestAmount,
        uint256[] memory _durations,
        uint256[] memory _releaseAmounts
    ) public isTrusted {
        require(_beneficiary != address(0), "beneficiary is the zero address!");
        require(this.getWithdrawableAmount() >= _vestAmount, 
        "Cannot create vesting schedule because not sufficient tokens");
        require(_durations.length == _releaseAmounts.length,
        "length miss match");

        uint256 _toReleaseSum;
        for(uint i = 0; i < _releaseAmounts.length; i ++) {
            _toReleaseSum = _toReleaseSum + _releaseAmounts[i];
        }
        require(_vestAmount == _toReleaseSum, "Vest amount not match");

        vestingSchedules.push(VestingSchedule(true, _beneficiary, _vestAmount, _durations, _releaseAmounts, false, false, 0, start));
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount + _vestAmount;
    }

    function release()
    public
    nonReentrant isTrusted {
        for(uint i = 0; i < vestingSchedules.length; i ++) {
            
            VestingSchedule storage vestingSchedule = vestingSchedules[i];

            if(vestingSchedule.released || vestingSchedule.revoked)
                continue;

            (uint _releaseAmount, uint _startIndex) = _computeReleasableAmount(vestingSchedule);

            console.log("_releaseAmount===>", _releaseAmount);

            if(_releaseAmount != 0) {
                vestingSchedule.amountTotal = vestingSchedule.amountTotal - _releaseAmount;
                if(vestingSchedule.amountTotal == 0) {
                    vestingSchedule.released = true;
                }
                else {
                    uint256 passedVestTime;
                    for(uint j = vestingSchedule.startIndex; j < _startIndex; j ++)
                        passedVestTime = passedVestTime + vestingSchedule.durations[j];

                    vestingSchedule.vestedEnd = vestingSchedule.vestedEnd + passedVestTime;
                }
                vestingSchedule.startIndex = _startIndex;
                vestingSchedulesTotalAmount = vestingSchedulesTotalAmount - _releaseAmount;
                token.safeTransfer(vestingSchedule.beneficiary, _releaseAmount);
            }
        }
    }

    function revoke(uint256 vestingScheduleId) public nonReentrant isTrusted onlyIfVestingScheduleValid(vestingScheduleId) {
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        (uint _releaseAmount,) = _computeReleasableAmount(vestingSchedule);
        if(_releaseAmount != 0) {
            token.safeTransfer(vestingSchedule.beneficiary, _releaseAmount);
        }
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount - vestingSchedule.amountTotal;
        vestingSchedule.revoked = true;
    }

    function getWithdrawableAmount()
    public 
    view 
    returns(uint256) {
        return token.balanceOf(address(this)) - vestingSchedulesTotalAmount;
    }

    function getCurrentTime() 
        internal
        virtual
        view
        returns(uint256) {
            // return block.timestamp;
            // return 1643295600;
            return currentTime;
    }

    function setCurrentTime(uint256 _currentTime) external isTrusted {
        currentTime = _currentTime;
    }

    function getToken()
        external 
        view
        returns(address) {
        return address(token);
    }

    function getVestingSchedulesTotalAmount()
    external
    view
    returns(uint256) {
        return vestingSchedulesTotalAmount;
    }

    function getVestingSchedule(uint256 vestingScheduleId)
    public view onlyIfVestingScheduleExists(vestingScheduleId) returns(uint256, bool, bool, uint256, uint256) {
        VestingSchedule memory vestingSchedule = vestingSchedules[vestingScheduleId];
        return (vestingSchedule.amountTotal, vestingSchedule.revoked, vestingSchedule.released, vestingSchedule.startIndex, vestingSchedule.vestedEnd);
    }

    function getLaunchDate()
    external
    view 
    returns(uint256) {
        return start;
    }

    function _computeReleasableAmount(VestingSchedule memory vestingSchedule)
    internal
    view
    returns(uint256, uint256) {
        uint _releaseAmount;
        uint _startIndex;
        for(uint i = vestingSchedule.startIndex; i < vestingSchedule.durations.length; i ++) {
            if(getCurrentTime() >= vestingSchedule.durations[i] + vestingSchedule.vestedEnd) {
                _releaseAmount = _releaseAmount + vestingSchedule.releaseAmounts[i];
                vestingSchedule.vestedEnd = vestingSchedule.vestedEnd + vestingSchedule.durations[i];
            }
            else {
                _startIndex = i;
                break;
            }
        }
        return (_releaseAmount, _startIndex);
    }
}