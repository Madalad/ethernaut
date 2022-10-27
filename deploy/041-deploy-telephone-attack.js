const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { attacker } = await getNamedAccounts()

    //======= INPUTS =======================================
    const contractName = "TelephoneAttack"
    const args = [(await ethers.getContract("Telephone")).address]
    const value = ethers.utils.parseEther("0")
    //======================================================

    const contract = await deploy(contractName, {
        from: attacker,
        args: args,
        value: value,
        log: true,
        //waitConfirmations: 1,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "04"]
