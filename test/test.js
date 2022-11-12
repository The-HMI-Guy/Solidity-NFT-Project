const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

// =============================================================
//                          SMART CONTRACT - UNIT TESTING
// =============================================================
describe("RPS - Unit Testing", function () {
  let RockPaperScissors,
    rockPaperScissorsContract,
    owner,
    addr1,
    addr2,
    addr3,
    addrs;
  this.beforeEach(async function () {
    RockPaperScissors = await ethers.getContractFactory("RockPaperScissors");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    rockPaperScissorsContract = await RockPaperScissors.deploy(
      5,
      ethers.BigNumber.from("1000000000000000000"), //1ETH
      ethers.BigNumber.from("1000000000000000000"), //1ETH
      "ipfs://QmZD66sq4Em1xQKSchg45q2AtTf8qts5LZMPx3kCqPYpQg/hidden.png",
      ethers.BigNumber.from(
        "0x04c8b7dc04c57c4e8e83fff68c0e603c2871484788a158e8c63854ecd5d256ee"
      )
    );
  });
  // =============================================================
  //                          DEPLOY
  // =============================================================
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rockPaperScissorsContract.owner()).to.equal(owner.address);
    });
  });
  // =============================================================
  //                          MINT
  // =============================================================
  describe("mint", function () {
    it("Should revert because _mintAmount is 0", async function () {
      await rockPaperScissorsContract.connect(owner).setPaused(false);
      expect(await rockPaperScissorsContract.paused()).to.equal(false);
      const expectedValue = 0;
      const overrides = {
        value: ethers.utils.parseEther("0.1"),
      };

      await expect(
        rockPaperScissorsContract.connect(owner).mint(expectedValue, overrides)
      ).to.be.revertedWith("Invalid mint amount!");
    });
    it("Should revert because insufficient funds were sent", async function () {
      await rockPaperScissorsContract.connect(owner).setPaused(false);
      expect(await rockPaperScissorsContract.paused()).to.equal(false);
      const expectedValue = 1;
      const overrides = {
        value: ethers.utils.parseEther("0.1"),
      };

      await expect(
        rockPaperScissorsContract.connect(owner).mint(expectedValue, overrides)
      ).to.be.revertedWith("Insufficient funds!");
    });
    it("Should revert because contract is paused", async function () {
      const expectedValue = 1;
      const overrides = {
        value: ethers.utils.parseEther("5"),
      };

      await expect(
        rockPaperScissorsContract.connect(owner).mint(expectedValue, overrides)
      ).to.be.revertedWith("The contract is paused!");
    });
    it("Should mint x tokens", async function () {
      await rockPaperScissorsContract.connect(owner).setPaused(false);
      expect(await rockPaperScissorsContract.paused()).to.equal(false);
      const expectedValue = 1;
      const overrides = {
        value: ethers.utils.parseEther("5"),
      };

      await rockPaperScissorsContract
        .connect(owner)
        .mint(expectedValue, overrides);
    });
  });
  // =============================================================
  //                          WHITELIST
  // =============================================================
  describe("whitelist", function () {
    it("Should revert because _mintAmount is 0", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(true);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        true
      );

      const expectedValue = 0;
      const overrides = {
        value: ethers.utils.parseEther("0.1"),
      };

      const proof = [
        "0xe5c951f74bc89efa166514ac99d872f6b7a3c11aff63f51246c3742dfa925c9b",
        "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
        "0xc445abb61a1483dd60e8bba398dcc2dfac824270a1d4e8d2260b6712c9dfc12a",
      ];

      await expect(
        rockPaperScissorsContract
          .connect(owner)
          .whitelistMint(expectedValue, proof, overrides)
      ).to.be.revertedWith("Invalid mint amount!");
    });
    it("Should revert because insufficient funds were sent", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(true);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        true
      );

      const expectedValue = 2;
      const overrides = {
        value: ethers.utils.parseEther("0.1"),
      };

      const proof = [
        "0xe5c951f74bc89efa166514ac99d872f6b7a3c11aff63f51246c3742dfa925c9b",
        "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
        "0xc445abb61a1483dd60e8bba398dcc2dfac824270a1d4e8d2260b6712c9dfc12a",
      ];

      await expect(
        rockPaperScissorsContract
          .connect(owner)
          .whitelistMint(expectedValue, proof, overrides)
      ).to.be.revertedWith("Insufficient funds!");
    });
    it("Should revert if whitelist is not enabled", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(false);
      expect(await rockPaperScissorsContract.whitelistMintEnabled())
        .to.equal(false)
        .to.be.revertedWith("The whitelist sale is not enabled!");
    });
    it("Should revert if claimer mints more than 2 tokens", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(true);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        true
      );
      const expectedValue = 1;
      const proof = [
        "0xe5c951f74bc89efa166514ac99d872f6b7a3c11aff63f51246c3742dfa925c9b",
        "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
        "0xc445abb61a1483dd60e8bba398dcc2dfac824270a1d4e8d2260b6712c9dfc12a",
      ];

      const overrides = {
        value: ethers.utils.parseEther("5"),
      };
      //wl mint #1
      await rockPaperScissorsContract
        .connect(owner)
        .whitelistMint(expectedValue, proof, overrides);
      //wl mint #2
      await rockPaperScissorsContract
        .connect(owner)
        .whitelistMint(expectedValue, proof, overrides);
      //wl mint #3
      await expect(
        rockPaperScissorsContract
          .connect(owner)
          .whitelistMint(expectedValue, proof, overrides)
      ).to.be.revertedWith("Address already claimed!");
    });
    it("Should revert if proof is invalid", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(true);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        true
      );
      const expectedValue = 1;
      const proof = [
        "0xe5c951f74bc89efa166514ac99d872f6b7a3c11aff63f51246c3742dfa925c9b",
        "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
        "0xc445abb61a1483dd60e8bba398dcc2dfac824270a1d4e8d2260b6712c9dfc777",
      ];

      const overrides = {
        value: ethers.utils.parseEther("5"),
      };
      //wl mint #1
      await expect(
        rockPaperScissorsContract
          .connect(owner)
          .whitelistMint(expectedValue, proof, overrides)
      ).to.be.revertedWith("Invalid proof!");
    });
    it("Should mint up to 2 tokens", async function () {
      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(true);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        true
      );
      const expectedValue = 1;
      const proof = [
        "0xe5c951f74bc89efa166514ac99d872f6b7a3c11aff63f51246c3742dfa925c9b",
        "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
        "0xc445abb61a1483dd60e8bba398dcc2dfac824270a1d4e8d2260b6712c9dfc12a",
      ];

      const overrides = {
        value: ethers.utils.parseEther("5"),
      };
      //wl mint #1
      await rockPaperScissorsContract
        .connect(owner)
        .whitelistMint(expectedValue, proof, overrides);
      //wl mint #2
      await rockPaperScissorsContract
        .connect(owner)
        .whitelistMint(expectedValue, proof, overrides);
    });
  });
  // =============================================================
  //                          AIRDROP
  // =============================================================
  describe("airdrop", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = 2;

      await expect(
        rockPaperScissorsContract
          .connect(addr1)
          .airdrop("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should be reverted because amount exceeds max supply", async function () {
      const expectedValue = 800;

      await expect(
        rockPaperScissorsContract
          .connect(owner)
          .airdrop("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", expectedValue)
      ).to.be.revertedWith("Exceed max supply!");
    });
  });
  // =============================================================
  //                          SETTERS
  // =============================================================
  describe("setPrice", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = 25;

      await expect(
        rockPaperScissorsContract.connect(addr1).setPrice(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set price by owner", async function () {
      const expectedValue = 4;

      await rockPaperScissorsContract.connect(owner).setPrice(expectedValue);
      expect(await rockPaperScissorsContract.price()).to.equal(expectedValue);
    });
  });
  describe("setWLPrice", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = 4;

      await expect(
        rockPaperScissorsContract.connect(addr1).setWLPrice(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set whitelist price by owner", async function () {
      const expectedValue = 4;

      await rockPaperScissorsContract.connect(owner).setWLPrice(expectedValue);
      expect(await rockPaperScissorsContract.wlPrice()).to.equal(expectedValue);
    });
  });
  describe("setPaused", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = false;

      await expect(
        rockPaperScissorsContract.connect(addr1).setPaused(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set pause to false by owner and enable the contract", async function () {
      const expectedValue = false;

      await rockPaperScissorsContract.connect(owner).setPaused(expectedValue);
      expect(await rockPaperScissorsContract.paused()).to.equal(expectedValue);
    });
  });
  describe("setWhitelistMintEnabled", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = true;

      await expect(
        rockPaperScissorsContract
          .connect(addr1)
          .setWhitelistMintEnabled(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set whitelist mint to true by owner and enable the whitelist mint", async function () {
      const expectedValue = true;

      await rockPaperScissorsContract
        .connect(owner)
        .setWhitelistMintEnabled(expectedValue);
      expect(await rockPaperScissorsContract.whitelistMintEnabled()).to.equal(
        expectedValue
      );
    });
  });
  describe("setRevealed", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = true;

      await expect(
        rockPaperScissorsContract.connect(addr1).setRevealed(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set revealed to true by owner and enable metadata", async function () {
      const expectedValue = true;

      await rockPaperScissorsContract.connect(owner).setRevealed(expectedValue);
      expect(await rockPaperScissorsContract.revealed()).to.equal(
        expectedValue
      );
    });
  });
  describe("setHiddenMetadataUri", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue =
        "ipfs://QmZD66sq4Em1xQKSchg45q2AtTf8qts5LZMPx3kCqPYpQg/hidden.png";

      await expect(
        rockPaperScissorsContract
          .connect(addr1)
          .setHiddenMetadataUri(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set hidden metadata uri by owner", async function () {
      const expectedValue =
        "ipfs://QmZD66sq4Em1xQKSchg45q2AtTf8qts5LZMPx3kCqPYpQg/hidden.png";

      await rockPaperScissorsContract
        .connect(owner)
        .setHiddenMetadataUri(expectedValue);
      expect(await rockPaperScissorsContract.hiddenMetadataUri()).to.equal(
        expectedValue
      );
    });
  });
  describe("setUriPrefix", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue =
        "ipfs://QmWBPophECw4QxtNkFZGXzevGVRKQ5LZXTnpyTXTnqXFRg/";

      await expect(
        rockPaperScissorsContract.connect(addr1).setUriPrefix(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set uri prefix by owner", async function () {
      const expectedValue =
        "ipfs://QmWBPophECw4QxtNkFZGXzevGVRKQ5LZXTnpyTXTnqXFRg/";

      await rockPaperScissorsContract
        .connect(owner)
        .setUriPrefix(expectedValue);
      expect(await rockPaperScissorsContract.uriPrefix()).to.equal(
        expectedValue
      );
    });
  });
  describe("setUriSuffix", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = ".json";

      await expect(
        rockPaperScissorsContract.connect(addr1).setUriSuffix(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set uri suffix by owner", async function () {
      const expectedValue = ".json";
      await rockPaperScissorsContract
        .connect(owner)
        .setUriSuffix(expectedValue);
      expect(await rockPaperScissorsContract.uriSuffix()).to.equal(
        expectedValue
      );
    });
  });
});
