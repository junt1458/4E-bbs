// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SERVER_URI } from '../../../utils/constants';

type Data = {
  name: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch(SERVER_URI + '/profile/icon?id=' + (req.query.id as string));
  const type = response.headers.get('Content-Type');
  const length = response.headers.get('Content-Length');
  if (type == null || length == null) {
    res.status(500).end();
    return;
  }

  res.writeHead(response.status, {
    'Content-Type': type,
    'Content-Length': length,
  });

  (await response.blob()).arrayBuffer().then((buf) => {
    res.end(Buffer.from(buf));
  });
};

export default handler;
