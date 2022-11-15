const { ethers } = require("hardhat")

async function main() {
    // Script to pass the ethernaut level on goerli testnet
    const instance = "0xcB464d21DE88e5C7863d5c9901B762e2814B27B1"
    const password = await ethers.provider.getStorageAt(instance, 1)
    console.log(password)
}

main()
