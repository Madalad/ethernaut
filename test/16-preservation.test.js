const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("16-Preservation", async function () {
    let deployer, attacker, preservation, preservationAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["16"])
        preservation = await ethers.getContract("Preservation")
        preservationAttack = await ethers.getContract("PreservationAttack", attacker.address)
    })
    it("should change owner to attacker", async function () {
        assert.equal(await preservation.owner(), deployer.address)
        await preservationAttack.attack()
        assert.equal(await preservation.owner(), attacker.address)
    })
})
