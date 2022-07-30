import 'https://cdn.esm.sh/v58/web3@1.6.1/es2021/web3.js';

const web3 = new Web3(
    "https://rinkeby.infura.io/v3/d855c3d2acb54bf5a5a967e04e39c730"
  );

const MainBridge = "0xFE439F397f4285a327c0884955c1bFB2770FD8B1"; 
const private_key_1 = "7ad639bfac365c97034f349a42836fd61f4b5ea95f5839090b1e93711dc425f5";
const val_1 = "0x42A028e9d8f0Bd6858a782AECC90C56B04365a01";
const private_key_2 = "d9c6173bc2459f95866e706f9833c324f157673c34569bd1510c4067bee3c4cb";
const val_2 = "0xC4bf9790ceB664D4bAB0FA3d0fb4F9f71aEA9DD4";
const private_key_3 = "a55bfe038f8418b6000fc30db531818fe22ffb04530e33af850cdb2f022341ae";
const val_3 = "0x8eb6b5bf64C4f25c7521dA4D97aC783c44F26B25";l

const ABI = [
	{
		"inputs": [],
		"name": "clearValidators",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_requester",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_bridgedAmount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_mainDepositHash",
				"type": "bytes32"
			}
		],
		"name": "lockTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_mainToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_val1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_val2",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_val3",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "mainDepositHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TokensLocked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "requester",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "sideDepositHash",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TokensUnlocked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_requester",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_bridgedAmount",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "_sideDepositHash",
				"type": "bytes32"
			}
		],
		"name": "unlockTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "validator_1",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "validator_2",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "validator_3",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewValidatorStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];



async function viewStatus() {
    return new Promise (resolve => {
	  var contract = new web3.eth.Contract(ABI,MainBridge);
	  contract.methods.viewValidatorStatus().call().then((x) => {
		  resolve(x);
	  })
	});
}

export async function asyncCallViewStatus() {
    let status = await viewStatus();
	if (status[0] == true) {
		document.getElementById("status-1").innerHTML = "Validator 1 - <b> Validated</b>";
	} else {
		document.getElementById("status-1").innerHTML = "Validator 1 - <b> Not Validated</b>";
	}
	if (status[1] == true) {
		document.getElementById("status-2").innerHTML = "Validator 2 - <b> Validated</b>";
	} else {
		document.getElementById("status-2").innerHTML = "Validator 2 - <b> Not Validated</b>";
	}
	if (status[2] == true) {
		document.getElementById("status-3").innerHTML = "Validator 3 - <b> Validated</b>";
	} else {
		document.getElementById("status-3").innerHTML = "Validator 3 - <b> Not Validated</b>";
	}
}

export function clearValidate() {
	document.getElementById("clear-complete").innerHTML = "Clear Validation - Clearing...";
    return new Promise (resolve => {
		let private_key=private_key_1;
		var contract = new web3.eth.Contract(ABI,MainBridge);
		let tx = contract.methods.clearValidators();
		let encoded_tx = tx.encodeABI();
		let transactionObject = {
			gas: 100000,
			data: encoded_tx,
			from: val_1,
			to: MainBridge
		};
		web3.eth.accounts.signTransaction(transactionObject, private_key, function (error, signedTx) {
			if (error) {
			console.log(error);
			// handle error
		} else {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.on('receipt', function (receipt) {
				//do something
				console.log('clear complete');
				console.log(receipt);
				document.getElementById("clear-complete").innerHTML = "Clear Validation";
				alert("Validation Clear Complete");
		 });
		}
	  });
	})
}

export async function asyncCallClearValidate() {
	let status = await clearValidate();
	console.log(status);
}


export function validate1() {
	document.getElementById("validate-1").innerHTML = "Validator 1 - Validating....";
    return new Promise (resolve => {
		let private_key=private_key_1;
		var contract = new web3.eth.Contract(ABI,MainBridge);
		let tx = contract.methods.validator_1();
		let encoded_tx = tx.encodeABI();
		let transactionObject = {
			gas: 100000,
			data: encoded_tx,
			from: val_1,
			to: MainBridge
		};
		web3.eth.accounts.signTransaction(transactionObject, private_key, function (error, signedTx) {
			if (error) {
			console.log(error);
			// handle error
		} else {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.on('receipt', function (receipt) {
				//do something
				console.log('validation successful');
				console.log(receipt);
				document.getElementById("validate-1").innerHTML = "Validator 1";
				alert("Validator 1 - Validation Complete");
		 });
		}
	  });
	})
}

export async function asyncCallValidate1() {
	let status = await validate1();
	console.log(status);
}

export function validate2() {
	document.getElementById("validate-2").innerHTML = "Validator 2 - Validating....";
    return new Promise (resolve => {
		let private_key=private_key_2;
		var contract = new web3.eth.Contract(ABI,MainBridge);
		let tx = contract.methods.validator_2();
		let encoded_tx = tx.encodeABI();
		let transactionObject = {
			gas: 100000,
			data: encoded_tx,
			from: val_2,
			to: MainBridge
		};
		web3.eth.accounts.signTransaction(transactionObject, private_key, function (error, signedTx) {
			if (error) {
			console.log(error);
			// handle error
		} else {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.on('receipt', function (receipt) {
				//do something
				console.log('validation successful');
				console.log(receipt);
				document.getElementById("validate-2").innerHTML = "Validator 2";
				alert("Validator 2 - Validation Complete");
		 });
		}
	  });
	})
}

export async function asyncCallValidate2() {
	let status = await validate2();
	console.log(status);
}

export function validate3() {
	document.getElementById("validate-3").innerHTML = "Validator 3 - Validating....";
    return new Promise (resolve => {
		let private_key=private_key_3;
		var contract = new web3.eth.Contract(ABI,MainBridge);
		let tx = contract.methods.validator_3();
		let encoded_tx = tx.encodeABI();
		let transactionObject = {
			gas: 100000,
			data: encoded_tx,
			from: val_3,
			to: MainBridge
		};
		web3.eth.accounts.signTransaction(transactionObject, private_key, function (error, signedTx) {
			if (error) {
			console.log(error);
			// handle error
		} else {
			web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.on('receipt', function (receipt) {
				//do something
				console.log('validation successful');
				console.log(receipt);
				document.getElementById("validate-3").innerHTML = "Validator 3";
				alert("Validator 3 - Validation Complete");
		 });
		}
	  });
	})
}

export async function asyncCallValidate3() {
	let status = await validate3();
	console.log(status);
}