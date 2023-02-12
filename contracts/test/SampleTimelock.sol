// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.16;
import '@openzeppelin/contracts/governance/TimelockController.sol';

contract SampleTimeLock is TimelockController {
    // minDelay is how long you have to wait before executing
    // proposers is the list of addresses that can propose
    // executors is the list of addresses that can execute
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}