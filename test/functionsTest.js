const { expect } = require("chai");
const { ethers } = require("hardhat");
const hostSecrets = require("../scripts/hostSecrets");

//MEGLIO ESEGUIRE SU REMIX

describe("ChainlinkTest Contract", function () {
  let signer;
  let contract;

  before(async function () {
    [signer] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("ChainlinkTest");
    contract = await ContractFactory.deploy();
    await contract.waitForDeployment();

    return { contract, signer };
  });

  it("Deployment dello Smart Contract", async function () {
    const address = await contract.getAddress();

    expect(address).to.be.properAddress;
    console.log(`https://sepolia.etherscan.io/address/${address}`);
  });

  it("Upload Secrets & Update Dati", async function () {
    const secrets = await hostSecrets();

    expect(secrets.slotID).to.equal(0);
    expect(secrets.version).to.be.greaterThan(0);

    console.log(
      "Secrets caricati: slotID",
      secrets.slotID,
      "version",
      secrets.version
    );

    const startTemp = await contract.temperature();
    const startHum = await contract.humidity();

    await contract.updateData(secrets.slotID, secrets.version);

    const endTemp = await contract.temperature();
    const endHum = await contract.humidity();

    expect(endTemp).to.not.equal(startTemp);
    expect(endHum).to.not.equal(startHum);

    console.log("Temperatura iniziale:", startTemp);
    console.log("Umidità iniziale:", startHum);

    console.log("Temperatura finale:", endTemp);
    console.log("Umidità finale:", endHum);
  });
});
