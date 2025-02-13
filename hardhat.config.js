require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const secrets = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    //hardhat: {},
    sepolia: {
      url: `${secrets.SEPOLIA_RPC_URL}/${secrets.ALCHEMY_API_KEY}`,
      accounts: [secrets.WALLET_SECRET],
      gasLimit: 3000000,
    },
  },
};
