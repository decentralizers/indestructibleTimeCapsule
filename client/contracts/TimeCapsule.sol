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
        uint messageId = messageCount++;

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

        allMessages[messageId] = message;
        userMessages[msg.sender].push(messageId);
        messagesForUser[recipient].push(messageId);

        emit MessageCreated(messageId);
    }

    function revokeMessage(uint messageId) external payable{
        // TODO: Implement
        // retrieve the message
        // check if you're the sender of the message and the time hasn't passed
        require (allMessages[messageId].Sender == msg.sender, 'Only the sender can revoke his message');


        uint[] storage messages = messagesForUser[allMessages[messageId].Recipient];
        uint i = 0;
        for (i = 0; i < messages.length; i++) {
          if (messages[i] == messageId) {
            delete messages[i];
            break; //break so we don't use more gas to loop to the end
          }
        }

        messages = userMessages[msg.sender];
        for (i = 0; i < messages.length; i++) {
          if (messages[i] == messageId) {
            delete messages[i];
            break; //break so we don't use more gas to loop to the end
          }
        }

        delete allMessages[messageId]; //will introduce a gap here but that is ok

        emit MessageRevoked(messageId);
    }

    function getMessagesForUser() public view returns(uint[]) {
        return messagesForUser[msg.sender];
    }

    function getMessagesByUser() public view returns(uint[]) {
        return userMessages[msg.sender];
    }
}
