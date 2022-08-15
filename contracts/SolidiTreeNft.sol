// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract SolidiTreeNft is ERC721, ERC721Enumerable, AccessControl  {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    bytes32 public constant WHITE_LISTED_ROLE = keccak256("WHITE_LISTED_ROLE");
    bytes32 public constant SMART_CONTRACT_ROLE = keccak256("SMART_CONTRACT_ROLE");

    constructor() ERC721("SolidiTree", "Tree") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _tokenIdCounter.increment();        
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://simple-metadata-api.herokuapp.com/api/token/";
    }

    function contractGrantRole(bytes32 _role, address _account) public onlyRole(SMART_CONTRACT_ROLE) {
        console.log("running");
        _grantRole(_role, _account);
    }

    function safeMint() public onlyRole(WHITE_LISTED_ROLE) {
        require(balanceOf(msg.sender) == 0, "You already have tokens");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(from == address(0), "It's a Soul Bound Token"); 
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId); 
    }
}
