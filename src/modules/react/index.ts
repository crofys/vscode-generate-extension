import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { google } from 'translation.js';
import { message } from '../../utils/message';
import { REACT } from './constant/react';

export const createReactIndexHandler = async (e: vscode.Uri) => {
  const QuickPick: any = await vscode.window.showQuickPick(Object.keys(REACT));
  console.log(QuickPick, 'QuickPick');
  if (QuickPick) {
    await REACT[QuickPick](e);
  }
};
