import Client from './client';

export type Repo = {
  name: string;
  stargazers_count: number;
};

async function getServerSideProps(): Promise<Repo> {
  const res = await fetch('https://api.github.com/repos/vercel/next.js', {
    cache: 'no-store',
  });
  const json = await res.json();
  return json;
}

export default async function Page() {
  const repo = await getServerSideProps();
  return <Client repo={repo} />;
}
