// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("Tether USDT", "USDT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}