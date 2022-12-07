require('dotenv').config();
const alchemyKey = process.env.GOERLI_API_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('..abi.json')
const contractAddress = "0x58a56731d3177eec6e395b4397c00f6e1a1436a8";

export const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

export const loadCurrentMessage = async () => {
    const message = await helloWorldContract.methods.MAX_SUPPLY().call();
    return message;
};