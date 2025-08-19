// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract Register {
    mapping(address => bool) public user;
    address[] members;

    constructor() {
        user[msg.sender] = true;
        members.push(msg.sender);
    }

    modifier OnlyRegisteredUser() {
        require(user[msg.sender], "Member is not registered.");
        _;
    }

    function addMember(address _member) public OnlyRegisteredUser {
        require(!user[_member], "User is already a member");
        user[_member] = true;
        members.push(_member);
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }
}
