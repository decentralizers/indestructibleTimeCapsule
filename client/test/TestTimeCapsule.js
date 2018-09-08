const TimeCapsule = artifacts.require("./contracts/TimeCapsule.sol");


contract('TimeCapsule tests', async (accounts) => {

    it("Create Message test", async () => {
        let instance = await TimeCapsule.deployed();

        let response = await instance.createMessage(accounts[1],
            "policyId", "signingKey", "verifyingKey", "timeStamp", "fileLink");

        assert.equal(response.logs[0].event, "MessageCreated", "MessageCreated event should be raised.");
    })

    it("receiver.getMessagesForUser test should return 1", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesForUser({ from: accounts[1] });

        assert.equal(messages.length, 1, "Receiver should have one message");
    })

    it("sender.getMessagesForUser test should return 0", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesForUser();

        assert.equal(messages.length, 0, "Sender should have no messages");
    })

    it("sender.getMessagesByUser should return 1", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesByUser();

        assert.equal(messages.length, 1, "Sender should have sent one message");
    })

    it("receiver.getMessagesByUser should return 0", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesByUser({ from: accounts[1] });

        assert.equal(messages.length, 0, "Receiver hasn't sent any messages");
    })

    it("Create second and third message test", async () => {
        let instance = await TimeCapsule.deployed();

        let response = await instance.createMessage(accounts[1],
            "policyId1", "signingKey1", "verifyingKey1", "timeStamp1", "fileLink1");


        let response2 = await instance.createMessage(accounts[1],
            "policyId2", "signingKey2", "verifyingKey2", "timeStamp2", "fileLink2");

        assert.equal(response.logs[0].event, "MessageCreated", "MessageCreated event should be raised.");
        assert.equal(response2.logs[0].event, "MessageCreated", "MessageCreated event should be raised.");
    })

    it("Revoke last message", async () => {
        let instance = await TimeCapsule.deployed();

        let response = await instance.revokeMessage(2);

        assert.equal(response.logs[0].event, "MessageRevoked", "MessageCreated event should be raised.");
    })

    it("sender.getMessagesByUser should return 3", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesByUser();

        assert.equal(messages.length, 3, "Sender should have sent two messages");
    })

    it("sender.getMessagesByUser should have undefined for revoked message", async () => {
        let instance = await TimeCapsule.deployed();

        let messages = await instance.getMessagesByUser();

        assert.equal(messages[3], undefined, "Sender should have sent two messages");
    })
})
