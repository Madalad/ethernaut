const { assert } = require("chai")
const { deployments, ethers } = require("hardhat")

describe("13-GatekeeperOne", async function () {
    let deployer, attacker, gatekeeperOne, gatekeeperOneAttack
    beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        attacker = accounts[1]
        await deployments.fixture(["13"])
        gatekeeperOne = await ethers.getContract("GatekeeperOne")
        gatekeeperOneAttack = await ethers.getContract("GatekeeperOneAttack", attacker.address)
    })
    it("should make it past the gates", async function () {
        /*
        - bytes are stored in big endian format (zeros added on the right)
        - uint are stored in small endian format (zeros added on the left)
        - each bytes is two digits in hexadecimal
            - max value of one bytes is 255 (ff)
        */

        let gateKey

        //To pass gate one, simply call enter() using a smart contract (gatekeeperOneAttack)

        /* 
        To pass gateThree part three:
            uint32(uint64(gateKey)) must equal 31176 (uint16 of attacker address)
            => gateKey must end with "79c8"
        */
        gateKey = "0x00000000000079c8"

        /*
        To pass gateThree part two:
            gateKey must represent a number higher than uint32 max number
            => gateKey must have a non-zero digit in the first 8 digits
        */
        gateKey = "0x10000000000079c8"

        /*
        To pass gateThree part one:
            the 8th to 12th digits of gateKey must all be zero
            => 0x10000000000079c8 will pass
            => 0x000000000010798c will fail
            (already satisfied)
        */

        /*
        To pass gateTwo:
            use trial and error to find correct gas limit
        */
        async function getGasLimit() {
            let gasLimit
            for (let i = 0; i < 8192; i++) {
                try {
                    await gatekeeperOneAttack.enter(gateKey, { gasLimit: 500_000 + i })
                    console.log("success", i)
                    gasLimit = 500_000 + i
                    return gasLimit
                } catch (e) {}
            }
            console.log("Gas limit not found.")
            return 0
        }

        //const gasLimit = await getGasLimit()
        const gasLimit = 500974
        await gatekeeperOneAttack.enter(gateKey, { gasLimit: gasLimit })

        const entrant = await gatekeeperOne.entrant()
        assert.equal(entrant, attacker.address)
    })
})
