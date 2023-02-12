const { ethers } = require('hardhat')
// import { getExpectedContractAddress } from '../tasks/utils'

// import { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } from '../constants'
require('dotenv').config({ path: '.env' })

async function main() {
  const governanceTokenFactory = await ethers.getContractFactory('SampleERC20Wrapper')
  const getExpectedContractAddress = async (deployer) => {
    const adminAddressTransactionCount = await deployer.getTransactionCount()
    const expectedContractAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: adminAddressTransactionCount + 2,
    })

    return expectedContractAddress
  }
  const signerAddress = await governanceTokenFactory.signer.getAddress()

  const signer = await ethers.getSigner(signerAddress)
  const governorExpectedAddress = await getExpectedContractAddress(signer)

  const token = await governanceTokenFactory.deploy('0xB052E660559aF82f4A64F1e4DE30CC695959e7a7')
  await token.deployed()

  const timelockFactory = await ethers.getContractFactory('SampleTimeLock')
  const timelockDelay = 2
  const timelock = await timelockFactory.deploy(
    timelockDelay,
    ['0xeF356Fec500CcE6a8a8458605A82e82a41bd29BC'],
    ['0xeF356Fec500CcE6a8a8458605A82e82a41bd29BC'],
    '0xeF356Fec500CcE6a8a8458605A82e82a41bd29BC'
  )
  await timelock.deployed()

  const daoContractFactory = await ethers.getContractFactory('GovernorContract')

  const governor = await daoContractFactory.deploy(token.address, timelock.address, 50, 50, 1)
  await governor.deployed()

  console.log('Dao deployed to: ', {
    governorExpectedAddress,
    governor: governor.address,
    timelock: timelock.address,
    token: token.address,
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
