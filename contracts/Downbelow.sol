// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

library Address {
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Downbelow(Address): insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Downbelow(Address): unable to send value, recipient may have reverted");
    }

    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Downbelow(Address): low-level call failed");
    }

    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Downbelow(Address): low-level call with value failed");
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Downbelow(Address): insufficient balance for call");
        return _functionCallWithValue(target, data, value, errorMessage);
    }

    function _functionCallWithValue(address target, bytes memory data, uint256 weiValue, string memory errorMessage) private returns (bytes memory) {
        require(isContract(target), "Downbelow(Address): call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: weiValue }(data);
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "Downbelow(SafeERC20): approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "Downbelow(SafeERC20): decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "Downbelow(SafeERC20): low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "Downbelow(SafeERC20): ERC20 operation did not succeed");
        }
    }
}

library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);       
    }

    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Downbelow(Strings): hex length insufficient");
        return string(buffer);
    }    
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

contract Trustable is Context {
    address private _owner;
    mapping (address => bool) private _isTrusted;
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner {
        require(_owner == _msgSender(), "Downbelow(Trustable): Caller is not the owner");
        _;
    }

    modifier isTrusted {
        require(_isTrusted[_msgSender()] == true || _owner == _msgSender(), "Caller is not trusted");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Downbelow(Trustable): New owner is the zero address");
        _owner = newOwner;
    }

    function addTrusted(address user) public onlyOwner {
        _isTrusted[user] = true;
    }

    function removeTrusted(address user) public onlyOwner {
        _isTrusted[user] = false;
    }    
}

contract Pausable is Trustable {
    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused || _msgSender() == owner());
        _;
    }

    modifier whenPaused() {
        require(paused || _msgSender() == owner());
        _;
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function _pause() internal {
        paused = true;
    }

    function _unpause() internal {
        paused = false;
    }
}

contract Downbelow is Pausable {
    using SafeERC20 for IERC20;
    
    IERC20 private abyss;  // abyss address   

    bytes32 public DOMAIN_SEPARATOR;
    string constant public domainName = "Downbelow";
    string constant public version = "1";    

    address private downbelowSigner;            // admin public key
    mapping (address => uint256) public _nonces;

    bytes32 constant public DOWNBELOW_TYPEHASH = keccak256("Downbelow(address account,uint256 amount,uint256 credit,uint256 nonce,uint256 deadline)");

    // Deposit/Withdraw pools
    address private rewardPoolWallet;
    address private withdrawPoolWallet;
    address private depositPoolWallet;

    uint256 private creditTracking = 40000000; // just example value
    uint256 private depositId;
    uint256 private withdrawId;

    event SetAbyssAddress(address indexed newAbyssAddress);
    event Deposit(uint256 id, address from, uint256 amount, uint256 timestamp);
    event Withdraw(uint256 id, address to, uint256 amount, uint256 timestamp);

    constructor(
        address _token, 
        address _signer, 
        address _depositPoolWallet,
        address _withdrawPoolWallet, 
        address _rewardPoolWallet
    ) {
        require(_token != address(0x0), "Downbelow: INVALID_TOKEN_ADDRESS");
        require(_signer != address(0x0), "Downbelow: INVALID_ABYSS_SIGNER");

        abyss = IERC20(_token);
        downbelowSigner = _signer;
        depositPoolWallet = _depositPoolWallet;
        withdrawPoolWallet = _withdrawPoolWallet;
        rewardPoolWallet = _rewardPoolWallet;   

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
                keccak256(bytes(domainName)),
                keccak256(bytes(version)),
                block.chainid,
                address(this)
            )
        );
    }

    function getRewardPoolWallet() public view isTrusted returns(address) {
        return rewardPoolWallet;
    }

    function getWithdrawPoolWallet() public view isTrusted returns(address) {
        return withdrawPoolWallet;
    }

    function getDepositPoolWallet() public view isTrusted returns(address) {
        return depositPoolWallet;
    }

    function getCreditTracking() public view isTrusted returns(uint256) {
        return creditTracking;
    }

    function getCurrentTime() 
        public
        view
        returns(uint256) {
            return block.timestamp;
    }

    function setAbyssAddress(address _newAbyssAddress) external isTrusted {
        require(_newAbyssAddress != address(0x0), "Downbelow: INVALID_NEW_ABYSS_ADDRESS");
        abyss = IERC20(_newAbyssAddress);
        emit SetAbyssAddress(_newAbyssAddress);
    }   

    function setDepositPoolWallet(address _newDepositPool) external isTrusted {
        require(_newDepositPool != address(0x0), "Downbelow: INVALID_NEW_DEPOSIT_POOL");
        depositPoolWallet = _newDepositPool;
    }

    function setWithdrawPoolWallet(address _newWithdrawPool) external isTrusted {
        require(_newWithdrawPool != address(0x0), "Downbelow: INVALID_NEW_WITHDRAW_POOL");
        withdrawPoolWallet = _newWithdrawPool;
    }

    function setRewardPoolWallet(address _newRewardPool) external isTrusted {
        require(_newRewardPool != address(0x0), "Downbelow: INVALID_NEW_REWARD_POOL");
        rewardPoolWallet = _newRewardPool;
    }

    function updateCreditTracking(uint256 _creditTracking) external isTrusted {
        creditTracking = _creditTracking;
    }

    function deposit(uint256 amount, uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) external whenNotPaused {
        require(block.timestamp <= deadline, "Downbelow: INVALID_EXPIRATION IN DEPOSIT");
        uint256 currentValidNonce = _nonces[_msgSender()];

        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(DOWNBELOW_TYPEHASH, _msgSender(), amount, 0, currentValidNonce, deadline))
            )
        );
        
        require(downbelowSigner == ecrecover(digest, v, r, s), "Downbelow: INVALID_SIGNATURE IN DEPOSIT");

        _nonces[_msgSender()] = currentValidNonce + 1;
        creditTracking = creditTracking + amount;           // remove temporary if daily payout' implementation is failed
        depositId = depositId + 1;
        abyss.safeTransferFrom(_msgSender(), depositPoolWallet, amount);

        emit Deposit(depositId, _msgSender(), amount, getCurrentTime());
    }

    function withdraw(uint256 amount, uint256 credit, uint256 deadline, 
        uint8 v, bytes32 r, bytes32 s) external whenNotPaused {
        require(block.timestamp <= deadline, "Downbelow: INVALID_EXPIRATION IN WITHDRAW");
        require(amount <= creditTracking, "Downbelow: Withdrawal amount exceeds than onchain total credits");   // remove temporary if daily payout' implementation is failed

        uint256 currentValidNonce = _nonces[_msgSender()];

        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(DOWNBELOW_TYPEHASH, _msgSender(), amount, credit, currentValidNonce, deadline))
            )
        );

        require(downbelowSigner == ecrecover(digest, v, r, s), "Downbelow: INVALID_SIGNATURE IN WITHDRAW");   
        require(amount <= credit, "Downbelow: Withdrawal amount exceeds than your credit");

        _nonces[_msgSender()] = currentValidNonce + 1;   
        creditTracking = creditTracking - amount;               // remove temporary if daily payout' implementation is failed
        withdrawId = withdrawId + 1;
        abyss.safeTransferFrom(withdrawPoolWallet, _msgSender(), amount);

        emit Withdraw(withdrawId, _msgSender(), amount, getCurrentTime());
    }
}