import { Express, Router } from 'express';
import fastGlob from 'fast-glob';

export default (app: Express): void => {
    const router = Router();
    app.use('/api', router);
    // fastGlob.sync -> retorna uma lista de string com a path completa com todos os arquivos que derem true abaixo
    fastGlob.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
}