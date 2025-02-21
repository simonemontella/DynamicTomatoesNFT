//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
contract ChainlinkTest is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    string public openWeatherRequest =
        "const ethers = await import('npm:ethers@6.13.5');"
        "const response = await Functions.makeHttpRequest({"
        "'url': 'https://api.openweathermap.org/data/2.5/weather',"
        "'method': 'GET',"
        "'params': { 'q': 'Naples', 'appid': secrets.OPENWEATHER_API_KEY, 'units': 'metric' }"
        "});"
        "if (response.error) { throw new Error('Errore nella richiesta a OpenWeatherMap'); }"
        "const encodedData = ethers.AbiCoder.defaultAbiCoder().encode("
        "['uint256', 'uint256'],"
        "[Math.round(response.data.main.temp), Math.round(response.data.main.humidity)]"
        ");"
        "return ethers.getBytes(encodedData);";

    constructor() Ownable(msg.sender) FunctionsClient(FUNCTIONS_ROUTER) {}

    uint256 public temperature;
    uint256 public humidity;

    event Debug(string message);

    function updateData(
        uint8 _secretsSlotID,
        uint64 _secretsVersion
    ) external onlyOwner {
        emit Debug("invio richiesta");

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(openWeatherRequest);

        emit Debug("aggiungo secrets dal DON");
        req.addDONHostedSecrets(_secretsSlotID, _secretsVersion);

        _sendRequest(
            req.encodeCBOR(), //CBOR = Concise Binary Object Reperesentation
            4291, //subscriptionID
            300000, //gasLimit
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

        (uint256 temp, uint256 hum) = abi.decode(response, (uint256, uint256));

        temperature = temp;
        humidity = hum;

        emit Debug(
            string.concat(
                "temperature: ",
                Strings.toString(temp),
                " humidity: ",
                Strings.toString(humidity)
            )
        );
    }
}