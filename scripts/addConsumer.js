const { SubscriptionManager } = require("@chainlink/functions-toolkit");

//https://github.com/smartcontractkit/functions-hardhat-starter-kit/blob/0a20ec12ac7f8718a2f1f981bb8a000d9ef05b1e/tasks/Functions-billing/add.js

async function addConsumer(address) {
  const subscriptionId = 4291;

  const signer = await ethers.getSigner();
  const linkTokenAddress = 0x779877a7b0d9e8603169ddbd7836e478b4624789;
  const functionsRouterAddress = 0xb83e47c2bc239b3bf370bc41e1459a34b41238d0;
  const txOptions = { confirmations: 2 };

  const sm = new SubscriptionManager({
    signer,
    linkTokenAddress,
    functionsRouterAddress,
  });
  await sm.initialize();

  const tx = await sm.addConsumer({
    subscriptionId,
    consumerAddress,
    txOptions,
  });

  return tx.transactionHash;
}

module.exports = addConsumer;
