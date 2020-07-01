import {
  createReactIndexHandler,
  createApiHandler,
  createNestHandler,
} from '../modules/index';
export const MODULES: any = {
  react: createReactIndexHandler,
  api: createApiHandler,
  module: createNestHandler,
};
