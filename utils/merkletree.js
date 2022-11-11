const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const addresses = require("./addresses.json");

const leaves = addresses.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sort: true });
const root = tree.getRoot().toString("hex");
const leaf = keccak256(addresses[18]);
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

//["0x978cc91d914c8ab8b2703515a2b31a631baf8f97ec7fada3a16966332fe9e35f","0x4272e2ae182ced741096687ea38e2ab630839aff4ec2907913f60528e463d544","0xd43466ea49ccf0f77dac4c55cf40e355d45997595a75da6d73e6b34bd78dc9c4","0xc0df65ac5169bfc4de5d55bfecc90c94e50357e4859b1cff702049ad330320c4","0xa22d2d4af6076ff70babd4ffc5035bdce39be98f440f86a0ddc202e3cd935a59"]
