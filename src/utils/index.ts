import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

export const toUpperCameCase = (str: string) => {
  return str
    .replace(/^(\w)/, (match, $1) => $1.toUpperCase())
    .replace(/[_\.-]([a-z])/g, function (all, i) {
      return i.toUpperCase();
    });
};
export const toLocaleLowerCameCase = (str: string) => {
  return str
    .replace(/^(\w)/, (match, $1) => $1.toLocaleLowerCase())
    .replace(/[_\.-]([a-z])/g, function (all, i) {
      return i.toUpperCase();
    });
};
export const readFileSync = (file: string) => {
  return fs.readFileSync(path.resolve(__dirname, '../../', file), 'utf-8');
};
export const replaceEjsTemplate = (
  templatePath: string,
  filePath: string,
  data: any
) => {
  const template: any = readFileSync(templatePath);
  const html = ejs.render(template, data);

  if (!fs.existsSync(filePath)) {
    // - 写入模版文件
    fs.writeFileSync(filePath, html);
    vscode.window.showInformationMessage('创建文件成功');
  } else {
    vscode.window.showErrorMessage('创建文件写入失败,文件已经存在');
  }
};
