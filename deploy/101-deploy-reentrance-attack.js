const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const reentrance = await ethers.getContract("Reentrance")

    await deploy("ReentranceAttack", {
        from: attacker,
        args: [reentrance.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "10"]
