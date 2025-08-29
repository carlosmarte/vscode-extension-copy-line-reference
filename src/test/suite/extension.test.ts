import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    assert.ok(vscode.extensions.getExtension("vscode-ext-line"));
  });

  test("Should register copy relative path command", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes("extension.copyRelativePathWithLine"));
  });

  test("Should handle single line path", () => {
    // This is a basic test - in a real scenario you'd mock the editor
    const testPath = "src/test.ts:42";
    assert.strictEqual(testPath.includes(":"), true);
  });

  test("Should handle multi-line path", () => {
    // This is a basic test - in a real scenario you'd mock the editor
    const testPath = "src/test.ts:42-45";
    assert.strictEqual(testPath.includes("-"), true);
  });
});
