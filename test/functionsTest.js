const { ethers } = require("hardhat");

describe("Chainlink Functions Test", async function () {
  let contract;
  let deployer;

  it("Deployment", async function () {
    [deployer] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("ChainlinkTest");
    contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.not.be.undefined;

    console.log("Deployed contract");
    console.log("CONTRACT ADDRESS:", address, "\nSIGNER:", deployer.address);
    console.log("https://sepolia.etherscan.io/address/", address);
  });

  it("Secrets upload", async function () {
    console.log("Contract address: ", await contract.getAddress());
    console.log(await contract.requestData());
  });
});
