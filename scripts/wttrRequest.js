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
  temp: wttrResult.data.split(":")[0],
  hum: wttrResult.data.split(":")[1],
};

return Functions.encodeString(JSON.stringify(dataResult));
