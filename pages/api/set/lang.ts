// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('NEXT_LOCALE', req.body.lang, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'production',
      maxAge: 60 * 60,
      // sameSite: `strict`,
      path: '/',
    })
  );
  res.status(200).json({ status: true });
}
