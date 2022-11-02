const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const gatekeeperTwo = await ethers.getContract("GatekeeperTwo")

    await deploy("GatekeeperTwoAttack", {
        from: attacker,
        args: [gatekeeperTwo.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "14"]
