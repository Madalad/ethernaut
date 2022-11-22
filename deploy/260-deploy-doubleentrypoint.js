const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, attacker } = await getNamedAccounts()

    await deploy("CryptoVault", {
        from: deployer,
        args: [attacker],
        value: 0,
        log: true,
    })
    const cryptoVault = await ethers.getContract("CryptoVault")

    await deploy("LegacyToken", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })
    const legacyToken = await ethers.getContract("LegacyToken")
    await legacyToken.mint(cryptoVault.address, ethers.utils.parseEther("100"))

    await deploy("Forta", {
        from: attacker,
        args: [],
        value: 0,
        log: true,
    })
    const forta = await ethers.getContract("Forta")

    await deploy("DoubleEntryPoint", {
        from: deployer,
        args: [legacyToken.address, cryptoVault.address, forta.address, attacker],
        value: 0,
        log: true,
    })

    const doubleEntryPoint = await ethers.getContract("DoubleEntryPoint")
    await legacyToken.delegateToNewContract(doubleEntryPoint.address)
    await cryptoVault.setUnderlying(doubleEntryPoint.address)

    log("---------------------------------")
}

module.exports.tags = ["all", "26"]
