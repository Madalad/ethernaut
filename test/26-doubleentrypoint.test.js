const { assert, expect } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("26-DoubleEntryPoint", async function () {
    let deployer, attacker, cryptoVault, doubleEntryPoint, legacyToken, forta, detectionBot
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["26"])

        cryptoVault = await ethers.getContract("CryptoVault", attacker.address)
        doubleEntryPoint = await ethers.getContract("DoubleEntryPoint")
        legacyToken = await ethers.getContract("LegacyToken")
        forta = await ethers.getContract("Forta", attacker.address)
        detectionBot = await ethers.getContract("DetectionBot")

        // check setup
        assert.equal(
            (await legacyToken.balanceOf(cryptoVault.address)).toString(),
            ethers.utils.parseEther("100")
        )
        assert.equal(
            (await doubleEntryPoint.balanceOf(cryptoVault.address)).toString(),
            ethers.utils.parseEther("100")
        )
        assert.equal(await cryptoVault.sweptTokensRecipient(), attacker.address)
        assert.equal(await cryptoVault.underlying(), doubleEntryPoint.address)
        assert.equal(await legacyToken.delegate(), doubleEntryPoint.address)
    })
    it("should sweep underlying token", async function () {
        // sweep underlying token using legacy token
        await cryptoVault.sweepToken(legacyToken.address)
        // assert
        assert.equal(
            (await doubleEntryPoint.balanceOf(attacker.address)).toString(),
            ethers.utils.parseEther("100")
        )
    })
    it("should revert using the detection bot", async function () {
        // set up detection bot
        await forta.setDetectionBot(detectionBot.address)
        // attempt to sweep underlying token
        await expect(cryptoVault.sweepToken(legacyToken.address)).to.be.revertedWith(
            "Alert has been triggered, reverting"
        )
    })
})
