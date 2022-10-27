const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("Force", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "07"]
