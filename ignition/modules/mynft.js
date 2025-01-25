// ignition/modules/mynft.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTModule", (m) => {
  const myNFT = m.contract("MyNFT");

  return { myNFT };
});