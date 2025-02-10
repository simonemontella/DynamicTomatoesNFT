//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract ChainlinkTest is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    uint256 temperature;
    uint256 humidity;

    string request =
        "const response = await Functions.makeHttpRequest({"
        "url: `https://api.openweathermap.org/data/2.5/weather`,"
        "method: 'GET',"
        "params: {"
        "q: 'Naples',"
        "appid: secrets.OPENWEATHER_API_KEY"
        "}"
        "});"
        "if (response.error) {"
        "throw new Error('Errore nella richiesta a OpenWeatherMap');"
        "}"
        "const dataResult = {"
        "temp: response.data.main.temp,"
        "hum: response.data.main.humidity"
        "}"
        "return Functions.encodeString(JSON.stringify(dataResult));";

    constructor() Ownable(msg.sender) FunctionsClient(FUNCTIONS_ROUTER) {}

    function requestData() external onlyOwner {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(request);

        _sendRequest(
            req.encodeCBOR(), //CBOR = Concise Binary Object Reperesentation
            4291, //subscriptionID
            300000, //gasLimit
            0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000 //donID
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            revert("Errore nella risposta da Chainlink Functions");
        }

        (int256 temp, int256 hum) = abi.decode(response, (int256, int256));

        temperature = uint256(temp);
        humidity = uint256(hum);
    }
}
