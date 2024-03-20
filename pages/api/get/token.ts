// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'

type Data = {
  is_auth: boolean;
  token?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const cookies = new Cookies(req, res);
  const token = cookies.get('token');
  if (token && token !== 'undefined' && token.length >= 1) {
    res.status(200).json({ is_auth: true, token });
  } else {
    res.status(200).json({ is_auth: false });
  }
}
