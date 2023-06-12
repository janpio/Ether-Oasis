import '../styles/global.css';
import '../styles/main.css';

import type { AppProps } from 'next/app';

import { GlobalContextProvider } from '@/context/GlobalContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <GlobalContextProvider>
    <Component {...pageProps} />
  </GlobalContextProvider>
);

export default MyApp;
