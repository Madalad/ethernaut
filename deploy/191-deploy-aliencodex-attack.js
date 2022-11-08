const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const alienCodex = await ethers.getContract("AlienCodex")

    await deploy("AlienCodexAttack", {
        from: attacker,
        args: [alienCodex.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "19"]
