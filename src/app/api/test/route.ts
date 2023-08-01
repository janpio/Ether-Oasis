// import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await res.json();

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const res = await request.json();
  return NextResponse.json({ res });
}

// export async function GET(

// ) {
//   // eslint-disable-next-line no-console
//   console.log('hello from api/test/route.ts', req);
//   res.status(200).json({ message: 'Hello from Next.js!' });
// }
