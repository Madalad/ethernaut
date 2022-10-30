const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("Privacy", {
        from: deployer,
        args: [
            [
                "0x1000000000000000000000000000000000000000000000000000000000000000",
                "0x2000000000000000000000000000000000000000000000000000000000000000",
                "0x3000000000000000000000000000000000000000000000000000000000000000",
            ],
        ],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "12"]
