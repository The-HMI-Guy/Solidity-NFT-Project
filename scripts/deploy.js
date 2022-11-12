const hre = require("hardhat");

async function main() {
  // Get the contract to deploy and deploy.
  const RockPaperScissors = await hre.ethers.getContractFactory(
    "RockPaperScissors"
  );
  const rockPaperScissorsContract = await RockPaperScissors.deploy(
    5,
    ethers.BigNumber.from("1000000000000000000"), //1ETH
    ethers.BigNumber.from("1000000000000000000"), //1ETH
    "ipfs://QmZD66sq4Em1xQKSchg45q2AtTf8qts5LZMPx3kCqPYpQg/hidden.png",
    ethers.BigNumber.from(
      "0x04c8b7dc04c57c4e8e83fff68c0e603c2871484788a158e8c63854ecd5d256ee"
    )
  );
  await rockPaperScissorsContract.deployed();
  console.log(
    "RockPaperScissors deployed to ",
    rockPaperScissorsContract.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
