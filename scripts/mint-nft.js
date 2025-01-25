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
