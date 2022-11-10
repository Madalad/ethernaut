const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("21-Shop", async function () {
    let deployer, attacker, shop, shopAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["21"])
        shop = await ethers.getContract("Shop")
        shopAttack = await ethers.getContract("ShopAttack", attacker.address)
    })
    it("should buy item for less than price", async function () {
        await shopAttack.buy()
        assert(await shop.isSold())
        assert((await shop.price()).lt(100))
    })
})
