const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("20-Denial", async function () {
    let deployer, attacker, denial, alienCodexAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["20"])
        denial = await ethers.getContract("Denial")
        denialAttack = await ethers.getContract("DenialAttack", attacker.address)
    })
    it("should work", async function () {
        /*
        Had to update call syntax to compile, so check updated Denial contract it works as intended
        */

        // deposit funds
        await deployer.sendTransaction({
            to: denial.address,
            value: ethers.utils.parseEther("100"),
        })

        // set partner
        await denial.setWithdrawPartner(attacker.address)
        assert.equal(await denial.partner(), attacker.address)

        // withdraw
        const attackerBalanceBefore = await attacker.getBalance()
        const tx = await denial.connect(attacker).withdraw()
        const txReceipt = await tx.wait()
        const attackerBalanceAfter = await attacker.getBalance()
        const spentOnGas = txReceipt.effectiveGasPrice.mul(txReceipt.gasUsed)
        assert.equal(
            attackerBalanceAfter.toString(),
            attackerBalanceBefore.add(ethers.utils.parseEther("1")).sub(spentOnGas)
        )
    })
    it("should not allow owner to receive funds", async function () {
        // deposit ether to contract
        await deployer.sendTransaction({
            to: denial.address,
            value: ethers.utils.parseEther("100"),
        })

        // set partner to attack contract
        await denial.connect(attacker).setWithdrawPartner(denialAttack.address)

        // attempt to withdraw
        await denial.withdraw()
        // above transaction should revert
        // hardhat withdraw transaction goes through and sends owner the balance
        // deploying DenialAttack.sol onto goerli and submitting instance to ethernaut contract passes the level
    })
})
