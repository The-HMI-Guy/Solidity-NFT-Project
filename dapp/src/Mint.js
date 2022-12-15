import { useContractRead, useContractWrite, useAccount } from "wagmi";
import contractInterface from "./abi/abi.json";
import { useEffect, useState } from 'react';
import { ethers } from "ethers";


const Mint = () => {
  const { address } = useAccount();
  const CONTRACT_ADDRESS = '0x58a56731d3177eec6e395b4397c00f6e1a1436a8';
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractInterface,
  };

  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const [mintLoading, setMintLoading] = useState(false);

  const onMintClick = async () => {
    try {
      const tx = await mint({
        args: [
          address,
          {
            value: ethers.utils.parseEther('0.001'),
          },
        ],
      });
      const receipt = await tx.wait();
      console.log({ receipt });
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  }


  return (
    <div>
      <h1>Mint</h1>
      <button>Mint!</button>
    </div>
  );
};

export default Mint;
