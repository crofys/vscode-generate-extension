import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';
import { filter } from './filter';
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
// 处理数据取出结果
export const result = (result: any, style: any) => {
  if (result.errorCode === 0) {
    //结果
    let result_value = [];
    // 过滤中文
    let reg = /^[a-zA-Z ]/;
    // 标准翻译结果 : translation
    let result_translation = result.translation;
    for (let i = 0, len = result_translation.length; i < len; i++) {
      if (reg.test(result_translation[i])) {
        result_value.push({
          // title: result_translation[i],
          // subtitle: `标准翻译 => ${result_translation[i]}`,
          label: style(result_translation[i]),
        });
      }
    }
    // 网络翻译 : web
    if (result.web) {
      let result_web = result.web;
      for (let i = 0, len = result_web.length; i < len; i++) {
        for (let j = 0, ilen = result_web[i].value.length; j < ilen; j++) {
          if (reg.test(result_web[i].value[j])) {
            result_value.push({
              // title: result_web[i].value[j],
              // subtitle: `网络翻译 => ${result_web[i].value[j]}`,
              label: style(result_web[i].value[j]),
            });
          }
        }
      }
    }
    return result_value;
  } else {
    return [
      {
        // title: '抱歉',
        // subtitle: `无相关记录`,
        label: '无相关记录',
      },
    ];
  }
};
/**
 * 大写驼峰
 */

export const bigHump = (s: string) => {
  let strArr = filter.run(s);
  strArr[0] = strArr[0].charAt(0).toUpperCase() + strArr[0].substring(1);
  // 单词首字母大写
  for (let i = 1; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  return strArr.join('');
};
/**
 * 小写驼峰
 */
export const hump = (s: string) => {
  let strArr = filter.run(s);
  // 单词首字母大写
  for (let i = 1; i < strArr.length; i++) {
    strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].substring(1);
  }
  return strArr.join('');
};
/**
 * 常量命名
 */
export const namedConst = (s: string) => {
  let strArr = filter.run(s);
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].toUpperCase();
  }
  return strArr.join('_');
};
/**
 * 下划线命名
 */

export const underline = (s: string) => {
  let strArr = filter.run(s);
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].toLowerCase();
  }
  return strArr.join('_');
};
/**
 * 中划线命名
 */

export const hyphen = (s: string) => {
  let strArr = filter.run(s);
  for (let i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i].toLowerCase();
  }
  return strArr.join('-');
};
