// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//Remix style import
import { IERC20 } from "@openzeppelin/contracts@4.0.0/token/ERC20/IERC20.sol";

//Brownie style import
// import { IERC20 } from "OpenZeppelin/openzeppelin-contracts@4.0.0/contracts/token/ERC20/IERC20.sol";


contract MainBridge {

    IERC20 private mainToken;

    address v1;
    address v2;
    address v3;

    bool isV1;
    bool isV2;
    bool isV3;


    event TokensLocked(address indexed requester, bytes32 indexed mainDepositHash, uint amount, uint timestamp);
    event TokensUnlocked(address indexed requester, bytes32 indexed sideDepositHash, uint amount, uint timestamp);

    constructor (address _mainToken, address _v1, address _v2, address _v3) {
        mainToken = IERC20(_mainToken);
        v1 = _v1;
        v2 = _v2;
        v3 = _v3;
        isV1 = false;
        isV2 = false;
        isV3 = false;
    }

    function viewValidatorStatus() external view returns(bool, bool, bool) {
        return(isV1, isV2, isV3);
    }

    function clearValidators() external {
        isV1 = false;
        isV2 = false;
        isV3 = false;
    }


    function validator_1() external {
        require(msg.sender == v1);
        isV1 = true;
    }

    function validator_2() external {
        require(msg.sender == v2);
        isV2 = true;
    }

    function validator_3() external {
        require(msg.sender == v3);
        isV3 = true;
    }


    function lockTokens (address _requester, uint _bridgedAmount, bytes32 _mainDepositHash) onlyValidated external {
        emit TokensLocked(_requester, _mainDepositHash, _bridgedAmount, block.timestamp);
    }

    function unlockTokens (address _requester, uint _bridgedAmount, bytes32 _sideDepositHash) onlyValidated external {
        mainToken.transfer(_requester, _bridgedAmount);
        emit TokensUnlocked(_requester, _sideDepositHash, _bridgedAmount, block.timestamp);
    }

    modifier onlyValidated {
      require((isV1 && isV2) || (isV1 && isV3) || (isV2 && isV3));
      _;
    }
    

}
