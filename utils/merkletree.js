const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const leaves = ["a", "b", "c"].map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256);
const root = tree.getRoot().toString("hex");
const leaf = keccak256("a");
const proof = tree.getProof(leaf);
console.log(tree.verify(proof, leaf, root)); // true

const badLeaves = ["a", "x", "c"].map((x) => keccak256(x));
const badTree = new MerkleTree(badLeaves, keccak256);
const badLeaf = keccak256("x");
const badProof = badTree.getProof(badLeaf);
console.log(badTree.verify(badProof, badLeaf, root)); // false
console.log(tree.toString());
