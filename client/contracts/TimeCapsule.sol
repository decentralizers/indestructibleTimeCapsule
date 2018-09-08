pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TimeCapsule is Ownable {

    constructor() public {        
    }

    struct Message {
        uint MessageId;
        address Sender;
        address Recipient; 
        string PolicyId;
        string SigningKey;
        string VerifyingKey;        
        string Timestamp;
        string FileLink;
    }

    uint messageCount;
    Message[] allMessages;

    event MessageCreated(uint messageId);
    event MessageRevoked(uint messageId);
   
    mapping (address => uint[]) public userMessages; // Messages that the current user has added
    mapping (address => uint[]) public messagesForUser;

    function createMessage(address recipient, string policyId, string signingKey, string verifyingKey, string timeStamp, string fileLink)
     external {
        var messageId = messageCount++;

        Message memory message = Message({
            MessageId : messageId,
            Sender : msg.sender,
            Recipient : recipient,
            PolicyId : policyId,
            SigningKey : signingKey,
            VerifyingKey : verifyingKey,
            Timestamp : timeStamp,
            FileLink : fileLink
        });

        allMessages.push(message);        
        userMessages[msg.sender].push(messageId);
        messagesForUser[recipient].push(messageId);

        emit MessageCreated(messageId);
    }

    function revokeMessage(uint messageId) external payable{
        // TODO: Implement
        // retrieve the message
        // check if you're the sender of the message and the time hasn't passed
        
        emit MessageRevoked(messageId);
    }

    function getMessagesForUser() public view returns(uint[]) {
        return messagesForUser[msg.sender];
    }

    function getMessagesByUser() public view returns(uint[]) {
        return userMessages[msg.sender];
    }
}
