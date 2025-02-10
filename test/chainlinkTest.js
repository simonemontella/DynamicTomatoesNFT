const hre = require("hardhat");
const ethers = hre.ethers;

const { expect } = require("chai");

describe("Chainlink Functions Test", async function () {
  it("Deployment test", async function () {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const contract = await ethers.deployContract("ChainlinkTest");

    expect(contract.address).to.be.properAddress;
  });
});
