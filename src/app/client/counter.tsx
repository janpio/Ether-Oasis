/* eslint-disable lines-around-directive */
/* eslint-disable react/button-has-type */
'use client';
import { useState } from 'react';

export default function Counter({
  children,
}: {
  children?: React.ReactNode | React.ReactElement;
}): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <section>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => setCount(count + 1)}
      >
        Incriment
      </button>
      <p className="mt-4 text-gray-700">Count: {count}</p>
      {children}
    </section>
  );
}
