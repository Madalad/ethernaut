// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../lessons/18-MagicNum.sol";

contract MagicNumAttack {
    MagicNum magicNum;

    constructor(address magicNumAddress) public {
        magicNum = MagicNum(magicNumAddress);
    }

    /**
     * Runtime opcodes:
     * store 42 in memory:
     *  - push 42
     *      - PUSH1 0x2a (0x60 0x2a)
     *  - push 0 (memory location to store 42)
     *      - PUSH1 0x00 (0x60 0x00)
     *  - store 42 in memory location 0
     *      - MSTORE (0x52)
     * return stored value:
     *  - push return value size (32 bytes)
     *      - PUSH1 0x20 (0x60 0x20)
     *  - push location of return value (00)
     *      - PUSH1 0x00 (0x60 0x00)
     *  - return
     *      - RETURN (0xf3)
     * final bytecode: 602a60005260206000f3
     *
     * Initialization opcodes:
     * copy code
     *  - push 0xa0 (10 bytes = length of runtime code)
     *      - PUSH1 0xa0 (0x60 0xa0)
     *  - push current position of runtime opcode (not known yet)
     *      - PUSH1 0x?? (0x60 0x??)
     *  - push destination
     *      - PUSH1 0x00 (0x60 0x00)
     *  - codecopy
     *      - CODECOPY (0x39)
     * return runtime opcode to evm
     *  - push size of opcode (10 bytes)
     *      - PUSH1 0xa0 (0x60 0xa0)
     *  - push slot containing code (0)
     *      - PUSH1 0x00 (0x60 0x00)
     *  - return
     *      - RETURN (0xf3)
     * initialization opcode is 12 bytes long, so ??=12=0x0c
     * final bytecode: 600a600c600039600a6000f3
     *
     * Final combined bytecode: 600a600c600039600a6000f3602a60005260206000f3
     */
    function attack() public {
        bytes
            memory code = "\x60\x0a\x60\x0c\x60\x00\x39\x60\x0a\x60\x00\xf3\x60\x2a\x60\x00\x52\x60\x20\x60\x00\xf3";
        address solver;

        assembly {
            solver := create(0, add(code, 0x20), mload(code))
        }

        magicNum.setSolver(solver);
    }

    function test() public pure returns (uint256) {
        return 26;
    }
}
