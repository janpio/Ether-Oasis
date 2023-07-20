/* eslint-disable lines-around-directive */
/* eslint-disable react/button-has-type */
import Counter from './counter';

function MyServerComponent() {
  return <p>This is a server component. It was rendered on the server.</p>;
}

export default function Page() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Client Page</h1>
      <Counter>
        <MyServerComponent />
      </Counter>
    </section>
  );
}
