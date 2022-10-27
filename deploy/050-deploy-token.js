const { ethers } = require("hardhat")
require("dotenv").config()

//======= INPUTS =======================================
const contractName = "Token"
const args = [ethers.utils.parseUnits("120", 18)]
const value = ethers.utils.parseEther("0")
//======================================================

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, attacker } = await getNamedAccounts()

    const token = await deploy(contractName, {
        from: deployer,
        args: args,
        value: value,
        log: true,
        //waitConfirmations: 1,
    })

    // Send 20 tokens to attacker
    const tokenContract = await ethers.getContract("Token")
    await tokenContract.transfer(attacker, ethers.utils.parseUnits("20", 18))

    log("---------------------------------")
}

module.exports.tags = ["all", "05"]
