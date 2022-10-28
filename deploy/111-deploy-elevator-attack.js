const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    const elevator = await ethers.getContract("Elevator")

    await deploy("ElevatorAttack", {
        from: attacker,
        args: [elevator.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "11"]
