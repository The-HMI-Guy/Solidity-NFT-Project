// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract RockPaperScissors is ERC721AQueryable, Ownable, ReentrancyGuard {
  using Strings for uint256;

  // =============================================================
  //                          CONSTANTS
  // =============================================================
  uint public constant MAX_SUPPLY = 777;

  // =============================================================
  //                          VARIABLES
  // =============================================================
  uint256 public immutable maxMintAmountPerTx;
  bytes32 public immutable merkleRoot;

  uint public price;
  uint public wlPrice;

  bool public paused = true;
  bool public whitelistMintEnabled = false;
  bool public revealed = false;

  mapping(address => uint) public whitelistClaimed;

  // =============================================================
  //                          METADATA
  // =============================================================
  string public uriPrefix = "";
  string public uriSuffix = ".json";
  string public hiddenMetadataUri;

  // =============================================================
  //                          CONSTRUCTOR
  // =============================================================
  constructor(
    uint256 _maxMintAmountPerTx,
    uint _price,
    uint _wlprice,
    string memory _hiddenMetadataUri,
    bytes32 _merkleRoot
  ) ERC721A("RockPaperScissors", "RPS") {
    maxMintAmountPerTx = _maxMintAmountPerTx;
    setPrice(_price);
    setWLPrice(_wlprice);
    setHiddenMetadataUri(_hiddenMetadataUri);
    merkleRoot = _merkleRoot;
  }

  // =============================================================
  //                          INTERNAL MODIFIERS
  // =============================================================

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
    require(
      _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
      "Invalid mint amount!"
    );
    require(totalSupply() + _mintAmount <= MAX_SUPPLY, "Max supply exceeded!");
    _;
  }

  modifier mintPriceCompliance(uint256 _mintAmount) {
    require(msg.value >= price * _mintAmount, "Insufficient funds!");
    _;
  }

  // =============================================================
  //                          INTERNAL MINT LOGIC
  // =============================================================

  function mint(
    uint256 _mintAmount
  )
    public
    payable
    callerIsUser
    mintCompliance(_mintAmount)
    mintPriceCompliance(_mintAmount)
  {
    require(!paused, "The contract is paused!");

    _safeMint(msg.sender, _mintAmount);
  }

  function whitelistMint(
    uint256 _mintAmount,
    bytes32[] calldata _merkleProof
  )
    public
    payable
    callerIsUser
    mintCompliance(_mintAmount)
    mintPriceCompliance(_mintAmount)
  {
    require(whitelistMintEnabled, "The whitelist sale is not enabled!");
    require(whitelistClaimed[msg.sender] < 2, "Address already claimed!");
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(
      MerkleProof.verify(_merkleProof, merkleRoot, leaf),
      "Invalid proof!"
    );

    whitelistClaimed[msg.sender] += _mintAmount;
    _safeMint(msg.sender, _mintAmount);
  }

  function airdrop(
    address wallet,
    uint256 amount
  ) external onlyOwner callerIsUser {
    require(totalSupply() + amount < MAX_SUPPLY + 1, "Exceed max supply!");

    _safeMint(wallet, amount);
  }

  // =============================================================
  //                    ADDRESS DATA OPERATIONS
  // =============================================================

  function withdrawMoney() external onlyOwner nonReentrant {
    (bool success, ) = msg.sender.call{ value: address(this).balance }("");
    require(success, "Transfer failed.");
  }

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  function _startTokenId() internal view virtual override returns (uint256) {
    return 1;
  }

  function tokenURI(
    uint256 _tokenId
  ) public view virtual override(ERC721A, IERC721A) returns (string memory) {
    require(
      _exists(_tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    if (revealed == false) {
      return hiddenMetadataUri;
    }

    string memory currentBaseURI = _baseURI();
    return
      bytes(currentBaseURI).length > 0
        ? string(
          abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix)
        )
        : "";
  }

  function setPrice(uint _price) public onlyOwner {
    price = _price;
  }

  function setWLPrice(uint _wlprice) public onlyOwner {
    wlPrice = _wlprice;
  }

  function setPaused(bool _state) public onlyOwner {
    paused = _state;
  }

  function setWhitelistMintEnabled(bool _state) public onlyOwner {
    whitelistMintEnabled = _state;
  }

  function setRevealed(bool _state) public onlyOwner {
    revealed = _state;
  }

  function setHiddenMetadataUri(
    string memory _hiddenMetadataUri
  ) public onlyOwner {
    hiddenMetadataUri = _hiddenMetadataUri;
  }

  function setUriPrefix(string memory _uriPrefix) public onlyOwner {
    uriPrefix = _uriPrefix;
  }

  function setUriSuffix(string memory _uriSuffix) public onlyOwner {
    uriSuffix = _uriSuffix;
  }
}
