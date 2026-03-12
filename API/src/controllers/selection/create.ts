import {SelectionModel} from '../../orm/Selection';
import {RedactorEntryModel} from '../../orm/RedactorEntry';
import {Request, Response} from 'express';

export const createOrUpdate = async (req: Request, res: Response) => {
  const {selection, page} = req.body ?? {};
  console.log(req.body);
  try {
    const url = new URL(page ?? '');
  } catch (e) {
    res.writeHead(400, 'Wrong page url');
    res.end('Bad request');
    return;
  }
  const url = new URL(page ?? '');
  await SelectionModel.create({
    entry: selection.id,
    data: selection,
    domain: url.origin,
    page: url.href,
    user: req.userId,
  });
  return res.json({
    status: 200,
    data: {
      page,
      selection,
    },
  });
};

export default createOrUpdate;
