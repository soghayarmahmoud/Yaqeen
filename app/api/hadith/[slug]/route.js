import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const filePath = path.join(process.cwd(), 'data', 'hadith', `${slug}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const hadiths = JSON.parse(fileContents);
    return Response.json(hadiths);
  } catch (error) {
    return Response.json([]);
  }
}