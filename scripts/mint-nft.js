require("dotenv").config();
const { JsonRpcProvider, Signer } = require("@ethersproject/providers");
const ethers = require("ethers");

// Create a JsonRpcProvider instance
const rpcUrl = "https://rpc.testnet.mantle.xyz";
const chainId = 5001;
const provider = new JsonRpcProvider(rpcUrl, chainId);

// Create a signer using the private key from the environment variable
const privateKey = process.env.SECRET_KEY;
const signer = new ethers.Wallet(privateKey, provider);

// Get contract ABI and address
const abi = require("../artifacts/contracts/MyNFT.sol/MyNFT.json").abi;
const contractAddress = "0xe43e44f3f538Ad10292C5FBE52542aB0D7740599";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Get the NFT Metadata IPFS URL
const tokenUri = "https://gateway.pinata.cloud/ipfs/bafkreiggjzyc5i6kmr2zpcsxez6a3ffpzkaylymtdwtbrcblzq7v6o5vhe";

// Call mintNFT function
async function mintNFT() {
  let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
  await nftTxn.wait();
  console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${nftTxn.hash}`);
}

mintNFT()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });