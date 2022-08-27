import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export default Handler;

async function Handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fetchedData = await fetch(process.env.SELFIE_URL as string);
    const arrayBuffer = await fetchedData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = await sharp(buffer).png({ quality: 100 }).toBuffer();
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', `inline; filename="ruan_moreira.png"`);
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(file);
    return;
  } catch (err) {
    console.error({
      where: '/api/selfie',
      error: err,
    });
    res //
      .setHeader('Cache-Control', 'no-cache')
      .status(502)
      .end();
    return;
  }
}
