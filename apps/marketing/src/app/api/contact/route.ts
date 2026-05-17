import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  school: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const dir = join(process.cwd(), '.data', 'contacts');
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, `contact_${Date.now()}.json`),
      JSON.stringify({ ...data, createdAt: new Date().toISOString() }, null, 2)
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
