const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("14-GatekeeperTwo", async function () {
    let deployer, attacker, gatekeeperTwo, gatekeeperTwoAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["14"])
        gatekeeperTwo = await ethers.getContract("GatekeeperTwo")
        gatekeeperTwoAttack = await ethers.getContract("GatekeeperTwoAttack", attacker.address)
    })
    it("should make it past the gates", async function () {
        /*
        To pass gateOne:
            use attack contract to call enter()

        To pass gateTwo:
            size of caller contracts code must be zero
            => gatekeeperTwoAttack must call enter() in the constructor

        To pass gateThree:
            xor expression must result in max uint64
            => gateKey must be reverse calculated
                (x ^ y = MAX <=> MAX - x = y, in binary)
        */
        assert.equal(await gatekeeperTwo.entrant(), attacker.address)
    })
})
