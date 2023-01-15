const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const addresses = require("./addresses.json");

let leafNode = addresses.map((address) => keccak256(address));
const tree = new MerkleTree(leafNode, keccak256, { sortPairs: true });

const findHexProof = (address) => {
  let indexOfArray = addresses.indexOf(address);
  const clamingAddress = leafNode[indexOfArray];
  return tree.getHexProof(clamingAddress);
};

const verifyProof = (hexProof, root, address) => {
  const isValid = tree.verify(hexProof, address, root);
  return isValid;
};

exports.findHexProof = findHexProof;
exports.verifyProof = verifyProof;
