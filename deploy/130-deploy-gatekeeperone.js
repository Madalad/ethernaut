require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    await deploy("GatekeeperOne", {
        from: deployer,
        args: [],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "13"]
