// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";

contract DynamicTomatoes is ERC721URIStorage, FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    event TomatoMinted(uint8 tomatoId, address owner);
    event TomatoGrown(uint256 tomatoId, uint8 stage);
    event TomatoGrowthRequest(uint8 tomatoId, bytes32 requestId);
    event WeatherDataReceived(uint256 temperature, uint256 humidity);
    event Debug(string msg);

    uint8 public constant CONTRACT_VERSION = 6;

    /* CHAINLINK */
    address FUNCTIONS_ROUTER = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0;
    bytes32 DON_ID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    uint32 GAS_LIMIT = 300000;
    uint64 SUBSCRIPTION_ID = 4351; //4291 testing
    string dataRequest =
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

    string[5] private metadata = [
        "ipfs://bafkreihckbanskuhuxrzis7fqplfv7ol3uj64ztg6ullgje4xineynfjuu",
        "ipfs://bafkreid4pkgdc7qxrmsq4ab7r63rof76budicrvvocqvuejnpwkso37uzm",
        "ipfs://bafkreihdvuyurrsa26723trpt4vhntj42syeeb7o4lp3v7fyn7tleyynve",
        "ipfs://bafkreig5gfybheg2p2546gqhpyz3g5t6hgax7xqtfoxhe56sts67bprjj4",
        "ipfs://bafkreib4ielhjes3g3rgb2pmh63gftrp4uku4gb573gcbcqw7drqxnnfqu"
    ];

    uint8 public constant TOMATO_STAGES_COUNT = 5;
    uint8 public constant MIN_FAVORABLE_TEMPERATURE = 10;
    uint8 public constant MAX_FAVORABLE_TEMPERATURE = 30;
    uint8 public constant MIN_FAVORABLE_HUMIDITY = 40;
    uint8 public constant MAX_FAVORABLE_HUMIDITY = 90;

    uint8 private _tomatoesIds;
    mapping(uint8 => uint8) private _tomatoesStages;
    mapping(bytes32 => uint8) private _updateRequests;
    mapping(uint8 => address) private _tomatoOwners;

    constructor()
        ERC721("DynamicTomatoes", "DT")
        FunctionsClient(FUNCTIONS_ROUTER)
        Ownable(msg.sender)
    {}

    function mint() public {
        uint8 tomatoId = _tomatoesIds;

        _safeMint(msg.sender, tomatoId);
        emit Debug("minted");
        _tomatoOwners[tomatoId] = msg.sender;
        _setStage(tomatoId, 0);

        emit TomatoMinted(tomatoId, msg.sender);
        _tomatoesIds++;
        emit Debug("incremented counter");
    }

    function getStage(uint8 _tomatoId) public view returns (uint8) {
        return _tomatoesStages[_tomatoId];
    }

    function adminGrow(
        uint8 _tomatoId
    ) public onlyOwner growableTomato(_tomatoId) {
        _setStage(_tomatoId, _tomatoesStages[_tomatoId] + 1);
    }

    function forceGrow(
        uint8 _tomatoId,
        uint256 _temperature,
        uint256 _humidity
    ) public onlyOwner growableTomato(_tomatoId) {
        _tryWeatherGrow(_tomatoId, _temperature, _humidity);
    }

    function _setStage(uint8 _tomatoId, uint8 _stage) internal {
        emit Debug("set stage");
        _tomatoesStages[_tomatoId] = _stage;
        emit Debug("stage updated");
        _setTokenURI(_tomatoId, metadata[_stage]);
        emit Debug("metadata updated");

        emit TomatoGrown(_tomatoId, _stage);
    }

    function grow(
        uint8 _tomatoId,
        uint8 _secretsSlotID,
        uint64 _secretsVersion
    ) public onlyAdminOrTomatoOwner(_tomatoId) growableTomato(_tomatoId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(dataRequest);
        req.addDONHostedSecrets(_secretsSlotID, _secretsVersion);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            SUBSCRIPTION_ID,
            GAS_LIMIT,
            DON_ID
        );

        emit Debug("request sent");
        _updateRequests[requestId] = _tomatoId;
        emit Debug("request saved");
        emit TomatoGrowthRequest(_tomatoId, requestId);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        emit Debug("request fulfilled");
        if (err.length > 0) {
            emit Debug(string.concat("ERROR: ", string(err)));
            revert("cannot verify weather data due to an error");
        }

        emit Debug(string.concat("RESPONSE: ", string(response)));
        (uint256 temp, uint256 hum) = abi.decode(response, (uint256, uint256));
        emit WeatherDataReceived(temp, hum);
        uint8 tomatoId = _updateRequests[requestId];

        _tryWeatherGrow(tomatoId, temp, hum);
    }

    function _tryWeatherGrow(
        uint8 _tomatoId,
        uint256 _temperature,
        uint256 _humidity
    ) internal {
        emit Debug("weather test");
        if (_isWeatherFavorable(_temperature, _humidity)) {
            emit Debug("weather ok");
            _setStage(_tomatoId, _tomatoesStages[_tomatoId] + 1);
        } else {
            emit Debug("weather fail");
            revert("weather conditions are not favorable");
        }
    }

    function _isWeatherFavorable(
        uint256 temperature,
        uint256 humidity
    ) internal pure returns (bool) {
        return
            (temperature > MIN_FAVORABLE_TEMPERATURE &&
                temperature < MAX_FAVORABLE_TEMPERATURE) &&
            (humidity > MIN_FAVORABLE_HUMIDITY &&
                humidity < MAX_FAVORABLE_HUMIDITY);
    }

    modifier onlyAdminOrTomatoOwner(uint8 _tomatoId) {
        require(
            msg.sender == _tomatoOwners[_tomatoId] || msg.sender == owner(),
            "only the tomato owner (or admin) can grow it"
        );
        _;
    }

    modifier growableTomato(uint8 _tomatoId) {
        require(
            (_tomatoesStages[_tomatoId] + 1) < TOMATO_STAGES_COUNT,
            "tomato is fully grown"
        );
        _;
    }
}
