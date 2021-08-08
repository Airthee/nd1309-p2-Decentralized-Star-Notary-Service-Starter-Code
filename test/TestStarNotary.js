const StarNotary = artifacts.require("StarNotary");

contract('StarNotary', (accounts) => {
    let lastTokenId = -1;

    it('can Create a Star', async() => {
        let starId = ++lastTokenId;
        const instance = await StarNotary.deployed();
        await instance.createStar('Awesome Star!', starId, {from: accounts[0]})
        assert.equal(await instance.tokenIdToStarInfo.call(starId), 'Awesome Star!')
    });
    
    it('lets user1 put up their star for sale', async() => {
        const instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let starId = ++lastTokenId;
        let starPrice = web3.utils.toWei(".01", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        assert.equal(await instance.starsForSale.call(starId), starPrice);
    });
    
    it('lets user1 get the funds after the sale', async() => {
        const instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = ++lastTokenId;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
        await instance.buyStar(starId, {from: user2, value: balance});
        let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
        let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
        let value2 = Number(balanceOfUser1AfterTransaction);
        assert.equal(value1, value2);
    });
    
    it('lets user2 buy a star, if it is put up for sale', async() => {
        const instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = ++lastTokenId;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance});
        assert.equal(await instance.ownerOf.call(starId), user2);
    });
    
    it('lets user2 buy a star and decreases its balance in ether', async() => {
        const instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = ++lastTokenId;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
        const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
        let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
        assert.equal(value, starPrice);
    });
    
    // Implement Task 2 Add supporting unit tests
    
    it('can add the star name and star symbol properly', async() => {
        // 1. create a Star with different tokenId
        //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    });
    
    it('lets 2 users exchange stars', async() => {
        const instance = await StarNotary.deployed();
        
        // 1. create 2 Stars with different tokenId
        const starsToCreate = [
            {
                tokenId: ++lastTokenId,
                name: 'Star 1',
                owner: accounts[1],
            },
            {
                tokenId: ++lastTokenId,
                name: 'Star 2',
                owner: accounts[2],
            }
        ];
        for (const starToCreate of starsToCreate) {
            await instance.createStar(starToCreate.name, starToCreate.tokenId, { from: starToCreate.owner });
        }
        assert.equal(await instance.ownerOf.call(starsToCreate[0].tokenId), starsToCreate[0].owner);
        assert.equal(await instance.ownerOf.call(starsToCreate[1].tokenId), starsToCreate[1].owner);
        
        // 2. Call the exchangeStars functions implemented in the Smart Contract
        await instance.exchangeStars(starsToCreate[0].tokenId, starsToCreate[1].tokenId, { from: starsToCreate[0].owner });
        
        // 3. Verify that the owners changed
        assert.equal(await instance.ownerOf.call(starsToCreate[0].tokenId), starsToCreate[1].owner);
        assert.equal(await instance.ownerOf.call(starsToCreate[1].tokenId), starsToCreate[0].owner);
    });
    
    it('lets a user transfer a star', async() => {
        const instance = await StarNotary.deployed();
        
        // 1. create a Star with different tokenId
        const starId = ++lastTokenId;
        const owner = accounts[4];
        await instance.createStar('My superstar', starId, { from: owner });
        
        // 2. use the transferStar function implemented in the Smart Contract
        const newOwner = accounts[5];
        await instance.transferStar(newOwner, starId, { from: owner });
        
        // 3. Verify the star owner changed.
        assert.equal(await instance.ownerOf.call(starId), newOwner);
    });
    
    it('lookUptokenIdToStarInfo test', async() => {
        // 1. create a Star with different tokenId
        const starId = 9;
        const owner = accounts[5];
        const instance = await StarNotary.deployed();
        await instance.createStar('My star', starId, { from: owner });
    
        // 2. Call your method lookUptokenIdToStarInfo
        const response = await instance.lookUptokenIdToStarInfo.call(starId);
        
        // 3. Verify if you Star name is the same
        assert.equal(response, 'My star');
    });
});
