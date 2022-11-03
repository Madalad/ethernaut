require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer, attacker } = await getNamedAccounts()

    await deploy("NaughtCoin", {
        from: deployer,
        args: [attacker],
        value: 0,
        log: true,
    })

    log("---------------------------------")
}

module.exports.tags = ["all", "15"]
