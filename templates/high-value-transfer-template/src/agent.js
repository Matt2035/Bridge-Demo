const {
  Finding,
  FindingSeverity,
  FindingType,
  ethers,
} = require("forta-agent");

// This bot is not built for scale. Only returns info/warning about the first pinned transaction in the array.
// If multiple occur in the same block it will only print info on the first one. This is good enough for a simple 
// demonstration with only one transaction at a time

let findingsCache = [];
let isScanningRinkeby = false;
let currentRinkebyBlockNumber = -1;
const RINKEBY_RPC_URL = "https://rinkeby.infura.io/v3/d855c3d2acb54bf5a5a967e04e39c730";
const rinkebyProvider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL);

let findingsCount = 0;

async function initialize() {
  currentRinkebyBlockNumber = await rinkebyProvider.getBlockNumber();
}

async function scanRinkebyBlocks() {
  isScanningRinkeby = true;

  const latestRinkebyBlockNumber = await rinkebyProvider.getBlockNumber();
  while (currentRinkebyBlockNumber <= latestRinkebyBlockNumber) {
    // fetch rinkeby block
    const rinkebyBlock = await rinkebyProvider.getBlock(
      currentRinkebyBlockNumber
    );

      console.log("rinkeby block", currentRinkebyBlockNumber)
      rinkebyProvider.getLogs({
            // address: "0xFE439F397f4285a327c0884955c1bFB2770FD8B1",
            address: "0xB856BCB0ecd646b864C3D2Ae460956E201540682",
            // these blocks can be used for testing
            // fromBlock: 11060000,
            // toBlock: 11060020,
            fromBlock: currentRinkebyBlockNumber,
            toBlock: currentRinkebyBlockNumber,
            topics: [
              // the 0x508... hexidecimal represents keccak256(TokensLocked(address,bytes32,uint256,uint256))
              // from MainBridge
              // '0x508bc5d33807c46db43ce875d48dca24de9d41f9fcb35ce6e51daed771fafe59',
              // the 0xddf... hexidecimal represents keccak256(Transfer(address,address,uint256)
              // from MainToken
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            ]
          }).then((res) => {
              if (res[0] != undefined) {
                let value = parseInt(res[0]["data"]*(10**-18))
                if (value >= 5) {
                    findingsCache.push(
                      Finding.fromObject({
                        name: "High Value Transaction",
                        description: `Transaction with token value >5 tokens: ${value.toString()} pETH`,
                        alertId: "RINK-1",
                        severity: FindingSeverity.Info,
                        type: FindingType.Info,
                        metadata: {
                          txHash: res[0]["transactionHash"],
                        },
                      })
                    );
                  }
                }
              })

    currentRinkebyBlockNumber++;
  }

  isScanningRinkeby = false;
}

async function handleBlock(blockEvent) {
  let findings = [];

  // check if we have any findings cached
  if (findingsCache.length > 0) {
    findings = findingsCache;
    findingsCache = [];
  }

  // make sure only one task is running at a time
  if (!isScanningRinkeby) {
    scanRinkebyBlocks();
  }

  return findings;
}

module.exports = {
  initialize,
  handleBlock,
};

