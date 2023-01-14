const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const addresses = require("./addresses.json");
const { verify } = require("merkle-proof");


const findHexProof = async (dappAddress) => {
  let indexOfArray = await addresses.indexOf(dappAddress);
  let leafNode = addresses.map((dappAddress) => keccak256(dappAddress));
  const tree = new MerkleTree(leafNode, keccak256, { sortPairs: true });
  const clamingAddress = leafNode[indexOfArray];
  const hexProof = tree.getHexProof(clamingAddress);
  console.log("HexProof: ", hexProof);
  console.log("Root: ", "0x" + tree.getRoot().toString("hex"));

  return hexProof;
};

const verifyProof = async (hexProof, root, address) => {
    const isValid = await verify(hexProof, root, address, keccak256);
    return isValid;
}


const result = findHexProof("0x7B05E576A5aC57aBebc1D26F83954b2c522FAa3d");
console.log(result);
