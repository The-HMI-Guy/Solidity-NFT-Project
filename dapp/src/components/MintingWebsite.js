import React from 'react';

function MintingWebsite() {
  return (
    <div class="nft-minting-container">
    <img src="" alt="NFT Example" id="nft-preview"/>
    <form id="nft-form" onsubmit="submitForm()">
        <label for="nft-title">Title:</label>
        <input type="text" id="nft-title" name="nft-title" required/>

        <label for="nft-description">Description:</label>
        <textarea id="nft-description" name="nft-description" rows="4" cols="50" required></textarea>

        <label for="nft-image">Image:</label>
        <input type="file" id="nft-image" name="nft-image" accept="image/*" onchange="previewImage()" required/>

        <input type="submit" value="Mint NFT"/>
    </form>
</div>

  );
}

export default MintingWebsite;
