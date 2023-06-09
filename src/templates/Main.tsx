import Link from 'next/link';
import type { ReactNode } from 'react';

import WalletButton from '@/components/WalletButton';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full px-1 text-gray-700 antialiased">
    {props.meta}

    <div className="mx-auto max-w-screen-md">
      <header className="border-b border-gray-300">
        <div className="flex w-full items-center pb-8 pt-16">
          <Link href="/" className="no-underline hover:no-underline">
            <img
              src="/assets/images/ether-oasis-full-icon.png"
              alt="Nextjs starter banner"
              className="logo no-underline hover:no-underline"
            />
          </Link>
          <div className="ml-4 flex flex-col items-start justify-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {AppConfig.title}
            </h1>
            <h2 className="text-xl">{AppConfig.description}</h2>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="content py-5 text-xl">{props.children}</main>

      <footer className="border-t border-gray-300 py-8 text-center text-sm">
        © Copyright {new Date().getFullYear()}{' '}
        <Link href="/about" className="underline">
          {AppConfig.title}
        </Link>
        . Made with ❤️
      </footer>
    </div>
  </div>
);

export { Main };
