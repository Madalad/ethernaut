const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("03-CoinFlip", async function () {
    let deployer, attacker, coinFlip
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["03"])
        coinFlip = await ethers.getContract("CoinFlip", deployer.address)
        coinFlipAttack = await ethers.getContract("CoinFlipAttack", attacker.address)
    })
    it("should win flip 10 times in a row", async function () {
        // call attack 10 times
        const n = 10
        for (let i = 0; i < n; i++) {
            await coinFlipAttack.attack()
        }
        // check if consecutiveWins == 10
        const consecutiveWins = await coinFlip.consecutiveWins()
        assert.equal(consecutiveWins.toString(), n.toString())
    })
})
