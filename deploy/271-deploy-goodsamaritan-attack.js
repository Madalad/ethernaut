const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const goodSamaritan = await ethers.getContract("GoodSamaritan")

    await deploy("GoodSamaritanAttack", {
        from: attacker,
        args: [goodSamaritan.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "27"]
