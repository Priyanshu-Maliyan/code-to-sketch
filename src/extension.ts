import * as vscode from 'vscode';
import * as esprima from 'esprima';
import * as path from 'path';
import { parseCode } from './parser';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('code-to-sketch.generateFlowchart', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor!');
      return;
    }

    const selectedCode = editor.document.getText(editor.selection);
    if (!selectedCode) {
      vscode.window.showErrorMessage('No code selected!');
      return;
    }

    try {
      const graphData = parseCode(selectedCode);
      const panel = vscode.window.createWebviewPanel(
        'codeToSketch',
        'Code Flowchart',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent(context, panel.webview, graphData);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      vscode.window.showErrorMessage('Error parsing code: ' + message);
    }
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(context: vscode.ExtensionContext, webview: vscode.Webview, graphData: any) {
  const htmlPath = path.join(context.extensionPath, 'src', 'webview', 'index.html');
  const htmlUri = webview.asWebviewUri(vscode.Uri.file(htmlPath));
  const jsUri = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'main.js')));
  const cssUri = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview', 'styles.css')));
  const cytoscapeUri = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'node_modules', 'cytoscape', 'dist', 'cytoscape.min.js')));

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Flowchart</title>
      <link rel="stylesheet" href="${cssUri}">
    </head>
    <body>
      <div id="cy"></div>
      <script src="${cytoscapeUri}"></script>
      <script>const graphData = ${JSON.stringify(graphData)};</script>
      <script src="${jsUri}"></script>
    </body>
    </html>`;
}

export function deactivate() {}