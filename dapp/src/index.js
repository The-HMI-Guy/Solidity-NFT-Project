import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

//const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_KEY

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({ apiKey: "C-OuQm9rwjEdE-tuVodh8xmicBtZ3hXI" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RPS App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
