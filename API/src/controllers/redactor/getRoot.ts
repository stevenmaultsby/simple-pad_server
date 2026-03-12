import {Op} from 'sequelize';
import {SelectionModel} from '../../orm/Selection';
import {RedactorEntryModel} from '../../orm/RedactorEntry';
import {Request, Response} from 'express';

export const getRoot = async (req: Request, res: Response) => {
  const page = String(req.query.page);
  let url: URL;
  try {
    url = new URL(page ?? '');
  } catch (e) {
    res.writeHead(404, 'Wrong page url: ' + page, {
      'content-type': 'application/json; charset=utf-8',
    });
    res.end(
      JSON.stringify({
        status: 404,
        error: {
          message: 'Bad request',
        },
      })
    );
    return;
  }

  const items = await RedactorEntryModel.findAll({
    where: {
      user: req.userId,
      page: url.href,
    },
  });
  const roots = items.filter(i => i.get('type') === 'root');
  if (roots.length === 0) {
    res.writeHead(404, 'No roots for page: ' + page, {
      'content-type': 'application/json; charset=utf-8',
    });
    res.end(
      JSON.stringify({
        status: 404,
        error: {
          message: 'No roots for page: ' + page,
        },
      })
    );
    return;
  }
  roots.sort((a, b) => {
    return a.createdAt > b.createdAt ? 1 : -1;
  });
  const root = roots.pop()!;
  const itemsByRoot = items.filter(i => i.get('root') === root.get('entry'));
  const selectionsWithinRoot = itemsByRoot
    .filter(i => i.get('type') === 'editor-quote')
    .map(i => i.get('data').selectionId)
    .filter(Boolean);
  const selectionsByPage = await SelectionModel.findAll({
    where: {
      entry: {
        [Op.in]: selectionsWithinRoot,
      },
    },
  });
  return res.json({
    status: 200,
    data: {
      root: root.get('entry'),
      page,
      items: itemsByRoot.reduce(
        (ret, item) => ({
          ...ret,
          [item.get('entry')]: item.get('data'),
        }),
        {}
      ),
      selections: selectionsByPage.reduce(
        (ret, item) => ({
          ...ret,
          [item.get('entry')]: item.get('data'),
        }),
        {}
      ),
    },
  });
};

export default getRoot;
