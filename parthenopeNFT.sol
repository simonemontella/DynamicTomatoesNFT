// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ParthenopeNFT is ERC721, Ownable {

    string public metadataURL;

    constructor(string memory _initialURL) ERC721("ParthenopeNFT", "PNP") Ownable(msg.sender) {
        metadataURL = _initialURL;
    }

    function changeMetadataURL(string memory _newURL) public onlyOwner {
        metadataURL = _newURL;
    }

    // viene generata automaticamente per le variabili di stato pubbliche
    /*function getMetadataURL() external view returns (string memory) {
        return metadataURL;
    }*/


}