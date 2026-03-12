import {RedactorEntryModel} from '../../orm/RedactorEntry';
import {Request, Response} from 'express';

export const createOrUpdate = async (req: Request, res: Response) => {
  const {root, items, page} = req.body ?? {};
  try {
    const url = new URL(page ?? '');
  } catch (e) {
    res.writeHead(400, 'Wrong page url');
    res.end('Bad request');
    return;
  }
  for (let i in items) {
    const item = items[i];
    if (!item || !item.type || !item.$ || !Array.isArray(item.children ?? [])) {
      res.writeHead(400, `Wrong item format for id: ${i}`);
      res.end('Bad request');
      return;
    }
  }
  const url = new URL(page ?? '');
  await RedactorEntryModel.bulkCreate(
    Object.keys(items).map(id => {
      return {
        entry: id,
        type: items[id].type,
        data: items[id],
        root,
        domain: url.origin,
        page: url.href,
        user: req.userId,
      };
    }),
    {
      updateOnDuplicate: ['data'],
    }
  );
  return res.json({
    status: 200,
    data: {
      page,
      root,
      items,
    },
  });
};

export default createOrUpdate;
