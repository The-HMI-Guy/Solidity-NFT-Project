// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9 <0.9.0;

import 'erc721a/contracts/extensions/ERC721AQueryable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract RockPaperScissors is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;
    /*//////////////////////////////////////////////////////////////
                           VARIABLES
    //////////////////////////////////////////////////////////////*/
    uint256 public immutable maxMintAmountPerTx;
    bytes32 public immutable merkleRoot;

    uint256 public cost;

    string public uriPrefix = "";
    string public uriSuffix = ".json";
    string public hiddenMetadataUri;
    string private _baseTokenURI;

    bool public paused = true;
    bool public whitelistMintEnabled = false;
    bool public revealed = false;

    mapping(address => uint256) public allowlist;
    mapping(address => bool) public whitelistClaimed;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(
        uint256 maxMintAmountPerTx_,
        uint256 collectionSize_,
        uint256 cost_,
        string memory hiddenMetadataUri_,
        bytes32 merkleRoot_
    )
        ERC721A(
            "RockPaperScissors",
            "RPS",
            maxMintAmountPerTx_,
            collectionSize_
        )
    {
        maxMintAmountPerTx = maxMintAmountPerTx_;
        setCost(cost_);
        setHiddenMetadataUri(hiddenMetadataUri_);
        merkleRoot = merkleRoot_;
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL MODIFIERS
    //////////////////////////////////////////////////////////////*/
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
        require(
            totalSupply() + _mintAmount <= collectionSize,
            "Max supply exceeded!"
        );
        _;
    }

    modifier mintPriceCompliance(uint256 _mintAmount) {
        require(msg.value >= cost * _mintAmount, "Insufficient funds!");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL MINT LOGIC
    //////////////////////////////////////////////////////////////*/
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

        _safeMint(_msgSender(), _mintAmount);
    }

    function whitelistMint(
        uint256 _mintAmount,
        bytes32[] calldata _merkleProof
    ) public payable {
        // Verify whitelist requirements
        require(whitelistMintEnabled, "The whitelist sale is not enabled!");
        require(!whitelistClaimed[_msgSender()], "Address already claimed!");
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof!"
        );

        whitelistClaimed[_msgSender()] = true;
        _safeMint(_msgSender(), _mintAmount);
    }

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
    function seedAllowlist(
        address[] memory addresses,
        uint256[] memory numSlots
    ) external onlyOwner {
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

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function withdrawMoney() external onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
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
    ) public view virtual override returns (string memory) {
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
                    abi.encodePacked(
                        currentBaseURI,
                        _tokenId.toString(),
                        uriSuffix
                    )
                )
                : "";
    }

    function getOwnershipData(
        uint256 tokenId
    ) external view returns (TokenOwnership memory) {
        return ownershipOf(tokenId);
    }

    function setOwnersExplicit(
        uint256 quantity
    ) external onlyOwner nonReentrant {
        _setOwnersExplicit(quantity);
    }

    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
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

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setUriPrefix(string memory _uriPrefix) public onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }
}
//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"],["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
