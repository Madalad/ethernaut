const { ethers } = require("hardhat")
require("dotenv").config()

//======= INPUTS =======================================
const contractName = "Fallout"
const args = []
const value = ethers.utils.parseEther("0")
//======================================================

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const contract = await deploy(contractName, {
        from: deployer,
        args: args,
        value: value,
        log: true,
        //waitConfirmations: 1,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "02"]
