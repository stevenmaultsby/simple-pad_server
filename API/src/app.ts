import express from 'express';
import {Server as IOServer} from 'socket.io';
import router from './router';
import {createServer} from 'http';
import {HTTP_CORS_ALLOWED_ORIGIN, HTTP_LISTEN_PORT} from './conf/vars';
import {ProfileModel} from './orm/Profile';
import {SelectionModel} from './orm/Selection';
import {RedactorEntryModel} from './orm/RedactorEntry';

process.on('uncaughtException', err => {
  console.error(err);
});

process.on('unhandledRejection', err => {
  console.error(err);
});

(async () => {
  await Promise.all([
    ProfileModel.sync(),
    RedactorEntryModel.sync(),
    SelectionModel.sync(),
  ]);
  const app = express();
  app.use('/plugin/api/', router);
  const server = createServer(app);
  new IOServer(server, {
    cors: HTTP_CORS_ALLOWED_ORIGIN,
    serveClient: false,
  });
  server.listen(HTTP_LISTEN_PORT, () => {
    console.log(`Server listens on 0.0.0.0:${HTTP_LISTEN_PORT}`);
  });
})();
