import { expect } from 'chai'
import { Contract } from 'ethers'
import { ethers, upgrades } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  GovernorContract__factory,
  SampleERC20__factory,
  SampleERC20Wrapper__factory,
  SampleTimeLock__factory,
} from '../typechain-types'

describe('Sample DAO', async () => {
  let SampleDAO: Contract
  let sampleGovernerContract: GovernorContract__factory
  let sampleERC20Contract: SampleERC20__factory
  let sampleERC20Wrapper: SampleERC20Wrapper__factory

  let deployedSampleGovernorContract: Contract
  let deployedWrappedErc20Contract: Contract
  let owner: SignerWithAddress
  let royaltyRecipient: SignerWithAddress

  const quorumPercentage = 50 /* Quorum required for a proposal to pass percentage*/
  const votingPeriod = 50 /* 10 minutes */
  const votingDelay = 1 /* Delay since proposal is created until voting starts. */

  beforeEach(async () => {
    ;[owner, royaltyRecipient] = await ethers.getSigners()
    sampleGovernerContract = await ethers.getContractFactory('GovernorContract')
    sampleERC20Contract = await ethers.getContractFactory('SampleERC20')
    sampleERC20Wrapper = await ethers.getContractFactory('SampleERC20Wrapper')
    await deploySampleGovernerContract()
  })

  const deploySampleGovernerContract = async () => {
    const deploySampleErc20Contract = await sampleERC20Contract.deploy('RewardToken', 'RTC', 1000, owner.address)
    const deployedSampleErc20Contract = await deploySampleErc20Contract.deployed()

    const wrappedErc20 = await sampleERC20Wrapper.deploy(deployedSampleErc20Contract.address)
    deployedWrappedErc20Contract = await wrappedErc20.deployed()

    const sampleTimelockContract = await ethers.getContractFactory('SampleTimeLock')
    const deployedSampleTimelock = await sampleTimelockContract.deploy(
      10,
      [owner.address],
      [owner.address],
      owner.address
    )
    console.log(wrappedErc20.address, deployedSampleTimelock.address, quorumPercentage, votingPeriod, votingDelay)
    await deployedSampleTimelock.deployed()
    deployedSampleGovernorContract = await sampleGovernerContract.deploy(
      deployedWrappedErc20Contract.address,
      deployedSampleTimelock.address,
      quorumPercentage,
      votingPeriod,
      votingDelay
    )

    await deployedSampleGovernorContract.deployed()
  }

  describe('Deployment', () => {
    it('deploys DAO', async () => {
      expect(deployedSampleGovernorContract.address).to.not.be.undefined
      const governorName = await deployedSampleGovernorContract.name()
      expect(governorName).to.equal('GovernorContract')
    })
  })
})
