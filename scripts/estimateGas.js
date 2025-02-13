const { ethers } = require("hardhat");

async function estimateGas() {
  const contractName = "ChainlinkTest";
  const ContractFactory = await ethers.getContractFactory(contractName);

  const deployTransaction = await ContractFactory.getDeployTransaction();
  if (!deployTransaction.data) {
    throw new Error("Dati della transazione non generati correttamente");
  }

  const estimatedGas = await ethers.provider.estimateGas(deployTransaction);
  const gasPrice = (await ethers.provider.getFeeData()).gasPrice;
  const deploymentCost = estimatedGas * gasPrice;

  console.log("Quantità gas :", estimatedGas.toString());
  console.log("Prezzo del gas:", gasPrice.toString(), "wei");
  console.log(
    "Costo stimato della distribuzione:",
    ethers.formatEther(deploymentCost),
    "ETH"
  );
}

estimateGas().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
