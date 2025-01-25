# How to Create an NFT on Mantle 

This tutorial will walk you through writing and deploying a non-fungible (ERC-721) token smart contract using Hardhat and ethers.js!

With the popularity of NFTs bringing blockchain technology to the forefront of public attention, there is no better time than now to gain a firsthand understanding of the excitement. You can do this by creating and publishing your very own NFT (ERC-721 token) on the Mantle Testnet.

we will walk through creating and deploying an ERC-721 smart contract on Mantle Testnet using MetaMask, Solidity, Hardhat and Pinata.

# Creating an NFT

## Prerequisites

Before you begin the steps in this tutorial, please ensure that you have completed the following steps:

Install both Node.js (>14) and npm on your local machine. To check your Node version, run the following command in your terminal:

```
node -v
```

## Create a Node Project
Create a new directory for your project and navigate into it. Then, initialize a new Node project by

```
mkdir my-nft && cd my-nft
npm init -y
```

## Create a Hardhat Project
Hardhat is a development environment to compile, deploy, test, and debug smart contracts. It helps developers create dApps locally before deploying them to a live chain.

In your terminal, run the following commands:
```
npm install --save-dev hardhat
npx hardhat
```

You should then see a welcome message and options on what you can do. Use your “arrow keys” to navigate the small menu and Select Create a JavaScript project by clicking “Enter”.

Agree to all the prompts (project root, adding a .gitignore, and installing all sample project dependencies).

Now that we’re done with setting up Hardhat, let’s check if everything works properly.

```
npx hardhat test
```

## Install OpenZeppelin Contracts Package
We now have our hardhat development environment successfully configured. Let us now install the OpenZeppelin contracts package. This will give us access to ERC-721 implementations (one of the standards for NFTs alongside ERC-1155), on top of which we will build our contract.

```
npm install @openzeppelin/contracts
```

Note: You might encounter some alerts about vulnerabilities like in the screenshot below, please ignore them as they aren’t affecting our deployment of the contract.

```
PS C:\Users\alade\OneDrive\Desktop\MANTLE_NFT> npm install @openzeppelin/contracts

up to date, audited 577 packages in 16s

98 packages are looking for funding
  run `npm fund` for details

29 vulnerabilities (25 low, 4 high)

To address issues that do not require attention, run:
  npm audit fix

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
```

## Open the OpenZeppelin Contracts Package
Open the project with a project of your liking (e.g. VSCode). Note to open the project and navigate to the folder where the project was created in the first step.

For example, on Mac, we will use a language called Solidity to write our contract.

Navigate to the contracts folder and create a new file called MyNFT.sol. Add the following code to the file.

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

Make sure that the version defined above (0.8.20) is the same as the version defined in the hardhat.config.js file.

Now, Let’s break down the code line by line. In MyNFT.sol, our code inherits two OpenZepplin smart contract classes:

@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol contains the implementation of the ERC-721 standard, which our NFT smart contract will inherit. (To be a valid NFT, your smart contract must implement all the methods of the ERC-721 standard.)

@openzeppelin/contracts/access/Ownable.sol sets up access control on our smart contract, so only the owner of the smart contract (you) can mint NFTs.
Then we have our custom NFT smart contract, which is surprisingly short — it only contains a counter, a constructor, and a single function!

This is thanks to our inherited Open Zeppelin contracts, which implement most of the methods we need to create an NFT, such as ownerOf (returns the owner of the NFT) and transferFrom (transfers ownership of the NFT).

You’ll also notice we pass 2 strings, “MyNFT” and “NFT” into the ERC-721 constructor. The first variable is the smart contract’s name, and the second is its symbol. You can name each of these variables whatever you wish!

Finally, starting on we have our function mintNFT() that allows us to mint an NFT! You’ll notice this function takes in two variables:

address recipient specifies the address that will receive your freshly minted NFT

string memory tokenURI is a string that should resolve to a JSON document that describes the NFT’s metadata.

An NFT’s metadata is really what brings it to life, allowing it to have additional properties, such as a name, description, image, and other attributes. In Part II of this tutorial, we will describe how to configure this metadata.

Lastly, mintNFT calls some methods from the inherited ERC-721 library, and ultimately returns a number that represents the ID of the freshly minted NFT.

## Connect MetaMask & Mantle to Your Project

Now that we’ve created a MetaMask wallet and a smart contract, it’s time to connect both with Mantle Testnet.

Every transaction sent from your virtual wallet requires a signature using your unique private key. To provide our program with this permission, we can safely store our private key in an environmental file.

Install the dotenv package in your project directory by running.

```
npm install dotenv --save
```

Then, create a .env file in the root directory (Main Folder) of your project, and add your MetaMask private key.

Note: The file name should be “.env” only, not “xyz.env” or “abc.env”

Your .env should look like this:
```
PRIVATE_KEY = 0x"your exported private key"
```

Note: make sure to replace your exported private key with “your exported private key”.

## Update hardhat.config.js

We’ve added several dependencies and plugins so far. Now we need to update hardhat.config.js, so that your project knows about all of them.

Replace the contents of hardhat.config.js with the following:

```
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { MANTLE_SEPOLIA_URL, PRIVATE_KEY, MANTLERSCAN_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
(
  module.exports = {
    solidity: "0.8.27",
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

##  Write the Deployment Script

Now that your contract is written, and our configuration file is good to go, it’s time to write the contract deploy script.

Navigate to the ignition/modules/mynft.js folder and replace the contents in the file mynft.js with the following:
```
// ignition/modules/mynft.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTModule", (m) => {
  const myNFT = m.contract("MyNFT");

  return { myNFT };
});
```

##  Deploy the Contract

We’re finally ready to deploy our smart contract! Navigate back to the root of your project directory, and in the command line run:
```
npx hardhat ignition deploy ./ignition/modules/mynft.js --network sepolia --verify
```

You should have an output similar to the one shown below ⬇️
```
Deployed Addresses

MyNFTModule#MyNFT - 0xe43e44f3f538Ad10292C5FBE52542aB0D7740599
```

Now that our contract is deployed, we can go to Mantle Explorer and check if our contract was deployed.

Congrats! You just deployed your NFT smart contract to the Mantle Testnet 🎉 🥳

##  Minting the Deployed NFT
we accomplished the deployment of a smart contract to Mantle Testnet. Now, it’s time to showcase our web3 expertise by creating an NFT.

## Creating the Mint NFT Script

Navigate to the root of your project directory and create a new file called mintNFT.js in scripts folder. 

Replace the contents of mintNFT.js with the following:
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

We’re all set. Let’s mint our NFT by running the following command:

```
node scripts/mint-nft.js
```

You should get an output that looks something like this: “NFT Minted! Check it out at:

Minting NFT...
Transaction submitted. Waiting for confirmation...
NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/0xf0ee9a094c4af94c8aa2d023fbb73419bcd4728e332db803d74bd6df1f3fbe44

You can check out your NFT mint on Etherscan by following the URL above.

Congrats! 🎉 ✨ You’ve minted your first NFT!