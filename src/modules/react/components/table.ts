import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';
const config = require('../../../utils/config');
import {
  toUpperCameCase,
  toLocaleLowerCameCase,
  replaceEjsTemplate,
  result,
  hump,
  bigHump,
  namedConst,
  underline,
  hyphen,
} from '../../../utils/index';
export const createTableHandler = async (e: vscode.Uri) => {
  const creatFile = (quickPickName: string) => {
    if (quickPickName) {
      const dir = path.normalize(e.fsPath);
      const name =
        quickPickName === 'index' ? path.basename(dir) : quickPickName;
      // ;-转换模版文件
      replaceEjsTemplate(
        'template/react/table/table.ejs',
        path.resolve(dir, quickPickName + '.tsx'),
        {
          CameName: toUpperCameCase(name),
          name: toLocaleLowerCameCase(name),
        }
      );
    }
  };
  const inputName = await vscode.window.showInputBox({
    placeHolder: '请输入文件名称', // 在输入框内的提示信息
    prompt: '可输入英文或汉字，汉字会进行翻译，推荐使用驼峰命名', // 在输入框下方的提示信息
  });
  const reg = /^[a-zA-Z ]/;
  if (reg.test(inputName as string)) {
    creatFile(inputName as string);
  } else {
    const humpName: any = await vscode.window.showQuickPick([
      '大写驼峰命名',
      '小写驼峰命名',
      '中划线命名',
      '下划线命名',
      '常量命名',
    ]);
    const { query: params } = config.getParams(inputName);
    let items: any = [];
    let named: any = {
      大写驼峰命名: bigHump,
      小写驼峰命名: hump,
      中划线命名: hyphen,
      下划线命名: underline,
      常量命名: namedConst,
    };
    try {
      let res = await axios.get('http://fanyi.youdao.com/openapi.do', {
        params,
      });
      items = result(res.data, named[humpName]);
    } catch (error) {
      console.log(error);
    }
    const { label }: any = await vscode.window.showQuickPick(items);
    creatFile(label as string);
  }
};
