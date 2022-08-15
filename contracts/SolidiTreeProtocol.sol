// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";
//import "@openzeppelin/contracts/access/IAccessControl.sol";
import "./SolidiTreeNft.sol";
import "hardhat/console.sol";

contract SolidiTreeProtocol is ERC20Wrapper, AccessControl{
    bytes32 public constant WHITE_LISTED_ROLE = keccak256("WHITE_LISTED_ROLE");
    event stakeStartedAt(address owner, uint256 indexed startedAt);
    event stakeEndedAt(address owner, uint256 indexed endedAt);
    event stakeResumeAt(address owner, uint256 indexed resumeAt);
    SolidiTreeNft private _whitelist;
    mapping (address => bool) private isActive;
    mapping (address => bool) private isResume;
    mapping (address => uint256) private numberOfDeposits;
    //mapping (address => uint256) private startedDate;
    //mapping (address => uint256) private endedDate;
    
    constructor(IERC20 _underlying, string memory _name, string memory _symbol, address whitelist) ERC20(_name, _symbol) ERC20Wrapper(_underlying)  {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);       
        _whitelist = SolidiTreeNft(whitelist);
    } 

    function deposit(uint256 _amount) public payable {
		//require(msg.value > 0, "value can't be 0");
		require(approve(address(this),_amount), "approve failed");		
		require(msg.sender != address(0), "adress can't be adress 0");
		depositFor(msg.sender, _amount);
        numberOfDeposits[msg.sender]++;
        //startedDate[msg.sender] = block.timestamp;
        emit stakeStartedAt(msg.sender, block.timestamp);
        _isActive(msg.sender);
        _isResume(msg.sender);        
        _whitelist.contractGrantRole(WHITE_LISTED_ROLE, msg.sender);
	}

    function _isResume(address _owner) internal {
        if(numberOfDeposits[_owner] > 1) {
            isResume[_owner] = true;
        }
        else{
            isResume[_owner] = false;
        }
    }

    function _isActive(address _account) internal {
        if(balanceOf(_account) <= 0) {
            isActive[_account] = false;
        }else {
            isActive[_account] = true;  
        }
    }

    function isResuming(address _account) public view returns (bool) {
        return isResume[_account];
    }

    function depositIndex(address _account) public view returns (uint256) {
        return numberOfDeposits[_account];
    }

    function isStaking(address _account) public view returns (bool) {
        return isActive[_account];
    }

	function withdraw(uint256 _amount) public payable{
		require(_amount > 0, "amount can't be 0");
		require(msg.sender != address(0), "adress can't be adress 0");
		withdrawTo(msg.sender,_amount);
        _isActive(msg.sender);
        //endedDate[msg.sender] = block.timestamp;
        if(!isStaking(msg.sender)) {
            emit stakeEndedAt(msg.sender, block.timestamp);
        }        
	}

     function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20)        
    {
        super._afterTokenTransfer(from, to, amount);
    } 

    function _mint(address to, uint256 amount)
        internal
        override(ERC20)
    {
        super._mint(to, amount);
    }
 
    function _burn(address account, uint256 amount)
        internal
        override(ERC20)
    {
        super._burn(account, amount);
    }  
}