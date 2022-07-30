const serverUrl = "https://nm8exgxrkcrb.usemoralis.com:2053/server";
const appId = "EQsElaEJoFvIMWG5OOEEinIol663VC5U17VfEXAb";
Moralis.start({ serverUrl, appId }); 

const mainTokenAddress = "0xB856BCB0ecd646b864C3D2Ae460956E201540682";
const mainBridgeAddress = "0xFE439F397f4285a327c0884955c1bFB2770FD8B1";

login();


import { asyncCall } from "./chainlink-price-feed.mjs";
import { asyncCallClearValidate, asyncCallViewStatus, asyncCallValidate1, asyncCallValidate2, asyncCallValidate3 } from "./validateBridge.mjs";
window.asyncCallViewStatus = asyncCallViewStatus;
window.asyncCallClearValidate = asyncCallClearValidate;
window.asyncCallValidate1 = asyncCallValidate1;
window.asyncCallValidate2 = asyncCallValidate2;
window.asyncCallValidate3 = asyncCallValidate3;
window.asyncCall = asyncCall;
window.bridge=bridge;


async function login(){
    Moralis.Web3.enableWeb3().then(async function (){
        renderBridgeData();
        subscribeUpdateBridged();
        const chainIdHex = await Moralis.switchNetwork("0x4"); 
    });
}

async function bridge() {
    const amountToBridge = document.getElementById("amountToken").value;
    const options = {type: "erc20", 
                 amount: Moralis.Units.Token(amountToBridge, "18"), 
                 receiver: mainBridgeAddress,
                 contractAddress: mainTokenAddress}
    let result = await Moralis.transfer(options)
}

async function renderBridgeData () {
    queryLocked().then( (lockedData)=> {
        buildTableLocked(lockedData);
    });
    queryBridged().then( (bridgedData) =>{
        buildTableBridged(bridgedData);
    });
}

async function subscribeUpdateBridged(){
    let query = new Moralis.Query("TokensBridged");
    query.equalTo("requester", ethereum.selectedAddress);
    const subscriptionBridged = await query.subscribe();
    subscriptionBridged.on('create', async (object) => {
        const depositHash= JSON.parse(JSON.stringify(object,["mainDepositHash"])).mainDepositHash;
        window.alert("Token Bridged with origin in " + depositHash);
    });
}

async function queryLocked(){
    const query = new Moralis.Query("TokensLocked");
    query.equalTo("requester", ethereum.selectedAddress);
    const results = await query.find()
    return JSON.parse(JSON.stringify(results, ["mainDepositHash", "amount", "requester"]))
}

async function queryBridged(){
    const query = new Moralis.Query("TokensBridged");
    query.equalTo("requester", ethereum.selectedAddress);
    const results = await query.find()
    return JSON.parse(JSON.stringify(results, ["mainDepositHash", "amount", "requester"]))
}

function buildTableLocked(data){
    document.getElementById("lockedTransactions").innerHTML = `<table class="table table-dark table-striped" id="lockedTable">
                                                            </table>`;
    const table = document.getElementById("lockedTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Main Deposit Hash</th>
                                <th>Amount Bridged</th>
                                <th>Requester</th>
                            </tr>
                        </thead>`
    table.innerHTML += rowHeader;
    for (let i=0; i < data.length; i++){
        let row = `<tr>
                        <td>${data[i].mainDepositHash}</td>
                        <td>${data[i].amount/1e18}</td>
                        <td>${data[i].requester}</td>
                    </tr>`
        table.innerHTML += row
    }
}

function buildTableBridged(data){
    document.getElementById("tokensBridged").innerHTML = `<table class="table table-dark table-striped" id="bridgedTable">
                                                            </table>`;
    const table = document.getElementById("bridgedTable");
    const rowHeader = `<thead>
                            <tr>
                                <th>Main Deposit Hash</th>
                                <th>Amount Bridged</th>
                                <th>Requester</th>
                            </tr>
                        </thead>`
    table.innerHTML += rowHeader;
    for (let i=0; i < data.length; i++){
        let row = `<tr>
                        <td>${data[i].mainDepositHash}</td>
                        <td>${data[i].amount/1e18}</td>
                        <td>${data[i].requester}</td>
                    </tr>`
        table.innerHTML += row
    }
}