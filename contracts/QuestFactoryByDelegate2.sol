// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import './QuestFactory.sol';
import './test/SampleGovernor.sol';
import '@openzeppelin/contracts/governance/Governor.sol';

interface IGov {
    function propose(
        address[] calldata _targets,
        uint256[] calldata values,
        bytes[] calldata _callDatas,
        string calldata _desc
    ) external;

    function delegate(address _to) external;
}

contract QuestFactoryByDelegate2 {}
