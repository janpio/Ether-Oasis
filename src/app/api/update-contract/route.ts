/* eslint-disable no-console */
import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  // Save request body to a variable
  const body = await request.text();
  const { name, type, address } = JSON.parse(body);

  if (name && type) {
    try {
      const updatedContract = await prisma.contract.update({
        where: { address: address as string },
        data: { name, type },
      });

      return NextResponse.json({ contract: updatedContract });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Error updating contract' });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' });
  }
}

export async function GET() {
  try {
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

    return NextResponse.json({ contract });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching contract' });
  }
}
