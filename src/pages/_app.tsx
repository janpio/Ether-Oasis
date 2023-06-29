/* eslint-disable import/no-extraneous-dependencies */
import '@fontsource/open-sans'; // Import Open Sans font
import '@fontsource/lato'; // Import Lato font
import '../styles/global.css';
import '../styles/main.css';
import 'react-loading-skeleton/dist/skeleton.css';

import type { AppProps } from 'next/app';
import { SkeletonTheme } from 'react-loading-skeleton';

import { GlobalContextProvider } from '@/context/GlobalContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <GlobalContextProvider>
    <SkeletonTheme baseColor="#283146" highlightColor="#bee3f8">
      <Component {...pageProps} />
    </SkeletonTheme>
  </GlobalContextProvider>
);

export default MyApp;
