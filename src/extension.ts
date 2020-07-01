import * as vscode from 'vscode';
import * as fs from 'fs';
import { MODULES } from './constant/modules';
import { message } from './utils/message';
async function init(e: vscode.Uri) {
  const stat = fs.statSync(e.fsPath);
  if (stat.isDirectory()) {
    try {
      const inputName: any = await vscode.window.showQuickPick(
        Object.keys(MODULES)
      );
      console.log(inputName, 'inputName');
      await MODULES[inputName](e);
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
