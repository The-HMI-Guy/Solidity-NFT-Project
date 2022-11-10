const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

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
      3,
      "test",
      ethers.BigNumber.from(
        "0xa36a3ef86d1afc6e7ae3987f8627343221bef8208cdcd5ae20febccf38500f0f"
      )
    );
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rockPaperScissorsContract.owner()).to.equal(owner.address);
    });
  });
  //Testing set functions.
  describe("setCost", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = 25;

      await expect(
        rockPaperScissorsContract.connect(addr1).setCost(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set price by owner", async function () {
      const expectedValue = 25;

      await rockPaperScissorsContract.connect(owner).setCost(expectedValue);
      expect(await rockPaperScissorsContract.price()).to.equal(expectedValue);
    });
  });
  describe("setWLPrice", function () {
    it("Should be reverted because the caller is not owner", async function () {
      const expectedValue = 25;

      await expect(
        rockPaperScissorsContract.connect(addr1).setWLPrice(expectedValue)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should set whitelist price by owner", async function () {
      const expectedValue = 25;

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
