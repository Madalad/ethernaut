const { ethers } = require("hardhat")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("Recovery", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    const name = "Simple Token"
    const creator = deployer
    const initialSupply = ethers.utils.parseEther("100")
    await deploy("SimpleToken", {
        from: deployer,
        args: [name, creator, initialSupply],
        value: 0,
        log: true,
    })

    // send ether to obtain tokens
    const simpleToken = await ethers.getContract("SimpleToken")
    const { deployer: deployerSigner } = await ethers.getNamedSigners()
    await deployerSigner.sendTransaction({
        to: simpleToken.address,
        value: ethers.utils.parseEther("0.001"),
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "17"]
