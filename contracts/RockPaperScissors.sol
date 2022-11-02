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

  uint256 public immutable maxMintPerAddress;
  uint256 public immutable amountForDevs;

  mapping(address => uint256) public allowlist;
bytes32 public merkleRoot;
mapping(address => bool) public whitelistClaimed;
//add mint price variable

  constructor(
    uint256 maxBatchSize_,
    uint256 collectionSize_,
    uint256 amountForDevs_
  ) ERC721A("RockPaperScissors", "RPS", maxBatchSize_, collectionSize_) {
    maxMintPerAddress = maxBatchSize_;
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
function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable {
    // Verify whitelist requirements
    //require(whitelistMintEnabled, 'The whitelist sale is not enabled!');
    //require(!whitelistClaimed[_msgSender()], 'Address already claimed!');
    bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
    require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), 'Invalid proof!');

    whitelistClaimed[_msgSender()] = true;
    _safeMint(_msgSender(), _mintAmount);
  }
  function allowlistMint() external payable callerIsUser {
   // uint256 price = uint256(saleConfig.mintlistPrice); update with mintprice
    require(price != 0, "allowlist sale has not begun yet");
    require(allowlist[msg.sender] > 0, "not eligible for allowlist mint");
    require(totalSupply() + 1 <= collectionSize, "reached max supply");
    allowlist[msg.sender]--;
    _safeMint(msg.sender, 1);
    refundIfOver(price);
  }

  function publicSaleMint(uint256 quantity, uint256 callerPublicSaleKey) external payable callerIsUser{
    SaleConfig memory config = saleConfig;
    uint256 publicSaleKey = uint256(config.publicSaleKey);
    uint256 publicPrice = uint256(config.publicPrice);
    uint256 publicSaleStartTime = uint256(config.publicSaleStartTime);
    require(
      publicSaleKey == callerPublicSaleKey,
      "called with incorrect public sale key"
    );

    require(
      isPublicSaleOn(publicPrice, publicSaleKey, publicSaleStartTime),
      "public sale has not begun yet"
    );
    require(totalSupply() + quantity <= collectionSize, "reached max supply");
    require(
      numberMinted(msg.sender) + quantity <= maxPerAddressDuringMint,
      "can not mint this many"
    );
    _safeMint(msg.sender, quantity);
    refundIfOver(publicPrice * quantity);
  }

  function refundIfOver(uint256 price) private {
    require(msg.value >= price, "Need to send more ETH.");
    if (msg.value > price) {
      payable(msg.sender).transfer(msg.value - price);
    }
  }
  //Done - maybe change numSlots name?
  //pass the array of addresses with the number of mints for the holder.
  //assuming this should be equal for each holder. 
  function seedAllowlist(address[] memory addresses, uint256[] memory numSlots)
    external
    onlyOwner
  {
    require(
      addresses.length == numSlots.length,
      "addresses does not match numSlots length"
    );
    //pass the address array to the allowlist mapping, which is indexed by the for loop.
    //during each iteration, the integer(numSlots) is set to the key (address).
    for (uint256 i = 0; i < addresses.length; i++) {
      allowlist[addresses[i]] = numSlots[i];
    }
  }

  // For marketing etc.
  function devMint(uint256 quantity) external onlyOwner {
    require(
      totalSupply() + quantity <= amountForDevs,
      "too many already minted before dev mint"
    );
    require(
      quantity % maxBatchSize == 0,
      "can only mint a multiple of the maxBatchSize"
    );
    uint256 numChunks = quantity / maxBatchSize;
    for (uint256 i = 0; i < numChunks; i++) {
      _safeMint(msg.sender, maxBatchSize);
    }
  }

  // // metadata URI
  string private _baseTokenURI;

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
  }

  function withdrawMoney() external onlyOwner nonReentrant {
    (bool success, ) = msg.sender.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }

  function setOwnersExplicit(uint256 quantity) external onlyOwner nonReentrant {
    _setOwnersExplicit(quantity);
  }

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  function getOwnershipData(uint256 tokenId)
    external
    view
    returns (TokenOwnership memory)
  {
    return ownershipOf(tokenId);
  }
}
//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
