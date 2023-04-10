// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Twitter {
    using SafeMath for uint256;

    uint256 public tid = 0;
    address payable public Owner;

    constructor() public {
        Owner = payable(msg.sender);
    }

    struct User {
        uint256 id;
        uint256 correctDownvotes;
        uint256 wrongDownvotes;
        string name;
        address ethad;
        string username;
        string email;
        string password;
    }

    struct Tweet {
        address ethadd;
        string username;
        string tweet;
        string ipfsHash;
        uint256 upVotes;
        uint256 downVotes;
        uint256 id;
        address[] downVotedUsers;
    }

    Tweet[] public tweets;

    User[] public users;

    modifier onlyOwner() {
        require(msg.sender == Owner, "Not owner");
        _;
    }

    function addUser(
        uint256 _id,
        string memory _name,
        address _ethad,
        string memory _username,
        string memory _email,
        string memory _password
    ) public {
        users.push(
            User(_id, 0, 0, _name, _ethad, _username, _email, _password)
        );
    }

    function login(address _ethad, string memory _password)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < users.length; i++) {
            if (
                users[i].ethad == _ethad &&
                keccak256(abi.encodePacked(_password)) ==
                keccak256(abi.encodePacked(users[i].password))
            ) {
                return true;
            }
        }
        return false;
    }

    function addTweet(
        address _ethad,
        string memory _username,
        string memory _tweet,
        string memory _ipfsHash
    ) public {
        address[] memory addr;
        tweets.push(
            Tweet(_ethad, _username, _tweet, _ipfsHash, 0, 0, tid, addr)
        );
        tid = tid + 1;
    }

    function viewTweets() public view returns (Tweet[] memory) {
        return tweets;
    }

    function downVote(
        address _from,
        address payable _to,
        uint256 _tid
    ) public {
        // require(transfer(_to) == true, "Rejected");
        tweets[_tid].downVotes++;
        tweets[_tid].downVotedUsers.push(_from);
    }

    function downVotesUsers(uint256 _tid)
        public
        view
        returns (address[] memory)
    {
        return tweets[_tid].downVotedUsers;
    }

    function particularTweet(uint256 _id) public view returns (Tweet memory) {
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].id == _id) {
                return tweets[i];
            }
        }
    }

    function getDownvotes(uint256 _id) public view returns (uint256) {
        for (uint256 i = 0; i < tweets.length; i++) {
            if (tweets[i].id == _id) {
                return tweets[i].downVotes;
            }
        }
    }

    function viewAllAccounts() public view returns (uint256) {
        return users.length;
    }

    function checkFake(uint256 _id) public view returns (bool) {
        uint256 totalUsers = users.length;
        if (tweets[_id].downVotes >= (totalUsers / 3)) {
            return true;
        }
        return false;
    }
}
