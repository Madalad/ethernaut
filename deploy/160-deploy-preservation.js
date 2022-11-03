const { ethers } = require("hardhat")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // Deploy two library contracts
    const factory = await ethers.getContractFactory("LibraryContract")
    const first = await factory.deploy()
    const second = await factory.deploy()

    // Deploy preservation contract
    await deploy("Preservation", {
        from: deployer,
        args: [first.address, second.address],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "16"]
