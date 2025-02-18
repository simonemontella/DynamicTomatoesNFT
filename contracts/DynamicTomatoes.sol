// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsRequest.sol";

contract DynamicTomatoes is ERC721URIStorage, FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;
    using Counters for Counters.Counter;

    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;

    Counters.Counter private _tokenIdCounter;

    constructor()
        ERC721("DynamicTomatoes", "DT")
        FunctionsClient(FUNCTIONS_ROUTER)
        Ownable(msg.sender)
    {}

    function grow(uint256 _tokenId) public {}

    string public dataRequest =
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

    function updateData(
        uint8 _secretsSlotID,
        uint64 _secretsVersion
    ) external onlyOwner {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(dataRequest);
        req.addDONHostedSecrets(_secretsSlotID, _secretsVersion);

        _sendRequest(
            req.encodeCBOR(),
            4291,
            300000,
            0x66756e2d657468657265756d2d7365706f6f6c69612d3100000000000000000000
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            revert("cannot get weather data");
        }

        (uint256 temp, uint256 hum) = abi.decode(response, (uint256, uint256));
    }
}
