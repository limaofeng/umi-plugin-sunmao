// ref:
// - https://umijs.org/plugins/api
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import { IApi } from '@umijs/types';

const joinTemplatePath = (path: string) => join(__dirname, '../templates', path);

const cenerateFile = (api: IApi, fileName: string) =>
  api.onGenerateFiles(() => {
    const indexPath = `sunmao/${fileName}`;

    const templatePath = joinTemplatePath(fileName);
    const indexTemplate = readFileSync(templatePath, 'utf-8');
    api.writeTmpFile({
      path: indexPath,
      content: api.utils.Mustache.render(indexTemplate, api.config.app),
    });
  });

export default function(api: IApi) {
  api.logger.info('use @asany/umi-plugin-sunmao');

  const appTmpDir = join(api.paths.absTmpPath!, 'sunmao');

  api.describe({
    key: 'sunmao',
    config: {
      default: {
        // id: process.env.APPID,
      },
      schema(joi) {
        return joi.object({
          id: joi.string(),
        });
      },
    },
  });

  const files = ['runtime.tsx', 'SunmaoInitContainer.tsx', 'exports.ts', 'typings.ts'];

  files.map(fileName => cenerateFile(api, fileName));

  api.onGenerateFiles(() => {
    const indexPath = 'app/autoImportLibrary.ts';

    const templatePath = joinTemplatePath('autoImportLibrary.hbs');
    const indexTemplate = readFileSync(templatePath, 'utf-8');

    const dirs = readdirSync(api.paths.absPagesPath!, { withFileTypes: true });
    const librarys = dirs
      .filter(dir => dir.isDirectory())
      .map(dir => ({ path: api.paths.absPagesPath! + '/' + dir.name, name: dir.name }));

    const layoutDir = api.paths.absSrcPath! + '/layouts';
    if (existsSync(layoutDir)) {
      librarys.push({ path: layoutDir, name: 'layout' });
    }

    api.writeTmpFile({
      path: indexPath,
      content: api.utils.Mustache.render(indexTemplate, {
        librarys,
      }),
    });
  });

  api.addRuntimePlugin({
    fn: () => join(api.paths.absTmpPath!, 'app/runtime'),
    stage: -1 * Number.MAX_SAFE_INTEGER + 1,
  });

  api.addUmiExports(() => ({
    exportAll: true,
    source: api.utils.winPath(join(appTmpDir, 'exports')),
  }));
}
