const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("05-Token", async function () {
    let deployer, attacker, telephone
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["05"])
        token = await ethers.getContract("Token", deployer.address)
        tokenAttack = await ethers.getContract("TokenAttack", attacker.address)
    })
    it("should steal many tokens", async function () {
        // check attacker starts with 20 tokens
        const attackerInitialBalance = await token.balanceOf(attacker.address)
        assert.equal(attackerInitialBalance.toString(), ethers.utils.parseUnits("20", 18))
        // attack
        await tokenAttack.attack()
        // check attacker balance = max uint256 value
        const attackerBalance = await token.balanceOf(attacker.address)
        const maxUint256 = ethers.BigNumber.from(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        )
        assert(attackerBalance.toString(), maxUint256.toString())
    })
})
