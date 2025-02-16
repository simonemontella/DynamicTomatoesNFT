const {
  SecretsManager,
  simulateScript,
} = require("@chainlink/functions-toolkit");
const { ethers } = require("ethers5");
require("dotenv").config();

const fs = require("fs");
const path = require("path");

async function hostSecrets() {
  const secrets = {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  };

  const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
  const donId = "fun-ethereum-sepolia-1";
  const gatewayUrls = [
    "https://01.functions-gateway.testnet.chain.link/",
    "https://02.functions-gateway.testnet.chain.link/",
  ];

  const sepoliaURL = `${process.env.SEPOLIA_RPC_URL}/${process.env.ALCHEMY_API_KEY}`;
  const provider = new ethers.providers.JsonRpcProvider(sepoliaURL);
  const wallet = new ethers.Wallet(process.env.WALLET_SECRET, provider);
  const signerV5 = wallet.connect(provider);

  const slotID = 0;

  const secretsManager = new SecretsManager({
    signer: signerV5,
    functionsRouterAddress: routerAddress,
    donId: donId,
  });
  await secretsManager.initialize();

  const encryptedSecrets = await secretsManager.encryptSecrets(secrets);
  const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
    encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
    gatewayUrls: gatewayUrls,
    slotId: slotID,
    minutesUntilExpiration: 10,
  });

  if (!uploadResult.success) {
    console.log("Errore durante il caricamento dei secrets");
  } else {
    console.log(
      "Secrets caricati correttamente, version:",
      uploadResult.version,
      "slotID:",
      slotID
    );
  }

  const source = fs
    .readFileSync(path.resolve(__dirname, "weatherRequest.js"))
    .toString();

  const response = await simulateScript({
    source: source,
    args: [],
    bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
    secrets: secrets,
  });

  console.log(response);

  return { slotID: slotID, version: uploadResult.version };
}

module.exports = hostSecrets;
