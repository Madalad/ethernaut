const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const motorbike = await ethers.getContract("Motorbike")

    await deploy("MotorbikeAttack", {
        from: attacker,
        args: [motorbike.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "25"]
