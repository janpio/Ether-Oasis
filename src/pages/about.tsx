import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const About = () => (
  <Main meta={<Meta title="About Ether Oasis" description="Lorem ipsum" />}>
    <p>
      Welcome to Ether Oasis, the web app that aims to provide users with a
      seamless way to view and manage their Ethereum wallets as a personalized
      profile on the Ethereum blockchain. Ether Oasis endeavors to simplify the
      complexities of cryptocurrencies, making it accessible to users of all
      levels of expertise.
    </p>
    <p>
      Ether Oasis offers a user-friendly interface that centralizes your
      Ethereum assets, including tokens and non-fungible tokens (NFTs). Through
      our app, users can effortlessly track their token balances, transaction
      history, and market values. Our primary focus is to present this
      information in a clear and intuitive manner, allowing you to easily
      navigate and understand your Ethereum profile.
    </p>
    <p>
      As Ether Oasis continues to evolve, our ambitions expand alongside it. We
      envision enhancing the app with advanced features and analytics tools that
      provide deeper insights into your on-chain activities. Our goal is to
      empower you to make informed decisions by offering valuable data and
      visualizations related to your Ethereum profile.
    </p>
    <p>
      Join Ether Oasis on this exciting journey as we strive to build a valuable
      resource for individuals looking to explore and leverage the potential of
      Ethereum. We are committed to listening to user feedback and incorporating
      the latest industry trends to ensure that Ether Oasis remains a trusted
      and comprehensive platform for managing and exploring your Ethereum
      profile.
    </p>

  </Main>
);

export default About;
