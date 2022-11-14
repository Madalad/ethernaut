const { ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, attacker } = await getNamedAccounts()

    await deploy("DexTwo", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    const dexTwo = await ethers.getContract("DexTwo")

    const oneDeploy = await deploy("SwappableTokenTwo", {
        from: deployer,
        args: [dexTwo.address, "Token1", "ONE", ethers.utils.parseUnits("110", 18)],
        value: 0,
        log: true,
    })

    const twoDeploy = await deploy("SwappableTokenTwo", {
        from: deployer,
        args: [dexTwo.address, "Token2", "TWO", ethers.utils.parseUnits("110", 18)],
        value: 0,
        log: true,
    })

    // send dexTwo contract 100 of each token, attacker 10 of each token
    const one = await ethers.getContractAt("SwappableTokenTwo", oneDeploy.address)
    const two = await ethers.getContractAt("SwappableTokenTwo", twoDeploy.address)
    await one.transfer(attacker, ethers.utils.parseUnits("10", 18))
    await two.transfer(attacker, ethers.utils.parseUnits("10", 18))
    await one.transfer(dexTwo.address, ethers.utils.parseUnits("100", 18))
    await two.transfer(dexTwo.address, ethers.utils.parseUnits("100", 18))

    await dexTwo.setTokens(one.address, two.address)

    log("---------------------------------")
}

module.exports.tags = ["all", "23"]
