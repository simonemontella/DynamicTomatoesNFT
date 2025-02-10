require("dotenv").config();

const response = await Functions.makeHttpRequest({
  url: `https://api.openweathermap.org/data/2.5/weather`,
  method: "GET",
  params: {
    q: "Naples",
    appid: process.env.OPENWEATHER_API_KEY,
  },
});

if (response.error) {
  throw new Error("Errore nella richiesta a OpenWeatherMap");
}

const dataResult = {
  temp: response.data.main.temp,
  hum: response.data.main.humidity,
};

return Functions.encodeString(JSON.stringify(dataResult));
