require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
const { ethers } = require('hardhat')

async function main() {
  const royaltyRecipient = '0x482c973675b3E3f84A23Dc03430aCfF293952e74'
  const minterAddress = '0x482c973675b3E3f84A23Dc03430aCfF293952e74' // TODO: change this to the factory address
  const royaltyPercentage = 10;

  const RabbitHoleReceipt = await ethers.getContractFactory('RabbitHoleReceipt')
  const ReceiptRenderer = await ethers.getContractFactory('ReceiptRenderer')

  const receiptRenderer = await ReceiptRenderer.deploy()
  await receiptRenderer.deployed()
  console.log('receiptRenderer deployed to:', receiptRenderer.address)

  const deployment = await hre.upgrades.deployProxy(
    RabbitHoleReceipt,
    [receiptRenderer.address, royaltyRecipient, minterAddress, royaltyPercentage],
    { initializer: 'initialize' }
  )

  await deployment.deployed()
  console.log('deployed to:', deployment.address)

  const proxyImplAddress = await upgrades.erc1967.getImplementationAddress(
    deployment.address
  );

  console.log("verifying implementation: ", proxyImplAddress);
  await hre.run("verify:verify", { address: proxyImplAddress });
  console.log("verifying receiptRenderer: ", receiptRenderer.address);
  await hre.run("verify:verify", { address: receiptRenderer.address }
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
