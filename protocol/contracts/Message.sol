// SPDX-License-Identifier: MIT
pragma solidity =0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Message {
    Counters.Counter private _counter;
    using Counters for Counters.Counter;
    address private _owner;
    mapping(uint256 => string) private _message;

    constructor(address owner) {
        _owner = owner;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can call");
        _;
    }

    function addMessage(string memory message) external onlyOwner {
        _counter.increment();
        _message[_counter.current()] = message;
        emit AddMessage(msg.sender, message);
    }

    function selectMessage(uint256 id) external view returns (string memory) {
        return _message[id];
    }

    function getMessageLength() external view returns (uint256) {
        return _counter.current();
    }

    event AddMessage(address sender, string message);
}
