/* eslint-disable import/no-extraneous-dependencies */
import '@fontsource/open-sans'; // Import Open Sans font
import '@fontsource/lato'; // Import Lato font
import '../styles/global.css';
import '../styles/main.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Link from 'next/link';

import WalletButton from '@/components/WalletButton';
import { GlobalContextProvider } from '@/context/GlobalContext';
import { AppConfig } from '@/utils/AppConfig';

export const metadata = {
  title: AppConfig.title,
  description: AppConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={AppConfig.locale}>
      <GlobalContextProvider>
        <body>
          <div className="w-full px-1 text-gray-700 antialiased">
            <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-start">
              <header className="w-full border-b border-blue-200">
                <div className="flex w-full items-center justify-between pb-8 pt-16">
                  <div className="flex items-center justify-start">
                    <Link href="/" className="no-underline hover:no-underline">
                      <img
                        src="/assets/images/ether-oasis-icon.png"
                        alt="Ether Oasis Logo"
                        className="logo no-underline hover:no-underline"
                      />
                    </Link>
                    <div className="ml-4 flex flex-col items-start justify-center">
                      <h1 className="text-3xl font-bold">{AppConfig.title}</h1>
                      <h2 className="text-xl">{AppConfig.description}</h2>
                    </div>
                  </div>
                  <WalletButton />
                </div>
              </header>

              <main className="content w-full max-w-screen-lg py-5 text-xl">
                {children}
              </main>

              <footer className="border-t border-blue-200 py-8 text-center text-sm">
                © Copyright {new Date().getFullYear()}{' '}
                <Link href="/about" className="underline">
                  {AppConfig.title}
                </Link>
                . Made with ❤️
              </footer>
            </div>
          </div>
        </body>
      </GlobalContextProvider>
    </html>
  );
}
