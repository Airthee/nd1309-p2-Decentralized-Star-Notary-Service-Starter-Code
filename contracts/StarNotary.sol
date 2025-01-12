// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {
    // Star data
    struct Star {
        string name;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    constructor() ERC721("Airthee NFT", "ATH") {}

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _safeMint(msg.sender, _tokenId);
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can't sale the Star you don't owned"
        );
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address payable starOwner = payable(ownerOf(_tokenId));
        require(msg.value >= starCost);
        _safeTransfer(starOwner, msg.sender, _tokenId, "");

        // Msg sender pays the owner
        starOwner.transfer(starCost);

        // If user sent too many ether, return back the difference
        if (msg.value > starCost) {
            payable(msg.sender).transfer(msg.value - starCost);
        }

        // Star is no more in sale
        starsForSale[_tokenId] = 0;
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        return tokenIdToStarInfo[_tokenId].name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);

        //2. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        require(
            msg.sender == owner1 || msg.sender == owner2,
            "You must own one of the stars you wants to exchange"
        );

        //3. Use _transferFrom function to exchange the tokens.
        _transfer(owner1, owner2, _tokenId1);
        _transfer(owner2, owner1, _tokenId2);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        // It is already done in safeTransferFrom method

        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        safeTransferFrom(msg.sender, _to1, _tokenId);
    }
}
