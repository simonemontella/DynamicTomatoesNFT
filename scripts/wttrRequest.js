const ethers = await import("npm:ethers@6.10.0");

const wttrResult = await Functions.makeHttpRequest({
  url: "https://wttr.in/Napoli",
  responseType: "text",
  params: {
    format: "%t:+%h",
  },
});

if (wttrResult.error) {
  throw new Error("Errore nella richiesta a wttr.in");
}

const dataResult = {
  temp: wttrResult.data.split(':')[0].replace('+', '').replace('°C', ''),
  hum: wttrResult.data.split(":")[1].replace('+', '').replace('%', ''),
};


const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
  ['uint256', 'uint256'],
  [Math.round(dataResult.temp), Math.round(dataResult.hum)]
)

return ethers.getBytes(encodedData)