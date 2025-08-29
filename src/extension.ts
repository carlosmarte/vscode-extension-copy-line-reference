import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-ext-line" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "extension.copyRelativePathWithLine",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const document = editor.document;
      const selection = editor.selection;

      // Get the workspace folder
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found");
        return;
      }

      // Calculate relative path
      const absolutePath = document.uri.fsPath;
      const relativePath = path.relative(
        workspaceFolder.uri.fsPath,
        absolutePath
      );

      // Format path for different operating systems
      const normalizedPath = relativePath.replace(/\\/g, "/");

      // Get line numbers
      const startLine = selection.start.line + 1; // VSCode uses 0-based indexing
      const endLine = selection.end.line + 1;

      let result: string;
      if (startLine === endLine) {
        // Single line
        result = `${normalizedPath}:${startLine}`;
      } else {
        // Multiple lines
        result = `${normalizedPath}:${startLine}-${endLine}`;
      }

      // Copy to clipboard
      try {
        await vscode.env.clipboard.writeText(result);
        vscode.window.showInformationMessage(`Copied: ${result}`);
      } catch (error: unknown) {
        vscode.window.showErrorMessage(`Failed to copy to clipboard: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
