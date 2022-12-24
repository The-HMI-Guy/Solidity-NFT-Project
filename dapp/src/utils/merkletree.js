const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const addresses = require("./addresses.json");

const leaves = addresses.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sort: true });
const root = tree.getRoot().toString("hex");
const leaf = keccak256(addresses[19]);
const proof = tree.getProof(leaf);

// console.log(tree.verify(proof, leaf, root)); // true

// const badLeaves = addresses.map((x) => keccak256(x));
// const badTree = new MerkleTree(badLeaves, keccak256);
// const badLeaf = keccak256("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835c69");
// const badProof = badTree.getProof(badLeaf);
// console.log(badTree.verify(badProof, badLeaf, root)); // false
// console.log(tree.toString());
console.log("0x" + tree.getRoot().toString("hex"));

const buf2hex = (x) => "0x" + x.toString("hex");
const AddressProof = tree.getProof(leaf).map((x) => buf2hex(x.data));
console.log(AddressProof);
