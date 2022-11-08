const { deployments, ethers } = require("hardhat")

describe("18-MagicNum", async function () {
    let deployer, attacker, magicNumAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["18"])
        magicNumAttack = await ethers.getContract("MagicNumAttack", attacker.address)
    })
    it("should return 42", async function () {
        await magicNumAttack.attack()
    })
})
