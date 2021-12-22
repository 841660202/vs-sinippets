import * as vscode from 'vscode';
import { Range } from "vscode";
export async function pasteCode2Sinippets(editor: vscode.TextEditor) {
  let indentation: string;
  if (editor.options.insertSpaces) {
    const tabSize = editor.options.tabSize as number;
    indentation = " ".repeat(tabSize);
  } else {
    indentation = "\t";
  }

  let content: string;
  try {
    content = await vscode.env.clipboard.readText();
  } catch (e) {
    vscode.window.showErrorMessage("Could not get clipboard contents");
    return;
  }
  // TODO: 这里是调试的结果 Clipboard does not contain valid JSON.
  if (!content) {
    vscode.window.showErrorMessage("Clipboard does not contain anything");
    return;
  }
  console.log(content);
  console.log(typeof content);
  console.log(content.split('\n'));
  const last = `
  "$1": {
    "prefix": "$2",
    "body": [`;
  const next = `\t\t],
    "description": "$3"
  },`;
  const contents = [last]
    .concat(content.split('\n').map(item => {
      // 找出转义字符数量\t
      const tabs = item.split('\t');
      let notTIndex = 0;
      
      for (let index = 0; index < tabs.length; index++) {
        const element = tabs[index];
        if(element !== ''){
          notTIndex = index;
          break;
        }
      }
      console.log(tabs);
      const tArr = tabs.splice(0,notTIndex);
      console.log('输出',notTIndex,tArr);
      return `\t\t\t${tArr.map(()=> '\t').join('')}\"` + (tabs.join('').replace(/\"/g, '\\"'))+ '\",';
    }))
    .concat([next]);
  const text = contents.join("\n");;
  const selection = editor.selection;
  editor.edit(builder => {
    if (selection.isEmpty) {
      builder.insert(selection.start, text); // 插入代码
    } else {
      builder.replace(new Range(selection.start, selection.end), text); // 替换代码
    }
  });
}