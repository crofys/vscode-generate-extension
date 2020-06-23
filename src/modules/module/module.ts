import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { message } from '../../utils/message';
const config = require('../../utils/config');
import {
  toUpperCameCase,
  replaceEjsTemplate,
  result,
  hump,
  bigHump,
  namedConst,
  underline,
  hyphen,
} from '../../utils/index';
export const createNestHandler = async (e: vscode.Uri) => {
  const stat = fs.statSync(e.fsPath);
  const creatFile = (inputName: string) => {
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
  };
  if (stat.isDirectory()) {
    try {
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
    } catch (error) {
      message.error('创建文件失败');
      console.error(error);
    }
  } else {
    message.error('请选择文件夹');
  }
};
