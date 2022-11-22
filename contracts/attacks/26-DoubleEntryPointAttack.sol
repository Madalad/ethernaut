// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lessons/26-DoubleEntryPoint.sol";

contract DetectionBot is IDetectionBot {
    Forta forta;
    DoubleEntryPoint doubleEntryPoint;

    constructor(address _fortaAddress, address _doubleEntryPointAddress) {
        forta = Forta(_fortaAddress);
        doubleEntryPoint = DoubleEntryPoint(_doubleEntryPointAddress);
    }

    function handleTransaction(address user, bytes calldata msgData) external override {
        bytes memory sig = abi.encodeWithSignature(
            "delegateTransfer(address,uint256,address)",
            user,
            100 ether,
            doubleEntryPoint.cryptoVault()
        );
        bytes memory data = msgData;
        if (areEqual(sig, data)) {
            forta.raiseAlert(user);
        }
    }

    function areEqual(bytes memory a, bytes memory b) internal pure returns (bool) {
        return keccak256(a) == keccak256(b);
    }
}
