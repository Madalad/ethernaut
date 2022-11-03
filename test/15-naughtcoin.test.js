const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("15-NaughtCoin", async function () {
    let deployer, attacker, naughtCoin, naughtCoinAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["15"])
        naughtCoin = await ethers.getContract("NaughtCoin")
        naughtCoinAttack = await ethers.getContract("NaughtCoinAttack", attacker.address)
    })
    it("should send tokens to attack contract", async function () {
        assert.equal(
            (await naughtCoin.balanceOf(attacker.address)).toString(),
            (await naughtCoin.INITIAL_SUPPLY()).toString()
        )

        // approve attack contract to spend attackers NaughtCoin
        await naughtCoin
            .connect(attacker)
            .approve(naughtCoinAttack.address, await naughtCoin.INITIAL_SUPPLY())

        // transfer coins using ERC20.transferFrom()
        await naughtCoinAttack.attack()

        // check balances
        assert.equal((await naughtCoin.balanceOf(attacker.address)).toString(), "0")
        assert.equal(
            (await naughtCoin.balanceOf(naughtCoinAttack.address)).toString(),
            (await naughtCoin.INITIAL_SUPPLY()).toString()
        )
    })
})
