import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import {
  toUpperCameCase,
  toLocaleLowerCameCase,
  readFileSync,
  replaceEjsTemplate,
} from './utils/index';

async function createReactHandler(e: vscode.Uri) {
  const stat = fs.statSync(e.fsPath);

  if (stat.isDirectory()) {
    try {
      const inputName = await vscode.window.showInputBox();
      if (inputName) {
        const dir = path.normalize(e.fsPath);
        const name = inputName === 'index' ? path.basename(dir) : inputName;

        // - 转换模版文件
        replaceEjsTemplate(
          'template/react/base.ejs',
          path.resolve(dir, inputName + '.tsx'),
          {
            CameName: toUpperCameCase(name),
            name: toLocaleLowerCameCase(name),
          }
        );
      }
    } catch (error) {
      vscode.window.showErrorMessage('创建文件失败');
      console.error(error);
    }
  } else {
    vscode.window.showErrorMessage('请选择文件夹');
  }
}
async function createApiHandler(e: vscode.Uri) {
  const stat = fs.statSync(e.fsPath);
  if (stat.isDirectory()) {
    try {
      const inputName = await vscode.window.showInputBox();
      if (inputName) {
        const dir = path.normalize(e.fsPath);
        const name = inputName === 'index' ? path.basename(dir) : inputName;
        // -创建模块文件
        fs.mkdirSync(path.resolve(dir, inputName));
        const template: any = {
          constant: {
            output: inputName + '.constant.ts',
            content: 'template/api/constant.ejs',
          },
          dto: {
            output: inputName + '.dto.ts',
            content: 'template/api/dto.ejs',
          },
          index: {
            output: inputName + '.ts',
            content: 'template/api/index.ejs',
          },
          interface: {
            output: inputName + '.interface.ts',
            content: 'template/api/interface.ejs',
          },
        };
        // - 转换模版文件
        for (const key in template) {
          if (template.hasOwnProperty(key)) {
            const { content, output } = template[key];
            replaceEjsTemplate(content, path.resolve(dir, inputName, output), {
              cameName: toUpperCameCase(name),
              name,
            });
          }
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage('创建文件失败');
      console.error(error);
    }
  } else {
    vscode.window.showErrorMessage('请选择文件夹');
  }
}
async function createNestHandler(e: vscode.Uri) {
  const stat = fs.statSync(e.fsPath);
  if (stat.isDirectory()) {
    try {
      const inputName = await vscode.window.showInputBox();
      if (inputName) {
        const dir = path.normalize(e.fsPath);
        const name = inputName === 'index' ? path.basename(dir) : inputName;
        // -创建模块文件
        fs.mkdirSync(path.resolve(dir, inputName));
        const template: any = {
          controller: {
            output: inputName + '.controller.ts',
            content: 'template/nest/controller.ejs',
          },
          dto: {
            output: inputName + '.dto.ts',
            content: 'template/nest/dto.ejs',
          },
          module: {
            output: inputName + '.module.ts',
            content: 'template/nest/module.ejs',
          },
          service: {
            output: inputName + '.service.ts',
            content: 'template/nest/service.ejs',
          },
          model: {
            output: inputName + '.model.ts',
            content: 'template/nest/model.ejs',
          },
        };
        // - 转换模版文件
        for (const key in template) {
          if (template.hasOwnProperty(key)) {
            const { content, output } = template[key];
            replaceEjsTemplate(content, path.resolve(dir, inputName, output), {
              cameName: toUpperCameCase(name),
              name,
            });
          }
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage('创建文件失败');
      console.error(error);
    }
  } else {
    vscode.window.showErrorMessage('请选择文件夹');
  }
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = [
    vscode.commands.registerCommand(
      'vscode-generate-react-extension.generate-react',
      async (e: vscode.Uri) => {
        await createReactHandler(e);
      }
    ),
    vscode.commands.registerCommand(
      'vscode-generate-react-extension.generate-api',
      async (e: vscode.Uri) => {
        await createApiHandler(e);
      }
    ),
    vscode.commands.registerCommand(
      'vscode-generate-nest-extension.generate-module',
      async (e: vscode.Uri) => {
        await createNestHandler(e);
      }
    ),
  ];

  context.subscriptions.push(...disposable);
}

export function deactivate() {}
