import type { Repo } from './page';

export default function Client({ repo }: { repo: Repo }) {
  return (
    <section>
      <h1 className="text-2xl font-semibold">{repo.name}</h1>
      <p>Next stars: {repo.stargazers_count}</p>
    </section>
  );
}
