const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("27-GoodSamaritan", async function () {
    let deployer, attacker, goodSamaritan, coin, wallet, goodSamaritanAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["27"])
        goodSamaritan = await ethers.getContract("GoodSamaritan", attacker.address)
        coin = await ethers.getContractAt("Coin", await goodSamaritan.coin(), attacker.address)
        wallet = await ethers.getContractAt(
            "Wallet",
            await goodSamaritan.wallet(),
            attacker.address
        )
        goodSamaritanAttack = await ethers.getContract("GoodSamaritanAttack", attacker.address)
    })
    it("should drain all of the funds", async function () {
        // attack
        const initialBalance = await coin.balances(wallet.address)
        await goodSamaritanAttack.attack()
        // assert
        assert.equal(
            (await coin.balances(goodSamaritanAttack.address)).toString(),
            initialBalance.toString()
        )
        assert.equal((await coin.balances(wallet.address)).toString(), "0")
    })
})
