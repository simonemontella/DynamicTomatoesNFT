const ethers = await import("npm:ethers@6.10.0");

const response = await Functions.makeHttpRequest({
  url: "https://api.openweathermap.org/data/2.5/weather",
  method: "GET",
  params: {
    q: "Naples",
    appid: secrets.OPENWEATHER_API_KEY,
    units: "metric",
  },
});

if (response.error) {
  throw new Error("Errore nella richiesta a OpenWeatherMap");
}

const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
  ["uint256", "uint256"],
  [Math.round(response.data.main.temp), Math.round(response.data.main.humidity)]
);

return ethers.getBytes(encodedData);
