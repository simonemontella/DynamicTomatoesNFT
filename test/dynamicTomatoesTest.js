const { expect } = require("chai");
const { ethers } = require("hardhat");
const hostSecrets = require("../scripts/hostSecrets");
const addConsumer = require("../scripts/addConsumer");

describe("DynamicTomatoes Test", function () {
  let signer;
  let contract;
  let contractAddress;

  before(async function () {
    [signer] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("DynamicTomatoes");
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();

    return { contract, signer };
  });

  it("Deployment dello Smart Contract", async function () {
    contractAddress = await contract.getAddress();

    expect(contractAddress).to.be.properAddress;
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);
  });

  it("Registra come consumer", async function () {
    const tx = await addConsumer(contractAddress);

    console.log(`https://sepolia.etherscan.io/address/${tx}`);
  });

  let secrets;

  it("Upload Secrets", async function () {
    secrets = await hostSecrets();

    expect(secrets.slotID).to.equal(0);
    expect(secrets.version).to.be.greaterThan(0);

    console.log(
      "Secrets caricati: slotID",
      secrets.slotID,
      "version",
      secrets.version
    );
  });
});
