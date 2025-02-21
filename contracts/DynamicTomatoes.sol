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

    string[5] private ipfsImages = [
        "ipfs://bafkreiez5dbnt2wfvy2l62jj47cd5m55evs5xy3lgwl2ebvb4i33v362ja",
        "ipfs://bafkreifh6bmq55bfakggwyfakopgozzblw3tfbezzc3oop2efkd5h46kca",
        "ipfs://bafkreibb2rbzv3uiapbgdagp2u7usyr2pj2i3tdwkjwvfh6a7i2eumag2e",
        "ipfs://bafkreih5ksj6jriiheb3benmybxyccdjlq4vnzn4bnnooftecwcomwj2xu",
        "ipfs://bafkreieye4bba5ntf2j657nuzx2xa3jeojkfmvez7p3s7znnkrig7e4nh4"
    ];

    uint8 public constant TOMATO_STAGES_COUNT = 5;

    Counters.Counter _tokenIds;
    mapping(uint256 => uint256) weatherRequests;
    mapping(uint256 => uint8) tomatoesStages;

    constructor()
        ERC721("DynamicTomatoes", "DT")
        FunctionsClient(FUNCTIONS_ROUTER)
        Ownable(msg.sender)
    {}

    function mint() public onlyOwner {}

    function grow(uint256 _tokenId) public {}

    function safeGrow(
        uint256 _tokenId,
        uint256 temp,
        uint256 hum
    ) public onlyOwner {}

    function forceGrow(uint256 _tokenId, uint8 _stage) public onlyOwner {}

    function setStage(uint256 _tokenId, uint8 _stage) internal {}

    function requestUpdate(
        uint256 _tokenId,
        uint8 _secretsSlotID,
        uint64 _secretsVersion
    ) internal {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(dataRequest);
        req.addDONHostedSecrets(_secretsSlotID, _secretsVersion);

        _sendRequest(
            req.encodeCBOR(),
            4291,
            300000,
            0x66756e2d657468657265756d2d7365706f6f6c69612d3100000000000000000000
        );

        weatherRequests[_tokenId] = uint256(req.id);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            revert("cannot verify weather data due to an error");
        }

        (uint256 temp, uint256 hum) = abi.decode(response, (uint256, uint256));
    }
}
