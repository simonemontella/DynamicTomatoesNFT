const { SecretsManager } = require("@chainlink/functions-toolkit");
const { JsonRpcProvider } = require("ethers");
const { ethers } = require("hardhat");
require("dotenv").config();

async function hostSecrets() {
  const secrets = {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  };

  const [signer] = await ethers.getSigners();
  const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
  const donId = "fun-ethereum-sepolia-1";

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const nsigner = wallet.connect(
    new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/demo")
  );
  console.log(wallet.provider);

  const slotID = 0;

  const secretsManager = new SecretsManager({
    signer: nsigner,
    functionsRouterAddress: routerAddress,
    donId: donId,
  });
  await secretsManager.initialize();

  const encryptedSecrets = await secretsManager.encryptSecrets(secrets);
  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: 0,
    minutesUntilExpiration: 10,
  });

  if (!uploadResult.success) {
    console.log("Errore durante il caricamento dei secrets");
  } else {
    console.log(
      "Secrets caricati correttamente, version: ",
      uploadResult.version,
      "slotID:",
      slotID
    );
  }

  return { slotID: slotID, version: uploadResult.version };
}

hostSecrets().catch((error) => {
  console.error(error);
  process.exit(1);
});
