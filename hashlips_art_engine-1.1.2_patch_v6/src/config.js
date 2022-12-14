const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "RockPaperScissors";
const description = "A classic game - Rock, Paper, Scissors!";
const baseUri = "ipfs://QmX99ZSv1oaRGz1B6gh9R3KkgknPyrrPuGV9H2abMTzCEy";

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 777,
    layersOrder: [
      { name: "Background" },
      { name: "ScissorsPaperRock" },
      { name: "Eyes" },
      { name: "Moustache" },
      { name: "Mouth" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 1000,
  height: 1000,
  smoothing: false,
};

const gif = {
  export: true,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 4 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {
  seller_fee_basis_points: 300, // this defines your royalties (250 = 2.5% || 1000 = 10% || etc)
  collection: {
    name: "ScissorsPaperRock", // the name of your collection
    family: "ScissorsPaperRock Gen1", //the family of your collection
  },
  properties: {
    files: [
      {
        uri: "image.png",
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: "0x701C462BF86DBc2bd0C3e77C9a53De38B9A984eD", // the address you want to receive your payments
        share: 100,
      },
    ],
  },
};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  gif,
  preview_gif,
};
