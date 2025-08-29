import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log('Copy Line Reference extension is now active!');

  // Register all commands
  const commands = [
    vscode.commands.registerCommand('copy-line-reference.copyPath', () => copyPath()),
    vscode.commands.registerCommand('copy-line-reference.copyPathWithCode', () => copyPathWithCode()),
    vscode.commands.registerCommand('copy-line-reference.copyAbsolutePath', () => copyAbsolutePath()),
    vscode.commands.registerCommand('copy-line-reference.copyFilename', () => copyFilename()),
    vscode.commands.registerCommand('copy-line-reference.copyRelativePath', () => copyRelativePath()),
    vscode.commands.registerCommand('copy-line-reference.copyWorkspaceRelativePath', () => copyWorkspaceRelativePath())
  ];

  context.subscriptions.push(...commands);
}

// Helper function to get the active editor
function getActiveEditor(): vscode.TextEditor | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found');
    return null;
  }
  return editor;
}

// Helper function to get workspace folder
function getWorkspaceFolder(document: vscode.TextDocument): vscode.WorkspaceFolder | null {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return null;
  }
  return workspaceFolder;
}

// Helper function to get configuration
function getPathType(): 'relative' | 'absolute' {
  const config = vscode.workspace.getConfiguration('copy-line-reference');
  return config.get('pathType', 'relative');
}

// Helper function to normalize path for cross-platform compatibility
function normalizePath(pathStr: string): string {
  return pathStr.replace(/\\/g, '/');
}

// Helper function to check if a line is empty or whitespace only
function isEmptyLine(document: vscode.TextDocument, lineNumber: number): boolean {
  const line = document.lineAt(lineNumber);
  return line.text.trim().length === 0;
}

// Helper function to format line numbers in GitHub style
function formatLineNumbers(startLine: number, endLine: number, includeEmpty: boolean = true): string {
  if (!includeEmpty) {
    return '';
  }
  if (startLine === endLine) {
    return `#L${startLine}`;
  } else {
    return `#L${startLine}-${endLine}`;
  }
}

// Helper function to copy text to clipboard
async function copyToClipboard(text: string, description: string = ''): Promise<void> {
  try {
    await vscode.env.clipboard.writeText(text);
    const message = description ? `Copied ${description}: ${text}` : `Copied: ${text}`;
    vscode.window.showInformationMessage(message);
  } catch (error: unknown) {
    vscode.window.showErrorMessage(`Failed to copy to clipboard: ${error}`);
  }
}

// Command 1: Copy Path with Line Numbers (main command)
async function copyPath(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const selection = editor.selection;
  const pathType = getPathType();

  let filePath: string;
  if (pathType === 'absolute') {
    filePath = normalizePath(document.uri.fsPath);
  } else {
    const workspaceFolder = getWorkspaceFolder(document);
    if (!workspaceFolder) {return;}
    const relativePath = path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath);
    filePath = normalizePath(relativePath);
  }

  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;

  // Smart cursor handling: if cursor is on empty line, don't include line numbers
  const shouldIncludeLineNumbers = !selection.isEmpty || !isEmptyLine(document, selection.start.line);
  const lineNumbers = formatLineNumbers(startLine, endLine, shouldIncludeLineNumbers);
  
  const result = `${filePath}${lineNumbers}`;
  await copyToClipboard(result, 'path');
}

// Command 2: Copy Path with Code
async function copyPathWithCode(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const selection = editor.selection;
  const pathType = getPathType();

  let filePath: string;
  if (pathType === 'absolute') {
    filePath = normalizePath(document.uri.fsPath);
  } else {
    const workspaceFolder = getWorkspaceFolder(document);
    if (!workspaceFolder) {return;}
    const relativePath = path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath);
    filePath = normalizePath(relativePath);
  }

  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  const lineNumbers = formatLineNumbers(startLine, endLine);
  
  // Get selected text or current line if no selection
  let selectedText: string;
  if (!selection.isEmpty) {
    selectedText = document.getText(selection);
  } else {
    const currentLine = document.lineAt(selection.start.line);
    selectedText = currentLine.text;
  }

  // Determine language for code block
  const languageId = document.languageId;
  
  const result = `${filePath}${lineNumbers}\n\n\`\`\`${languageId}\n${selectedText}\n\`\`\``;
  await copyToClipboard(result, 'path with code');
}

// Command 3: Copy Absolute Path
async function copyAbsolutePath(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const filePath = normalizePath(document.uri.fsPath);
  await copyToClipboard(filePath, 'absolute path');
}

// Command 4: Copy Filename Only
async function copyFilename(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const filename = path.basename(document.uri.fsPath);
  await copyToClipboard(filename, 'filename');
}

// Command 5: Copy Relative Path (without line numbers)
async function copyRelativePath(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const workspaceFolder = getWorkspaceFolder(document);
  if (!workspaceFolder) {return;}

  const relativePath = path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath);
  const filePath = normalizePath(relativePath);
  await copyToClipboard(filePath, 'relative path');
}

// Command 6: Copy Workspace Relative Path (same as copy path but explicit)
async function copyWorkspaceRelativePath(): Promise<void> {
  const editor = getActiveEditor();
  if (!editor) {return;}

  const document = editor.document;
  const selection = editor.selection;
  const workspaceFolder = getWorkspaceFolder(document);
  if (!workspaceFolder) {return;}

  const relativePath = path.relative(workspaceFolder.uri.fsPath, document.uri.fsPath);
  const filePath = normalizePath(relativePath);

  const startLine = selection.start.line + 1;
  const endLine = selection.end.line + 1;
  const shouldIncludeLineNumbers = !selection.isEmpty || !isEmptyLine(document, selection.start.line);
  const lineNumbers = formatLineNumbers(startLine, endLine, shouldIncludeLineNumbers);
  
  const result = `${filePath}${lineNumbers}`;
  await copyToClipboard(result, 'workspace relative path');
}

export function deactivate() {}
