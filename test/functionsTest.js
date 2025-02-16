const { ethers } = require("hardhat");
const hostSecrets = require("../scripts/hostSecrets");
const { expect } = require("chai");

describe("Chainlink Functions Test", async function () {
  /*it("Deployment", async function () {
    [deployer] = await ethers.getSigners();

    const contractFactory = await ethers.getContractFactory("ChainlinkTest");
    contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    expect(address).to.not.be.undefined;

    console.log("Deployed contract");
    console.log("CONTRACT ADDRESS:", address, "\nSIGNER:", deployer.address);
    console.log(`https://sepolia.etherscan.io/address/${address}`);
  });*/

  //https://sepolia.etherscan.io/address/0x0C96fc5FF147EE107F1e7960f2F2c3fD7d9D89bE
  //https://sepolia.etherscan.io/address/0xa3f29cfa8B773d3F59c76Da7b2b47b281d47C574
  it("Secrets upload", async function () {
    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt(
      "ChainlinkTest",
      "0x0C96fc5FF147EE107F1e7960f2F2c3fD7d9D89bE",
      signer
    );
    const startTemp = await contract.temperature();
    const startHum = await contract.humidity();
    console.log("Temperature:", startTemp, "Humidity:", startHum);
    const secrets = await hostSecrets();
    /*await contract.requestData(secrets.slotID, secrets.version, 800000);
    console.log(
      "New Temperature:",
      await contract.temperature(),
      "New Humidity:",
      await contract.humidity()
    );*/
  });
});
