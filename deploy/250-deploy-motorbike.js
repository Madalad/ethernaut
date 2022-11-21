const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("Engine", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    const engine = await ethers.getContract("Engine")

    await deploy("Motorbike", {
        from: deployer,
        args: [engine.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "25"]
