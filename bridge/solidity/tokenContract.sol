// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Remix style import
import { ERC20 } from "@openzeppelin/contracts@4.0.0/token/ERC20/ERC20.sol";

//Brownie style import
// import { ERC20 } from "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC20/ERC20.sol";


contract BridgeCredits is ERC20 {
    constructor(uint256 initialSupply) ERC20("Polygon Ethereum Token", "pETH") {
        _mint(msg.sender, initialSupply);
    }
}
