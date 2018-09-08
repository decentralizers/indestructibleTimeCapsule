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
})