/* eslint-disable import/extensions */
import ContractDetailsForm from '@/components/ContractDetailsForm';

import prisma from '../../../lib/prisma';

export default async function ContractFiller() {
  const contract = await prisma.contract.findFirst({
    where: {
      AND: [
        { address: { not: undefined } },
        { abi: { not: undefined } },
        {
          OR: [{ name: { equals: null } }, { type: { equals: null } }],
        },
      ],
    },
  });

  if (!contract) return <p>No contracts need updating</p>;

  return (
    <div className="w-full">
      <ContractDetailsForm passedContract={contract} />
    </div>
  );
}
