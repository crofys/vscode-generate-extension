import * as vscode from 'vscode';
import * as fs from 'fs';
import {
  createReactHandler,
  createNestHandler,
  createApiHandler,
} from './constant/index';
import { message } from './utils/message';
async function init(e: vscode.Uri) {
  const stat = fs.statSync(e.fsPath);
  if (stat.isDirectory()) {
    try {
      const inputName = await vscode.window.showQuickPick([
        'react',
        'api',
        'module',
      ]);
      switch (inputName) {
        case 'react':
          await createReactHandler(e);
          break;
        case 'api':
          await createApiHandler(e);
          break;
        case 'module':
          await createNestHandler(e);
          break;
      }
    } catch (err) {
      message.error('创建文件失败');
      console.log(err);
    }
  } else {
    message.error('请选择文件夹');
  }
}
export function activate(context: vscode.ExtensionContext) {
  let disposable = [
    vscode.commands.registerCommand(
      'vscode-generate-react-extension.generate',
      async (e: vscode.Uri) => {
        await init(e);
      }
    ),
  ];
  context.subscriptions.push(...disposable);
}
