/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';

const MAINNET_RPC_URL = 'https://mainnet.infura.io/v3/<INFURA_KEY>';

const WalletButton = () => {
  const injected = injectedModule();

  const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: MAINNET_RPC_URL,
      },
    ],
  });

  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      console.log(wallets[0]);
      // create an ethers provider with the last connected wallet provider
      // if using ethers v6 this is:
      // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
      const ethersProvider = new ethers.BrowserProvider(
        wallets[0].provider,
        'any'
      );
      const signer = await ethersProvider.getSigner();
      console.log(signer);
      // send a transaction with the ethers provider
      // const txn = await signer.sendTransaction({
      //   to: '0x',
      //   value: 100000000000000
      // })
      // const receipt = await txn.wait()
      // console.log(receipt)
    }
  };

  return <button onClick={() => connectWallet()}>Connect Wallet</button>;
};

export default WalletButton;
