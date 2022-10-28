const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const king = await ethers.getContract("King")

    await deploy("KingAttack", {
        from: attacker,
        args: [king.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "09"]
