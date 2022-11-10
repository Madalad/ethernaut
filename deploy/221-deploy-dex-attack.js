const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const dex = await ethers.getContract("Dex")

    await deploy("DexAttack", {
        from: attacker,
        args: [dex.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "22"]
