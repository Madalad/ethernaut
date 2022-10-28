const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const password = ethers.utils.formatBytes32String("password")

    await deploy("Vault", {
        from: deployer,
        args: [password],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "08"]
