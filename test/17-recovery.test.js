const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("17-Recovery", async function () {
    let deployer, attacker, recovery, simpleToken, recoveryAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["17"])
        recovery = await ethers.getContract("Recovery")
        simpleToken = await ethers.getContract("SimpleToken")
        recoveryAttack = await ethers.getContract("RecoveryAttack", attacker.address)
    })
    it("should remove ether from SimpleToken contract", async function () {
        // assume we do not have the contract object, only the address
        const simpleTokenAddress = simpleToken.address

        // check simpleToken contract has 0.001 ether
        assert.equal(
            (await ethers.provider.getBalance(simpleTokenAddress)).toString(),
            ethers.utils.parseEther("0.001").toString()
        )

        // call attack() to drain ether to attacker
        const balanceBefore = await attacker.getBalance()
        const tx = await recoveryAttack.attack(simpleTokenAddress, attacker.address)
        const txReceipt = await tx.wait()
        const spentOnGas = txReceipt.effectiveGasPrice.mul(txReceipt.gasUsed)
        const balanceAfter = await attacker.getBalance()

        // check balances
        assert.equal(
            balanceAfter.toString(),
            balanceBefore.add(ethers.utils.parseEther("0.001")).sub(spentOnGas).toString()
        )
        assert.equal((await ethers.provider.getBalance(simpleTokenAddress)).toString(), "0")
    })
})
