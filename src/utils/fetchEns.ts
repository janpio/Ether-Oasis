import type { ethers } from 'ethers';

import { loadProvider } from './providers';

export const fetchEns = async (
  address: string,
  provider?: ethers.BrowserProvider | ethers.JsonRpcProvider
) => {
  const localProvider = provider || (await loadProvider('mainnet'));

  if (address && localProvider) {
    const localEnsName = await localProvider.lookupAddress(address);
    if (localEnsName) {
      const truncatedEns =
        localEnsName.substring(0, localEnsName.indexOf('.')).slice(0, 20) +
        localEnsName.substring(localEnsName.indexOf('.'));
      return truncatedEns;
    }
    return '';
  }
  return '';
};
