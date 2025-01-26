# How to Create an NFT on Mantle 

This tutorial walks you through writing and deploying a non-fungible token (ERC-721) smart contract using Hardhat and ethers.js.

With the growing popularity of NFTs bringing blockchain technology to the forefront, there’s no better time to gain hands-on experience. In this guide, you’ll learn how to create and publish your very own NFT (ERC-721 token) on the Mantle Testnet.

We’ll cover the following:

- Creating and deploying an ERC-721 smart contract.
- Using tools like MetaMask, Solidity, Hardhat, and Pinata.

# Creating an NFT

## Prerequisites

Before starting, ensure you have:

- Node.js (version >14) and npm installed on your machine. To verify your Node version, run:
```
node -v
```

## Step 1: Create a Node Project
Create a directory for your project and navigate into it

```
mkdir my-nft && cd my-nft
npm init -y
```
Initialize a new Node.js project:
```
npm init -y
```



## Step 2: Set Up a Hardhat Project
Hardhat is a development environment for compiling, deploying, testing, and debugging smart contracts.
- Install Hardhat:
```
npm install --save-dev hardhat
```
- Initialize Hardhat:
```
npx hardhat
```
- Select "Create a JavaScript project" and agree to all prompts (e.g., adding a .gitignore file and installing dependencies).
- Test your setup:
```
npx hardhat test
```


## Step 3: Install OpenZeppelin Contracts
OpenZeppelin provides implementations of common smart contract standards like ERC-721.

- Install the package:

```
npm install @openzeppelin/contracts
```
- Note: Ignore any security vulnerability warnings if they don't affect contract deployment.


## Step 4: Write the Smart Contract
- Navigate to the contracts folder and create a new file named MyNFT.sol.
- Add the following code:

```
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
```

Ensure the Solidity version (^0.8.20) matches the version in hardhat.config.js.

## Step 5: Update the Hardhat Configuration
- Install `dotenv` for managing environment variables:
```
npm install dotenv --save
```
- Create a .env file in the root directory and add your MetaMask private key:
```
  PRIVATE_KEY=your_exported_private_key
```
- Update `hardhat.config.js` with the following:


```
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { MANTLE_SEPOLIA_URL, PRIVATE_KEY, MANTLERSCAN_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
(
  module.exports = {
    solidity: "0.8.20",
    networks: {
      sepolia: {
        url: MANTLE_SEPOLIA_URL || "",
        accounts: PRIVATE_KEY != undefined ? [PRIVATE_KEY] : [],
      },
    },
    etherscan: {
      apiKey: MANTLESCAN_KEY || "",
    },
  }
);
```

##  Step 6: Write the Deployment Script

- Navigate to ignition/modules and replace the contents of mynft.js with the following:
```
// ignition/modules/mynft.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTModule", (m) => {
  const myNFT = m.contract("MyNFT");

  return { myNFT };
});
```
- Deploy the contract:

```
npx hardhat ignition deploy ./ignition/modules/mynft.js --network sepolia --verify
```

After deployment, you’ll see an output with the contract address. You can verify it on the Mantle Explorer.

Congrats! You just deployed your NFT smart contract to the Mantle Testnet 🎉 🥳

##  Minting the NFT
- Create a new file in the scripts folder called mintNFT.js with the following code:

```
require("dotenv").config();
const { ethers } = require("ethers");

// Load environment variables
const rpcUrl = process.env.MANTLE_SEPOLIA_URL; // Match the hardhat.config.js
const chainId = 5003; // Sepolia Testnet chain ID
const privateKey = process.env.PRIVATE_KEY;

// Ensure the environment variables are defined
if (!rpcUrl || !privateKey) {
  console.error("Please define MANTLE_SEPOLIA_URL and PRIVATE_KEY in your .env file");
  process.exit(1);
}

// Create a JsonRpcProvider instance
const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);

// Create a signer using the private key
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = require("../ignition/deployments/chain-5003/artifacts/MyNFTModule#MyNFT.json").abi;
const contractAddress = "0x954Da409811bf70f7d5cDEC7392acd6B9aC7cF32";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Define the NFT Metadata IPFS URL
const tokenUri = "https://gateway.pinata.cloud/ipfs/bafkreiddardzbq6vpcki2nesssxbmev55yutjb2ko5f6rkyaudyc7cue4a";

// Function to mint the NFT
async function mintNFT() {
  try {
    console.log("Minting NFT...");
    const nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
    console.log("Transaction submitted. Waiting for confirmation...");
    await nftTxn.wait(); // Wait for the transaction to be mined
    console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
  } catch (error) {
    console.error("Error minting NFT:", error.message);
  }
}

mintNFT();
```

## Explanation:
```
const tokenUri = "https://gateway.pinata.cloud/ipfs/bafkreiddardzbq6vpcki2nesssxbmev55yutjb2ko5f6rkyaudyc7cue4a";
```
is using a tokenUri that points to an asset hosted on Pinata, a platform for managing files on IPFS (InterPlanetary File System).

To use a similar URI for your NFT, you'll need to:

- Create an account on Pinata.
- Upload your NFT metadata (usually in JSON format) or media files (like images or videos).
- Once uploaded, Pinata will provide you with an IPFS hash or gateway link, which you can use as your tokenUri in the code.

- Run the script to mint your NFT:

```
node scripts/mintNFT.js
```
Minting NFT...
Transaction submitted. Waiting for confirmation...
NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/0xf0ee9a094c4af94c8aa2d023fbb73419bcd4728e332db803d74bd6df1f3fbe44

You can check out your NFT mint on Etherscan by following the URL above.

Congrats! 🎉 ✨ You’ve minted your first NFT!
