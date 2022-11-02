const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const gatekeeperOne = await ethers.getContract("GatekeeperOne")

    await deploy("GatekeeperOneAttack", {
        from: attacker,
        args: [gatekeeperOne.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "13"]
