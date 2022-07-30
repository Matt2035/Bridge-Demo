const {
  Finding,
  FindingSeverity,
  FindingType,
  ethers,
} = require("forta-agent");

let findingsCache = [];
let isScanningRinkeby = false;
let currentRinkebyBlockNumber = -1;
const RINKEBY_RPC_URL = "<ENTER_INFURA_ENDPOINT_HERE>";
const rinkebyProvider = new ethers.providers.JsonRpcProvider(RINKEBY_RPC_URL);
const CONTRACT_ADDRESS = "<ENTER_MAIN_BRIDGE_ADDRESS_HERE>"

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
    console.log("Rinkeby Block - ", currentRinkebyBlockNumber);
    // fetch receipt for each transaction in block
    for (const tx of rinkebyBlock.transactions) {
      const receipt = await rinkebyProvider.getTransactionReceipt(tx);

      if (receipt.to != null) {
        let receiptLower = receipt.to.toLowerCase()
        let contractAddressLower = CONTRACT_ADDRESS.toLowerCase()
        if ((receiptLower == contractAddressLower) && (receipt.gasUsed.gt("1000"))) {
          findingsCache.push(
            Finding.fromObject({
              name: "High gas used",
              description: `Transaction with high gas usage: ${receipt.gasUsed.toString()}`,
              alertId: "RINK-1",
              severity: FindingSeverity.Info,
              type: FindingType.Info,
              metadata: {
                txHash: tx,
                gasUsed: receipt.gasUsed.toString(),
              },
            })
          );
        }
      }
    }
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
