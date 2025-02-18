const { PinataSDK } = require("pinata-web3");
const fs = require("fs");
const path = require("path");
const { Blob } = require("buffer");

require("dotenv").config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY_URL,
});

async function upload() {
  const group = await pinata.groups.create({
    name: "DynamicTomatoesNFT",
  });

  const imgsPath = path.join(__dirname, "../images");
  let uploads = {};

  for (const imgFileName of fs.readdirSync(imgsPath)) {
    if (!imgFileName.startsWith("stage")) continue;

    const blob = new Blob([fs.readFileSync(path.join(imgsPath, imgFileName))]);
    const file = new File([blob], imgFileName);

    const uploadResult = await pinata.upload.file(file).group(group.id);
    console.log(uploadResult);

    uploads[imgFileName] = "ipfs://" + uploadResult.IpfsHash;
  }

  const destPath = path.join(__dirname, "../ipfs-uploads.json");
  try {
    fs.writeFileSync(destPath, JSON.stringify(uploads), { flag: "a" });
  } catch (err) {
    console.error(err);
  }
}

upload();
