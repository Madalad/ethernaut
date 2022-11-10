const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    await deploy("DenialAttack", {
        from: attacker,
        args: [],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "20"]
