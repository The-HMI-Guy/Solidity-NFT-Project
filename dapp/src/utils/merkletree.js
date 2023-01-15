const { MerkleTree } = require("merkletreejs");
const { verify } = require("merkle-proof");
const keccak256 = require("keccak256");
const addresses = require("./addresses.json");

const findHexProof = (address) => {
  let indexOfArray = addresses.indexOf(address);
  console.log("index: ", indexOfArray);
  let leafNode = addresses.map((address) => keccak256(address));
  const tree = new MerkleTree(leafNode, keccak256, { sortPairs: true });
  const clamingAddress = leafNode[indexOfArray];
  const hexProof = tree.getHexProof(clamingAddress);
  console.log("HexProof: ", hexProof);
  console.log("Root: ", "0x" + tree.getRoot().toString("hex"));
  return hexProof;
};

const verifyProof = (hexProof, root, address) => {
  const isValid = verify(hexProof, root, address, keccak256);
  return isValid;
};

exports.findHexProof = findHexProof;
exports.verifyProof = verifyProof;
