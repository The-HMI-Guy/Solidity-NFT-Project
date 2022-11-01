// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import 'erc721a/contracts/ERC721A.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import "hardhat/console.sol";

contract RockPaperScissors is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

  uint256 public immutable maxPerAddressDuringMint;
  uint256 public immutable amountForDevs;


  string public hiddenMetadataUri;

  constructor(
    uint256 maxBatchSize_,
    uint256 collectionSize_,
    uint256 amountForDevs_
  ) ERC721A("RockPaperScissors", "RPS", maxBatchSize_, collectionSize_) {
    maxPerAddressDuringMint = maxBatchSize_;
    amountForDevs = amountForDevs_;
  }
    /**
     * @dev Ensure a Smart Contract is not interfacing with this contract.
     * msg.sender can either be an account address or smart contract address, while
     * tx.origin will always be the account/wallet address.
     */
  modifier callerIsUser() {
    require(tx.origin == msg.sender, "The caller is another contract");
    _;
  }

    function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
    hiddenMetadataUri = _hiddenMetadataUri;
  }

}
