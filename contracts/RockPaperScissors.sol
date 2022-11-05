// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract RockPaperScissors is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

  uint256 public immutable maxMintAmountPerTx;
  
  uint256 public cost;

  string public uriPrefix = '';
  string public uriSuffix = '.json';
  string public hiddenMetadataUri;

  bool public paused = true;
  bool public whitelistMintEnabled = false;
  bool public revealed = false;

 mapping(address => uint256) public allowlist;
// bytes32 public merkleRoot;
// mapping(address => bool) public whitelistClaimed;


  constructor(
    uint256 maxMintAmountPerTx_,
    uint256 collectionSize_,
    uint256 cost_,
    string memory hiddenMetadataUri_
  ) ERC721A("RockPaperScissors", "RPS", maxMintAmountPerTx_, collectionSize_) {
    maxMintAmountPerTx = maxMintAmountPerTx_;
    setCost(cost_);
    setHiddenMetadataUri(hiddenMetadataUri_);
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
  modifier mintCompliance(uint256 _mintAmount) {
    require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'Invalid mint amount!');
    require(totalSupply() + _mintAmount <= collectionSize, 'Max supply exceeded!');
    _;
  }

  modifier mintPriceCompliance(uint256 _mintAmount) {
    require(msg.value >= cost * _mintAmount, 'Insufficient funds!');
    _;
  }
    function mint(uint256 _mintAmount) public payable callerIsUser mintCompliance(_mintAmount) mintPriceCompliance(_mintAmount){
    require(!paused, 'The contract is paused!');

    _safeMint(_msgSender(), _mintAmount);
  }
// function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof) public payable {
//     // Verify whitelist requirements
//     //require(whitelistMintEnabled, 'The whitelist sale is not enabled!');
//     //require(!whitelistClaimed[_msgSender()], 'Address already claimed!');
//     bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
//     require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), 'Invalid proof!');

//     whitelistClaimed[_msgSender()] = true;
//     _safeMint(_msgSender(), _mintAmount);
//   }
  function allowlistMint() external payable callerIsUser {
    require(allowlist[msg.sender] > 0, "not eligible for allowlist mint");
    require(totalSupply() + 1 <= collectionSize, "reached max supply");
    allowlist[msg.sender]--;
    _safeMint(msg.sender, 1);
    refundIfOver(cost);
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
  function seedAllowlist(address[] memory addresses, uint256[] memory numSlots) external onlyOwner {
    require(addresses.length == numSlots.length, "addresses does not match numSlots length" );
    //pass the address array to the allowlist mapping, which is indexed by the for loop.
    //during each iteration, the integer(numSlots) is set to the key (address).
    for (uint256 i = 0; i < addresses.length; i++) {
      allowlist[addresses[i]] = numSlots[i];
    }
  }

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
    function setCost(uint256 _cost) public onlyOwner {
    cost = _cost;
  }
    function setPaused(bool _state) public onlyOwner {
    paused = _state;
  }
    function setHiddenMetadataUri(string memory _hiddenMetadataUri) public onlyOwner {
    hiddenMetadataUri = _hiddenMetadataUri;
  }

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  function getOwnershipData(uint256 tokenId) external view returns (TokenOwnership memory) {
    return ownershipOf(tokenId);
  }
}
//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
