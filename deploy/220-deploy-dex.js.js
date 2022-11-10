const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, attacker } = await getNamedAccounts()

    await deploy("Dex", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    const dex = await ethers.getContract("Dex")

    const oneDeploy = await deploy("SwappableToken", {
        from: deployer,
        args: [dex.address, "Token1", "ONE", ethers.utils.parseUnits("110", 18)],
        value: 0,
        log: true,
    })

    const twoDeploy = await deploy("SwappableToken", {
        from: deployer,
        args: [dex.address, "Token2", "TWO", ethers.utils.parseUnits("110", 18)],
        value: 0,
        log: true,
    })

    // send dex contract 100 of each token, attacker 10 of each token
    const one = await ethers.getContractAt("SwappableToken", oneDeploy.address)
    const two = await ethers.getContractAt("SwappableToken", twoDeploy.address)
    await one.transfer(attacker, ethers.utils.parseUnits("10", 18))
    await two.transfer(attacker, ethers.utils.parseUnits("10", 18))
    await one.transfer(dex.address, ethers.utils.parseUnits("100", 18))
    await two.transfer(dex.address, ethers.utils.parseUnits("100", 18))

    await dex.setTokens(one.address, two.address)

    log("---------------------------------")
}

module.exports.tags = ["all", "22"]
