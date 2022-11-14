const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const dexTwo = await ethers.getContract("DexTwo")

    await deploy("DexTwoAttack", {
        from: attacker,
        args: [dexTwo.address],
        value: 0,
        log: true,
    })

    await deploy("SwappableTokenTwo", {
        from: attacker,
        args: [dexTwo.address, "MyToken", "MY", ethers.utils.parseUnits("100", 18)],
        value: 0,
        log: true,
    })

    // set myToken address variable in attack contract
    const dexTwoAttack = await ethers.getContract("DexTwoAttack")
    const myToken = await ethers.getContract("SwappableTokenTwo")
    await dexTwoAttack.updateMyTokenAddress(myToken.address)

    log("---------------------------------")
}

module.exports.tags = ["all", "23"]
