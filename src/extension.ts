import * as vscode from 'vscode';
import {pasteCode2Sinippets} from './index';
enum Command {
	pasteJSONAsMock = "vs-sinippets.pasteCode2Sinippets",
}
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand(Command.pasteJSONAsMock, editor =>
			pasteCode2Sinippets(editor)
		),
	);
}



// this method is called when your extension is deactivated
export function deactivate() { }
