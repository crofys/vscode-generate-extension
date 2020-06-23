import * as vscode from 'vscode';
const { showErrorMessage: error, showInformationMessage: info } = vscode.window;
export const message: any = {
  error,
  info,
  success: (...args: any[]) => info('成功:', ...args),
};
