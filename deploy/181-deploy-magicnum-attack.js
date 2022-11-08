const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await ethers.getNamedSigners()

    const magicNum = await ethers.getContract("MagicNum")

    await deploy("MagicNumAttack", {
        from: attacker.address,
        args: [magicNum.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "18"]
