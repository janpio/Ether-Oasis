import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Ether Oasis"
          description="Like your AOL homepage, but for Ethereum."
        />
      }
    >
      <div className="flex w-full flex-col items-start justify-start">
        <h1 className="text-left text-3xl font-bold text-gray-900">
          Welcome to Ether Oasis!
        </h1>
      </div>
    </Main>
  );
};

export default Index;
