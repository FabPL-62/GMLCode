/**
 * GML Language Support Extension
 * Main entry point for the VS Code extension
 */

import * as vscode from 'vscode';
import { GMLHoverProvider } from './hoverProvider';
import { GMLCompletionProvider } from './completionProvider';
import { VariableScanner } from './variableScanner';

// Extension state
let variableScanner: VariableScanner;
let outputChannel: vscode.OutputChannel;

export async function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel('GML Language Support');
  outputChannel.appendLine('GML Language Support is now active!');

  // Initialize the variable scanner
  variableScanner = new VariableScanner();
  
  // Scan workspace for variables on activation
  outputChannel.appendLine('Scanning workspace for GML files...');
  await variableScanner.scanWorkspace();
  outputChannel.appendLine('Workspace scan complete.');

  // Define the GML document selector
  const gmlSelector: vscode.DocumentSelector = { language: 'gml', scheme: 'file' };

  // Register the Hover Provider
  const hoverProvider = new GMLHoverProvider(variableScanner);
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(gmlSelector, hoverProvider)
  );
  outputChannel.appendLine('Hover provider registered.');

  // Register the Completion Provider
  const completionProvider = new GMLCompletionProvider(variableScanner);
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      gmlSelector,
      completionProvider,
      '.', // Trigger on dot for struct/instance access
      '_'  // Also trigger on underscore for common GML naming conventions
    )
  );
  outputChannel.appendLine('Completion provider registered.');

  // Register the Signature Help Provider
  const signatureHelpProvider = new GMLSignatureHelpProvider();
  context.subscriptions.push(
    vscode.languages.registerSignatureHelpProvider(
      gmlSelector,
      signatureHelpProvider,
      '(', ','
    )
  );
  outputChannel.appendLine('Signature help provider registered.');

  // Register workspace folder change handler
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(async () => {
      outputChannel.appendLine('Workspace folders changed, rescanning...');
      await variableScanner.scanWorkspace();
    })
  );

  // Register command to manually rescan workspace
  context.subscriptions.push(
    vscode.commands.registerCommand('gml.rescanWorkspace', async () => {
      outputChannel.appendLine('Manual workspace rescan triggered.');
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Scanning GML files...',
          cancellable: false
        },
        async () => {
          await variableScanner.scanWorkspace();
          vscode.window.showInformationMessage('GML workspace scan complete!');
        }
      );
    })
  );

  // Register command to show output channel
  context.subscriptions.push(
    vscode.commands.registerCommand('gml.showOutput', () => {
      outputChannel.show();
    })
  );

  // Add status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.text = '$(file-code) GML';
  statusBarItem.tooltip = 'GML Language Support Active';
  statusBarItem.command = 'gml.showOutput';
  context.subscriptions.push(statusBarItem);

  // Show status bar when GML file is active
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && editor.document.languageId === 'gml') {
        statusBarItem.show();
      } else {
        statusBarItem.hide();
      }
    })
  );

  // Initial visibility check
  if (vscode.window.activeTextEditor?.document.languageId === 'gml') {
    statusBarItem.show();
  }

  outputChannel.appendLine('GML Language Support extension fully activated.');
}

export function deactivate() {
  if (variableScanner) {
    variableScanner.dispose();
  }
  if (outputChannel) {
    outputChannel.dispose();
  }
}

/**
 * Signature Help Provider for GML functions
 */
class GMLSignatureHelpProvider implements vscode.SignatureHelpProvider {
  private functionSignatures: Map<string, vscode.SignatureInformation> = new Map();

  constructor() {
    this.initializeSignatures();
  }

  private initializeSignatures(): void {
    // Import from gmlFunctions
    const { gmlFunctions } = require('./data/gmlFunctions');
    
    for (const [name, func] of gmlFunctions) {
      const sig = new vscode.SignatureInformation(func.signature);
      sig.documentation = new vscode.MarkdownString(func.description);
      
      // Add parameter info
      for (const param of func.parameters) {
        const paramInfo = new vscode.ParameterInformation(
          param.name,
          new vscode.MarkdownString(`*${param.type}* — ${param.description}`)
        );
        sig.parameters.push(paramInfo);
      }
      
      this.functionSignatures.set(name, sig);
    }
  }

  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.SignatureHelpContext
  ): vscode.ProviderResult<vscode.SignatureHelp> {
    // Find the function name and determine which parameter we're on
    const lineText = document.lineAt(position.line).text;
    const textBeforeCursor = lineText.substring(0, position.character);
    
    // Find the function call
    const funcMatch = this.findFunctionCall(textBeforeCursor);
    if (!funcMatch) {
      return null;
    }

    const funcName = funcMatch.name;
    const paramIndex = funcMatch.paramIndex;

    // Get the signature for this function
    const signature = this.functionSignatures.get(funcName);
    if (!signature) {
      return null;
    }

    const help = new vscode.SignatureHelp();
    help.signatures = [signature];
    help.activeSignature = 0;
    help.activeParameter = Math.min(paramIndex, signature.parameters.length - 1);

    return help;
  }

  private findFunctionCall(text: string): { name: string; paramIndex: number } | null {
    // Work backwards through the text to find unclosed function calls
    let depth = 0;
    let commaCount = 0;
    let funcEndPos = -1;

    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      
      if (char === ')') {
        depth++;
      } else if (char === '(') {
        if (depth === 0) {
          funcEndPos = i;
          break;
        }
        depth--;
      } else if (char === ',' && depth === 0) {
        commaCount++;
      }
    }

    if (funcEndPos === -1) {
      return null;
    }

    // Extract the function name
    const beforeParen = text.substring(0, funcEndPos);
    const funcNameMatch = beforeParen.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*$/);
    
    if (!funcNameMatch) {
      return null;
    }

    return {
      name: funcNameMatch[1],
      paramIndex: commaCount
    };
  }
}

