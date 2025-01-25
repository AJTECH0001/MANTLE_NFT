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
      apiKey: MANTLERSCAN_KEY || "",
    },
  }
);
