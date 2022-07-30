import 'https://cdn.esm.sh/v58/web3@1.6.1/es2021/web3.js';

const web3 = new Web3(
    "https://kovan.infura.io/v3/d855c3d2acb54bf5a5a967e04e39c730"
  );

  const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
];


async function getPrice() {
    return new Promise (resolve => {
      let addr;
      const crypto = document.getElementById("cryptoSelect").value;
      console.log(crypto);
      if (crypto === 'bitcoin') {
        addr = "0x6135b13325bfC4B00278B4abC5e20bbce2D6580e";
      } else if (crypto === 'ethereum') {
        addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";
      }
      

      console.log(addr);

      const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

      priceFeed.methods
      .latestRoundData()
      .call()
      .then((roundData) => {
        // Do something with roundData
        let price = roundData.answer * 10 ** -8;
        resolve(price);
      });
    });
    
}

export async function asyncCall() {
    let price = await getPrice();
    console.log(price)
    document.getElementById("price").innerHTML = price;
    console.log(price);
    console.log('module func working');
}

