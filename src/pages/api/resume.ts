import { filterRequestedLanguageApi } from '@lib/filterRequestedLanguageApi';

import { isUndefined } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';

export default Handler;

const resumeUrlMapByLanguage: Record<string, string> = {
  en: String(process.env.RESUME_URL_EN),
  pt: String(process.env.RESUME_URL_PT),
};

const resumeNameMapByLanguage: Record<string, string> = {
  en: "Ruan's Resume",
  pt: 'Currículo do Ruan',
};

async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const langFromQuery = req.query.lang;
  const { lang } = filterRequestedLanguageApi(
    req,
    Object.keys(resumeUrlMapByLanguage),
  );

  const bestLanguage = isUndefined(langFromQuery)
    ? lang
    : String(langFromQuery);

  try {
    const fetchedData = await fetch(resumeUrlMapByLanguage[bestLanguage]);
    const buffer = await fetchedData.arrayBuffer();
    const file = Buffer.from(buffer);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${resumeNameMapByLanguage[bestLanguage]}.pdf"`,
    );
    res.setHeader('Content-Type', 'application/pdf;charset=utf-8');
    res.setHeader('Content-Language', bestLanguage);
    res.status(200).send(file);
    return;
  } catch (err) {
    console.error({
      where: '/api/resume',
      error: err,
    });
    res //
      .setHeader('Cache-Control', 'no-cache')
      .status(502)
      .end();
    return;
  }
}
