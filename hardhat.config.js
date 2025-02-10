require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const secrets = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${secrets.ALCHEMY_API_KEY}`,
      accounts: [secrets.WALLET_SECRET],
    },
  },
};
