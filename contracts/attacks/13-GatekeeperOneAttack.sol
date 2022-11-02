// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/13-GatekeeperOne.sol";

contract GatekeeperOneAttack {
    GatekeeperOne gatekeeperOne;

    constructor(address _gatekeeperOneAddress) public {
        gatekeeperOne = GatekeeperOne(_gatekeeperOneAddress);
    }

    function enter(bytes8 _gateKey) public returns (bool) {
        gatekeeperOne.enter(_gateKey);
    }
}
