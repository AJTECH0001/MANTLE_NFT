// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds; // Custom counter to track token IDs

    // Constructor: Initialize the ERC721 token with a name and symbol
    constructor() ERC721("MyNFT", "NFT") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds++; // Increment the token ID counter
        uint256 newItemId = _tokenIds; // Use the current value as the new token ID
        _mint(recipient, newItemId); // Mint the NFT with the new ID
        _setTokenURI(newItemId, tokenURI); // Set the token URI

        return newItemId; // Return the new token ID
    }
}