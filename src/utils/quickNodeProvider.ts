/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';

const QUICKNODE_RPC_URL = process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL;

export const quickNodeProvider = new ethers.JsonRpcProvider(QUICKNODE_RPC_URL);
