const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("King", {
        from: deployer,
        args: [],
        value: ethers.utils.parseEther("1"),
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "09"]
