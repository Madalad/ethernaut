const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const forta = await ethers.getContract("Forta")
    const doubleEntryPoint = await ethers.getContract("DoubleEntryPoint")

    await deploy("DetectionBot", {
        from: attacker,
        args: [forta.address, doubleEntryPoint.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "26"]
