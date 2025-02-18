// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTTest is ERC721, Ownable {
    string public metadataURL;

    uint256 public temperature;
    uint256 public humidity;

    constructor(
        string memory _metadataURL
    ) ERC721("ParthenopeNFT", "PNP") Ownable(msg.sender) {
        metadataURL = _metadataURL;
    }

    function changeMetadataURL(string memory _newURL) public onlyOwner {
        metadataURL = _newURL;
    }
}
