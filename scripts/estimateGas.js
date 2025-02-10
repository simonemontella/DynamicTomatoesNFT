const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Signer address:", signer.address);

  const ContractFactory = await hre.ethers.getContractFactory("ChainlinkTest");

  const deployTransaction = ContractFactory.getDeployTransaction();
  if (!deployTransaction.data) {
    throw new Error("Dati della transazione non generati correttamente");
  }

  const estimatedGas = await signer.estimateGas(deployTransaction);
  const gasPrice = await signer.getGasPrice();
  const deploymentCost = estimatedGas.mul(gasPrice);

  console.log("Gas stimato per la distribuzione:", estimatedGas.toString());
  console.log(
    "Prezzo del gas:",
    hre.ethers.utils.formatUnits(gasPrice, "gwei"),
    "Gwei"
  );
  console.log(
    "Costo stimato della distribuzione:",
    hre.ethers.utils.formatEther(deploymentCost),
    "ETH"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
