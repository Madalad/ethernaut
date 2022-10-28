const { assert, expect } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("11-Elevator", async function () {
    let deployer, attacker, elevator, elevatorAttack, building
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        //user = accounts[2]
        await deployments.fixture(["11"])
        elevator = await ethers.getContract("Elevator")
        building = await ethers.getContract("ElevatorAttack", attacker.address)
    })
    it("should reach the top floor", async function () {
        // Go to floors 1-10 and check top==true
        for (let floor = 0; floor < 10; floor++) {
            await building.goTo(10)
            const atTopNow = await elevator.top()
            assert(atTopNow)
        }
    })
})
