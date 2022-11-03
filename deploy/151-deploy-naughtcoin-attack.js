const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const naughtCoin = await ethers.getContract("NaughtCoin")

    await deploy("NaughtCoinAttack", {
        from: attacker,
        args: [naughtCoin.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "15"]
