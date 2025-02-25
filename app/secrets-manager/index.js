import express from "express";
import cors from "cors";
import { SecretsManager } from "@chainlink/functions-toolkit";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ROUTER_ADDRESS = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";
const DON_ID = "fun-ethereum-sepolia-1";
const GATEWAY_URLS = [
  "https://01.functions-gateway.testnet.chain.link/",
  "https://02.functions-gateway.testnet.chain.link/",
];

app.get("/get", async (_, res) => {
  try {
    const secrets = { OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY };

    const provider = new ethers.providers.JsonRpcProvider(
      `${process.env.SEPOLIA_RPC_URL}/${process.env.ALCHEMY_API_KEY}`
    );
    const signer = new ethers.Wallet(process.env.WALLET_SECRET, provider);

    const slotID = 0;
    const secretsManager = new SecretsManager({
      signer,
      functionsRouterAddress: ROUTER_ADDRESS,
      donId: DON_ID,
    });

    await secretsManager.initialize();
    const encryptedSecrets = await secretsManager.encryptSecrets(secrets);
    const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
      encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
      gatewayUrls: GATEWAY_URLS,
      slotId: slotID,
      minutesUntilExpiration: 10,
    });

    if (!uploadResult.success) {
      throw new Error("Failed to upload secrets");
    }

    console.log("Secrets uploaded successfully");
    console.log("Slot ID:", slotID);
    console.log("Version:", uploadResult.version);
    res.json({
      slotID: slotID,
      version: uploadResult.version,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
