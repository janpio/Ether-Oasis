/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
// ContractDetailsForm.tsx

'use client';

import { useState } from 'react';

export default function ContractDetailsForm({ passedContract }: any) {
  const [contract, setContract] = useState(passedContract);
  const [name, setName] = useState(contract.name || '');
  const [type, setType] = useState(contract.type || '');

  const submitForm = async () => {
    try {
      const response = await fetch(`/api/update-contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, address: contract.address }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json(); // Parse the response JSON data

      console.log('response data:', data);
      return data; // Return the parsed data
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const getNewContractToUpdate = async () => {
    try {
      const response = await fetch(`/api/update-contract`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json(); // Parse the response JSON data

      console.log('response data:', data);
      return data; // Return the parsed data
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = await submitForm();
    if (form && form.contract) {
      console.log('Contract updated');
      const newContract = await getNewContractToUpdate();
      setContract(newContract.contract);
      setName('');
      setType('');
    } else {
      console.log('Error updating contract');
    }
  };

  return (
    <section>
      <h2>{contract.address}</h2>
      <a
        href={`https://etherscan.io/address/${contract.address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on Etherscan
      </a>
      <form
        className="flex w-full flex-col items-start justify-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex w-3/5 flex-col items-start justify-center">
          <label className="mb-2 block font-bold">Name:</label>
          <input
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-5 flex w-3/5 flex-col items-start justify-center">
          <label>Type:</label>
          <input
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            name="type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <button
          className="mt-4 rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
          type="submit"
          onClick={() => submitForm()}
        >
          Update
        </button>
      </form>
    </section>
  );
}
