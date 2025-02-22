const { ethers } = require("hardhat");

async function estimateGas(contractName, gasPrice) {
  const ContractFactory = await ethers.getContractFactory(contractName);

  const deployTransaction = await ContractFactory.getDeployTransaction();
  if (!deployTransaction.data) {
    throw new Error("Dati della transazione non generati correttamente");
  }

  const estimatedGas = await ethers.provider.estimateGas(deployTransaction);
  const deploymentCost = estimatedGas * gasPrice;

  console.log("Quantità di gas necessaria:", estimatedGas.toString());
  console.log(
    "Costo stimato della distribuzione:",
    ethers.formatEther(deploymentCost),
    "ETH"
  );
}

async function estimateContracts() {
  const network = await ethers.provider.getNetwork();
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
  const contracts = ["ChainlinkTest", "DynamicTomatoes"];

  console.log(
    "Prezzo attuale del gas su",
    network.name,
    ":",
    gasPrice.toString(),
    "wei"
  );
  for (const contract of contracts) {
    console.log(`Stima dei costi per il contratto ${contract}`);
    await estimateGas(contract, gasPrice);
  }
}

estimateContracts();
