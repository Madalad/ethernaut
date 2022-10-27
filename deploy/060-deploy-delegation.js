const { ethers } = require("hardhat")
require("dotenv").config()

//======= INPUTS =======================================
const contractName = "Token"
const args = []
const value = ethers.utils.parseEther("0")
//======================================================

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const delegate = await deploy("Delegate", {
        from: deployer,
        args: [deployer],
        value: value,
        log: true,
    })

    const delegateContract = await ethers.getContract("Delegate")
    const delegateAddress = delegateContract.address
    const delegation = await deploy("Delegation", {
        from: deployer,
        args: [delegateAddress],
        value: value,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "06"]
