//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract ParthenopeNFT is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    uint32 gasLimit = 300000;

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

    constructor () 
        Ownable(msg.sender)
        FunctionsClient(FUNCTIONS_ROUTER) {}
    
    function sendRequest(uint64 _subscriptionId) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(request); 

        return _sendRequest(
            req.encodeCBOR(),
            _subscriptionId,
            gasLimit,
            donID
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        //TODO
    }

}