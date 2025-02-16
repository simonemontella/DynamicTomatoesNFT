//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract ChainlinkTest is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    event Debug(string message);

    uint256 public temperature;
    uint256 public humidity;

    string public request = 
    "const wttrResult = await Functions.makeHttpRequest({"
    "url: \"https://wttr.in/Napoli\","
    "responseType: \"text\","
    "params: {"
    "format: \"%t:+%h\""
    "}"
    "});"

    "if (wttrResult.error) {"
    "throw new Error(\"Errore nella richiesta a wttr.in\");"
    "}"

    "const dataResult = {"
    "temp: wttrResult.data.split(\":\")[0],"
    "hum: wttrResult.data.split(\":\")[1]"
    "};"

    "return Functions.encodeString(JSON.stringify(dataResult));";


    /*string openWeatherReq = string.concat(
    "const response = await Functions.makeHttpRequest({",
        "url: \"https://api.openweathermap.org/data/2.5/weather\",",
        "method: \"GET\",",
        "params: {",
            "q: \"Naples\",",
            "appid: secrets[\"OPENWEATHER_API_KEY\"],",
            "units: \"metric\"",
        "}",
    "});",

    "if (response.error) {",
        "throw new Error(\"Errore nella richiesta a OpenWeatherMap\");",
    "}",

    "const dataResult = {",
        "temp: response.data.main.temp,",
        "hum: response.data.main.humidity",
    "};",

    "return Functions.encodeString(JSON.stringify(dataResult));"
);*/


    constructor() Ownable(msg.sender) FunctionsClient(FUNCTIONS_ROUTER) {}

    function fakeRequest(
        uint8 _secretsSlotID,
        uint64 _secretsVersion,
        uint32 _gasLimit) external onlyOwner {
                emit Debug("Inizio richiesta");
                emit Debug(string.concat("Parametri: ", 
                            Strings.toString(_secretsSlotID), ",", 
                            Strings.toString(_secretsVersion), ",", 
                            Strings.toString(_gasLimit)));
    }

    function updateData(
        //uint8 _secretsSlotID,
        //uint64 _secretsVersion,
        uint32 _gasLimit) external onlyOwner {
        emit Debug("invio richiesta");
        emit Debug(string.concat("parametri (", 
                    //Strings.toString(_secretsSlotID), ",", 
                    //Strings.toString(_secretsVersion), ",", 
                    Strings.toString(_gasLimit), ")"));
        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(request);

        /*emit Debug("aggiungo secrets dal DON");
        req.addDONHostedSecrets(_secretsSlotID, _secretsVersion);*/

        _sendRequest(
            req.encodeCBOR(), //CBOR = Concise Binary Object Reperesentation
            4291, //subscriptionID
            _gasLimit, //gasLimit
            0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000 //donID
        );

        emit Debug("richiesta inviata");
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        emit Debug("risposta ricevuta da Chainlink Functions");
        if (err.length > 0) {
            emit Debug(string.concat("ERRORE FULFILL: ", string(err)));
            revert("Errore nella risposta da Chainlink Functions");
        }

        emit Debug(string(response));
        //(int256 temp, int256 hum) = abi.decode(response, (int256, int256));

        //temperature = uint256(temp);
        //humidity = uint256(hum);
    }

}
