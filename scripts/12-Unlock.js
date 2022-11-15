const { ethers } = require("hardhat")

async function main() {
    // Unlocks the Privacy contract on goerli testnet

    const { deployer } = await ethers.getNamedSigners()
    const instance = "0x0cA0f215857d33f1491aE679d54E5C79F008Ca81"

    const privacy = await ethers.getContractAt("Privacy", instance)

    function toBytes16(bytes32String) {
        return bytes32String.slice(0, 34)
    }

    const key = await ethers.provider.getStorageAt(privacy.address, 5)
    console.log("Key:", key)
    console.log("Unlocking...")
    const tx = await privacy.connect(deployer).unlock(toBytes16(key))
    await tx.wait()
    console.log("Contract unlocked!")
}

main()
