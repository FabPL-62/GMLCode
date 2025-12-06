/**
 * Hover Provider for GML
 * Provides documentation on hover for functions, variables, and constants
 */

import * as vscode from 'vscode';
import { gmlFunctions, gmlVariables, GMLFunction, GMLVariable } from './data/gmlFunctions';
import { VariableScanner, ScannedVariable, ScannedAsset, ScannedScript } from './variableScanner';

export class GMLHoverProvider implements vscode.HoverProvider {
  private variableScanner: VariableScanner;

  constructor(variableScanner: VariableScanner) {
    this.variableScanner = variableScanner;
  }

  /**
   * GameMaker supports both American (color) and British (colour) spellings.
   * This normalizes to British spelling for lookup, then tries American.
   */
  private findFunction(word: string): GMLFunction | undefined {
    // Direct lookup first
    if (gmlFunctions.has(word)) {
      return gmlFunctions.get(word);
    }
    
    // Try British spelling (color -> colour)
    const britishWord = word.replace(/color/g, 'colour');
    if (britishWord !== word && gmlFunctions.has(britishWord)) {
      return gmlFunctions.get(britishWord);
    }
    
    // Try American spelling (colour -> color)
    const americanWord = word.replace(/colour/g, 'color');
    if (americanWord !== word && gmlFunctions.has(americanWord)) {
      return gmlFunctions.get(americanWord);
    }
    
    return undefined;
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const config = vscode.workspace.getConfiguration('gml');
    const enableFunctionDoc = config.get<boolean>('enableFunctionDocumentation', true);
    const showVariableComments = config.get<boolean>('showVariableComments', true);

    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);

    // Check if it's a built-in function (supports both color/colour spellings)
    if (enableFunctionDoc) {
      const func = this.findFunction(word);
      if (func) {
        return new vscode.Hover(this.formatFunctionHover(func), wordRange);
      }
    }

    // Check if it's a built-in variable
    if (gmlVariables.has(word)) {
      const variable = gmlVariables.get(word)!;
      return new vscode.Hover(this.formatBuiltInVariableHover(variable), wordRange);
    }

    // Check if it's an instance variable (from collision functions, etc.)
    const instanceType = this.variableScanner.getInstanceVariableType(word, document.uri.fsPath);
    if (instanceType) {
      return new vscode.Hover(this.formatInstanceVariableHover(word, instanceType), wordRange);
    }

    // Check if it's a user-defined variable
    if (showVariableComments) {
      const scannedVariable = this.variableScanner.getVariable(word, document.uri.fsPath);
      if (scannedVariable) {
        return new vscode.Hover(this.formatScannedVariableHover(scannedVariable), wordRange);
      }
    }

    // Check for user-defined scripts (global)
    const script = this.variableScanner.getScript(word);
    if (script) {
      return new vscode.Hover(this.formatScriptHover(script), wordRange);
    }

    // Check for assets (sprites, sounds, rooms, objects, etc.)
    const asset = this.variableScanner.getAsset(word);
    if (asset) {
      return new vscode.Hover(this.formatAssetHover(asset), wordRange);
    }

    // Check for constants
    const constantHover = this.getConstantHover(word);
    if (constantHover) {
      return new vscode.Hover(constantHover, wordRange);
    }

    return null;
  }

  private formatScriptHover(script: ScannedScript): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Script signature
    md.appendCodeblock(script.signature || `${script.name}()`, 'gml');

    // Description
    if (script.description) {
      md.appendMarkdown(`\n\n${script.description}\n\n`);
    }

    // Parameters
    if (script.parameters && script.parameters.length > 0) {
      md.appendMarkdown('**Parameters:**\n\n');
      for (const param of script.parameters) {
        md.appendMarkdown(`- \`${param.name}\` *(${param.type})* — ${param.description || ''}\n`);
      }
      md.appendMarkdown('\n');
    }

    md.appendMarkdown('\n\n*📜 User Script (global)*');

    return md;
  }

  private formatAssetHover(asset: ScannedAsset): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Asset type icons
    const typeIcons: Record<string, string> = {
      'sprite': '🖼️',
      'sound': '🔊',
      'room': '🚪',
      'object': '📦',
      'script': '📜',
      'font': '🔤',
      'path': '🛤️',
      'timeline': '⏱️',
      'tileset': '🧱'
    };

    const icon = typeIcons[asset.type] || '📄';
    const typeLabel = asset.type.charAt(0).toUpperCase() + asset.type.slice(1);

    // Asset declaration
    md.appendCodeblock(`${asset.name}: ${typeLabel}`, 'gml');

    // Description
    if (asset.description) {
      md.appendMarkdown(`\n\n${asset.description}\n\n`);
    }

    md.appendMarkdown(`\n\n*${icon} ${typeLabel} Asset*`);

    return md;
  }

  /**
   * Format hover for instance variables (variables that hold instance references)
   */
  private formatInstanceVariableHover(variableName: string, objectType: string): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Variable declaration
    md.appendCodeblock(`${variableName}: Instance<${objectType}>`, 'gml');

    // Description
    md.appendMarkdown(`\n\n**Instance reference** to \`${objectType}\`\n\n`);

    // Get object info if available
    const objInfo = this.variableScanner.getObjectInfo(objectType);
    if (objInfo) {
      if (objInfo.parentObjectName) {
        md.appendMarkdown(`**Parent:** \`${objInfo.parentObjectName}\`\n\n`);
      }
      
      // List some variables from this object
      const objVars = this.variableScanner.getObjectVariables(objectType, false);
      if (objVars.length > 0) {
        md.appendMarkdown('**Instance variables:**\n');
        const varsToShow = objVars.slice(0, 10);
        for (const v of varsToShow) {
          md.appendMarkdown(`- \`${v.name}\`${v.type ? ` *(${v.type})*` : ''}\n`);
        }
        if (objVars.length > 10) {
          md.appendMarkdown(`- *... and ${objVars.length - 10} more*\n`);
        }
      }
    }

    // Get children objects
    const children = this.variableScanner.getChildObjects(objectType);
    if (children.length > 0) {
      md.appendMarkdown(`\n**Child objects:** ${children.slice(0, 5).map(c => `\`${c}\``).join(', ')}`);
      if (children.length > 5) {
        md.appendMarkdown(` *... and ${children.length - 5} more*`);
      }
      md.appendMarkdown('\n');
    }

    md.appendMarkdown('\n\n*📦 Instance Variable*');

    return md;
  }

  private formatFunctionHover(func: GMLFunction): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Function signature
    md.appendCodeblock(func.signature, 'gml');

    // Description
    md.appendMarkdown(`\n\n${func.description}\n\n`);

    // Parameters
    if (func.parameters.length > 0) {
      md.appendMarkdown('**Parameters:**\n\n');
      for (const param of func.parameters) {
        md.appendMarkdown(`- \`${param.name}\` *(${param.type})* — ${param.description}\n`);
      }
      md.appendMarkdown('\n');
    }

    // Return value
    md.appendMarkdown(`**Returns:** *${func.returns.type}* — ${func.returns.description}\n`);

    // Example
    if (func.example) {
      md.appendMarkdown('\n**Example:**\n');
      md.appendCodeblock(func.example, 'gml');
    }

    // Category
    md.appendMarkdown(`\n\n*Category: ${func.category}*`);

    return md;
  }

  private formatBuiltInVariableHover(variable: GMLVariable): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Variable declaration
    const readonlyStr = variable.readonly ? 'readonly ' : '';
    md.appendCodeblock(`${readonlyStr}${variable.name}: ${variable.type}`, 'gml');

    // Description
    md.appendMarkdown(`\n\n${variable.description}\n\n`);

    // Scope
    const scopeLabels: Record<string, string> = {
      'global': '🌍 Global Variable',
      'instance': '📦 Instance Variable',
      'constant': '🔒 Constant'
    };
    md.appendMarkdown(`*${scopeLabels[variable.scope] || variable.scope}*`);

    if (variable.readonly) {
      md.appendMarkdown(' *(read-only)*');
    }

    return md;
  }

  private formatScannedVariableHover(variable: ScannedVariable): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Variable name and type
    const typeStr = variable.type || 'any';
    md.appendCodeblock(`${variable.name}: ${typeStr}`, 'gml');

    // User comment/documentation
    if (variable.comment) {
      md.appendMarkdown(`\n\n${variable.comment}\n\n`);
    }

    // Context information
    if (variable.objectContext) {
      md.appendMarkdown(`\n\n*Object context: \`${variable.objectContext}\`*`);
    }

    // Source file
    const fileName = variable.file.split(/[/\\]/).pop();
    md.appendMarkdown(`\n\n*Defined in: ${fileName}:${variable.line}*`);

    return md;
  }

  private getConstantHover(word: string): vscode.MarkdownString | null {
    // Color constants
    const colorConstants: Record<string, string> = {
      'c_aqua': '#00FFFF - Aqua/Cyan color',
      'c_black': '#000000 - Black color',
      'c_blue': '#0000FF - Blue color',
      'c_dkgray': '#404040 - Dark gray color',
      'c_fuchsia': '#FF00FF - Fuchsia/Magenta color',
      'c_gray': '#808080 - Gray color',
      'c_green': '#008000 - Green color (dark)',
      'c_lime': '#00FF00 - Lime color (bright green)',
      'c_ltgray': '#C0C0C0 - Light gray color',
      'c_maroon': '#800000 - Maroon color',
      'c_navy': '#000080 - Navy blue color',
      'c_olive': '#808000 - Olive color',
      'c_purple': '#800080 - Purple color',
      'c_red': '#FF0000 - Red color',
      'c_silver': '#C0C0C0 - Silver color',
      'c_teal': '#008080 - Teal color',
      'c_white': '#FFFFFF - White color',
      'c_yellow': '#FFFF00 - Yellow color',
      'c_orange': '#FF8000 - Orange color'
    };

    if (colorConstants[word]) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${colorConstants[word]}`);
      md.appendMarkdown('\n\n*Color constant*');
      return md;
    }

    // Virtual key constants
    const vkConstants: Record<string, string> = {
      'vk_nokey': 'No key pressed',
      'vk_anykey': 'Any key pressed',
      'vk_enter': 'Enter/Return key',
      'vk_return': 'Enter/Return key',
      'vk_shift': 'Shift key (either)',
      'vk_control': 'Control key (either)',
      'vk_alt': 'Alt key (either)',
      'vk_escape': 'Escape key',
      'vk_space': 'Spacebar',
      'vk_backspace': 'Backspace key',
      'vk_tab': 'Tab key',
      'vk_left': 'Left arrow key',
      'vk_right': 'Right arrow key',
      'vk_up': 'Up arrow key',
      'vk_down': 'Down arrow key'
    };

    if (vkConstants[word]) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${vkConstants[word]}`);
      md.appendMarkdown('\n\n*Virtual key constant*');
      return md;
    }

    // Mouse button constants
    const mbConstants: Record<string, string> = {
      'mb_left': 'Left mouse button',
      'mb_right': 'Right mouse button',
      'mb_middle': 'Middle mouse button',
      'mb_any': 'Any mouse button',
      'mb_none': 'No mouse button'
    };

    if (mbConstants[word]) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${mbConstants[word]}`);
      md.appendMarkdown('\n\n*Mouse button constant*');
      return md;
    }

    // Font alignment constants
    const faConstants: Record<string, string> = {
      'fa_left': 'Align text to the left',
      'fa_center': 'Center text horizontally',
      'fa_right': 'Align text to the right',
      'fa_top': 'Align text to the top',
      'fa_middle': 'Center text vertically',
      'fa_bottom': 'Align text to the bottom'
    };

    if (faConstants[word]) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${faConstants[word]}`);
      md.appendMarkdown('\n\n*Text alignment constant*');
      return md;
    }

    // Event constants
    if (word.startsWith('ev_')) {
      const eventDescriptions: Record<string, string> = {
        'ev_create': 'Create event - runs when instance is created',
        'ev_destroy': 'Destroy event - runs when instance is destroyed',
        'ev_step': 'Step event type',
        'ev_alarm': 'Alarm event type',
        'ev_keyboard': 'Keyboard event type',
        'ev_mouse': 'Mouse event type',
        'ev_collision': 'Collision event type',
        'ev_other': 'Other event type',
        'ev_draw': 'Draw event type',
        'ev_draw_begin': 'Draw Begin event',
        'ev_draw_end': 'Draw End event',
        'ev_draw_pre': 'Pre-Draw event',
        'ev_draw_post': 'Post-Draw event',
        'ev_gui': 'Draw GUI event',
        'ev_gui_begin': 'Draw GUI Begin event',
        'ev_gui_end': 'Draw GUI End event',
        'ev_step_normal': 'Normal Step event',
        'ev_step_begin': 'Begin Step event',
        'ev_step_end': 'End Step event'
      };

      const description = eventDescriptions[word] || `Event constant: ${word}`;
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${description}`);
      md.appendMarkdown('\n\n*Event constant*');
      return md;
    }

    // Blend mode constants
    if (word.startsWith('bm_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nBlend mode constant for use with \`gpu_set_blendmode\` and related functions.`);
      md.appendMarkdown('\n\n*Blend mode constant*');
      return md;
    }

    // Buffer constants
    if (word.startsWith('buffer_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nBuffer constant for use with buffer functions.`);
      md.appendMarkdown('\n\n*Buffer constant*');
      return md;
    }

    // OS constants
    if (word.startsWith('os_')) {
      const osDescriptions: Record<string, string> = {
        'os_windows': 'Windows operating system',
        'os_macosx': 'macOS operating system',
        'os_linux': 'Linux operating system',
        'os_ios': 'iOS operating system',
        'os_android': 'Android operating system',
        'os_unknown': 'Unknown operating system'
      };

      const description = osDescriptions[word] || `Operating system constant: ${word}`;
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${description}`);
      md.appendMarkdown('\n\n*OS constant*');
      return md;
    }

    // Gamepad constants
    if (word.startsWith('gp_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nGamepad button/axis constant for use with gamepad functions.`);
      md.appendMarkdown('\n\n*Gamepad constant*');
      return md;
    }

    // Data structure type constants
    if (word.startsWith('ds_type_')) {
      const dsTypes: Record<string, string> = {
        'ds_type_map': 'DS Map data structure type',
        'ds_type_list': 'DS List data structure type',
        'ds_type_stack': 'DS Stack data structure type',
        'ds_type_queue': 'DS Queue data structure type',
        'ds_type_grid': 'DS Grid data structure type',
        'ds_type_priority': 'DS Priority Queue data structure type'
      };

      const description = dsTypes[word] || `Data structure type: ${word}`;
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${description}`);
      md.appendMarkdown('\n\n*Data structure type constant*');
      return md;
    }

    // Layer element type constants
    if (word.startsWith('layerelementtype_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nLayer element type constant for use with layer functions.`);
      md.appendMarkdown('\n\n*Layer element type constant*');
      return md;
    }

    // Asset type constants
    if (word.startsWith('asset_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nAsset type constant returned by \`asset_get_type()\`.`);
      md.appendMarkdown('\n\n*Asset type constant*');
      return md;
    }

    // Primitive type constants
    if (word.startsWith('pr_')) {
      const prTypes: Record<string, string> = {
        'pr_pointlist': 'Draw points',
        'pr_linelist': 'Draw lines (pairs of vertices)',
        'pr_linestrip': 'Draw connected lines',
        'pr_trianglelist': 'Draw triangles (triplets of vertices)',
        'pr_trianglestrip': 'Draw connected triangles (strip)',
        'pr_trianglefan': 'Draw triangles from a central point'
      };

      const description = prTypes[word] || `Primitive type: ${word}`;
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\n${description}`);
      md.appendMarkdown('\n\n*Primitive type constant*');
      return md;
    }

    // Network constants
    if (word.startsWith('network_')) {
      const md = new vscode.MarkdownString();
      md.appendCodeblock(`const ${word}`, 'gml');
      md.appendMarkdown(`\n\nNetwork constant for use with networking functions.`);
      md.appendMarkdown('\n\n*Network constant*');
      return md;
    }

    return null;
  }
}

