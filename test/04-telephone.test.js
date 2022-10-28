const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("04-Telephone", async function () {
    let deployer, attacker, telephone, telephoneAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["04"])
        telephone = await ethers.getContract("Telephone")
        telephoneAttack = await ethers.getContract("TelephoneAttack", attacker.address)
    })
    it("should transfer ownership to attacker", async function () {
        // get initial owner
        const owner = await telephone.owner()
        assert.equal(owner, deployer.address)

        // change owner
        await telephoneAttack.changeOwner()

        // check
        const newOwner = await telephone.owner()
        assert.equal(newOwner, attacker.address)
    })
})
