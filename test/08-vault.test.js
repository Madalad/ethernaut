const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("08-Vault", async function () {
    let deployer, attacker, vault
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["08"])
        vault = await ethers.getContract("Vault")
    })
    it("should unlock the vault", async function () {
        assert(await vault.locked())

        // get password
        const password = await ethers.provider.getStorageAt(vault.address, 1)

        // unlock vault
        await vault.unlock(password)
        assert(!(await vault.locked()))
    })
})
