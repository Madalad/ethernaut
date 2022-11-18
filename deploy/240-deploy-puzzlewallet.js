const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("PuzzleWallet", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    const puzzleWallet = await ethers.getContract("PuzzleWallet")

    const admin = deployer
    const implementation = puzzleWallet.address
    const initData = puzzleWallet.interface.encodeFunctionData("init(uint256)", ["100"])
    await deploy("PuzzleProxy", {
        from: deployer,
        args: [admin, implementation, initData],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "24"]
