/**
 * Completion Provider for GML
 * Provides auto-completion for functions, variables, and constants
 * Including context-aware completion for instance variables and with() blocks
 */

import * as vscode from 'vscode';
import { gmlFunctions, gmlVariables } from './data/gmlFunctions';
import { VariableScanner, INSTANCE_RETURNING_FUNCTIONS } from './variableScanner';

export class GMLCompletionProvider implements vscode.CompletionItemProvider {
  private variableScanner: VariableScanner;

  constructor(variableScanner: VariableScanner) {
    this.variableScanner = variableScanner;
  }

  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const lineText = document.lineAt(position.line).text;
    const textBeforeCursor = lineText.substring(0, position.character);
    
    // Check if we're typing after a dot (instance property access)
    const dotAccessMatch = textBeforeCursor.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)?$/);
    if (dotAccessMatch) {
      return this.provideInstancePropertyCompletions(document, position, dotAccessMatch[1]);
    }
    
    // Check if we're inside a with() block
    const withContext = this.getWithContext(document, position);
    if (withContext) {
      return this.provideWithBlockCompletions(document, position, withContext);
    }

    const completions: vscode.CompletionItem[] = [];

    // Get the word being typed
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z_][a-zA-Z0-9_]*/);
    const prefix = wordRange ? document.getText(wordRange) : '';

    // Add built-in functions (including color/colour aliases)
    const addedFunctions = new Set<string>();
    for (const [name, func] of gmlFunctions) {
      // Add original function
      const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
      item.detail = func.signature;
      item.documentation = new vscode.MarkdownString(func.description);
      item.insertText = this.createFunctionSnippet(func.signature);
      item.sortText = '0' + name; // Prioritize built-in functions
      completions.push(item);
      addedFunctions.add(name);

      // Add American spelling alias if it contains "colour"
      if (name.includes('colour')) {
        const americanName = name.replace(/colour/g, 'color');
        if (!addedFunctions.has(americanName)) {
          const aliasItem = new vscode.CompletionItem(americanName, vscode.CompletionItemKind.Function);
          const aliasSignature = func.signature.replace(/colour/g, 'color');
          aliasItem.detail = aliasSignature;
          aliasItem.documentation = new vscode.MarkdownString(func.description);
          aliasItem.insertText = this.createFunctionSnippet(aliasSignature);
          aliasItem.sortText = '0' + americanName;
          completions.push(aliasItem);
          addedFunctions.add(americanName);
        }
      }
    }

    // Add built-in variables
    for (const [name, variable] of gmlVariables) {
      const kind = variable.scope === 'constant' 
        ? vscode.CompletionItemKind.Constant 
        : vscode.CompletionItemKind.Variable;
      
      const item = new vscode.CompletionItem(name, kind);
      item.detail = `${variable.type}${variable.readonly ? ' (readonly)' : ''}`;
      item.documentation = new vscode.MarkdownString(variable.description);
      item.sortText = '1' + name;
      completions.push(item);
    }

    // Add user-defined variables from context
    const config = vscode.workspace.getConfiguration('gml');
    if (config.get<boolean>('enableObjectContextVariables', true)) {
      const variables = this.variableScanner.getVariablesForFile(document.uri.fsPath);
      
      for (const variable of variables) {
        const item = new vscode.CompletionItem(variable.name, vscode.CompletionItemKind.Variable);
        item.detail = variable.type || 'any';
        
        if (variable.comment) {
          item.documentation = new vscode.MarkdownString(variable.comment);
        }
        
        if (variable.objectContext) {
          item.detail += ` (${variable.objectContext})`;
        }
        
        item.sortText = '2' + variable.name;
        completions.push(item);
      }
    }

    // Add user-defined scripts (global)
    this.addScripts(completions);

    // Add project assets (sprites, sounds, rooms, etc.)
    this.addAssets(completions);

    // Add common constants
    this.addConstants(completions);

    // Add keywords
    this.addKeywords(completions);

    return completions;
  }

  private addScripts(completions: vscode.CompletionItem[]): void {
    const scripts = this.variableScanner.getAllScripts();
    
    for (const script of scripts) {
      const item = new vscode.CompletionItem(script.name, vscode.CompletionItemKind.Function);
      item.detail = script.signature || `${script.name}()`;
      
      if (script.description) {
        item.documentation = new vscode.MarkdownString(script.description);
      }
      
      // Create snippet for parameters
      if (script.parameters && script.parameters.length > 0) {
        const params = script.parameters.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ');
        item.insertText = new vscode.SnippetString(`${script.name}(${params})`);
      } else {
        item.insertText = new vscode.SnippetString(`${script.name}()`);
      }
      
      item.sortText = '0' + script.name; // High priority for user scripts
      completions.push(item);
    }
  }

  private addAssets(completions: vscode.CompletionItem[]): void {
    const assets = this.variableScanner.getAllAssets();
    
    // Asset type to CompletionItemKind and icon mapping
    const assetKinds: Record<string, vscode.CompletionItemKind> = {
      'sprite': vscode.CompletionItemKind.File,
      'sound': vscode.CompletionItemKind.File,
      'room': vscode.CompletionItemKind.Module,
      'object': vscode.CompletionItemKind.Class,
      'font': vscode.CompletionItemKind.File,
      'path': vscode.CompletionItemKind.File,
      'timeline': vscode.CompletionItemKind.File,
      'tileset': vscode.CompletionItemKind.File,
      'script': vscode.CompletionItemKind.Function
    };
    
    for (const asset of assets) {
      // Skip scripts as they're handled separately
      if (asset.type === 'script') continue;
      
      const kind = assetKinds[asset.type] || vscode.CompletionItemKind.File;
      const item = new vscode.CompletionItem(asset.name, kind);
      
      const typeLabel = asset.type.charAt(0).toUpperCase() + asset.type.slice(1);
      item.detail = `${typeLabel} Asset`;
      item.documentation = new vscode.MarkdownString(asset.description || `${typeLabel}: ${asset.name}`);
      item.sortText = '1' + asset.name; // After functions but before variables
      
      completions.push(item);
    }
  }

  private createFunctionSnippet(signature: string): vscode.SnippetString {
    // Parse the signature to create a snippet
    const match = signature.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/);
    
    if (!match) {
      return new vscode.SnippetString(signature);
    }

    const funcName = match[1];
    const paramsStr = match[2];

    if (!paramsStr || paramsStr.trim() === '') {
      return new vscode.SnippetString(`${funcName}()`);
    }

    // Split parameters and handle optional ones
    const params = paramsStr.split(',').map(p => p.trim());
    const snippetParams: string[] = [];

    let tabStop = 1;
    for (const param of params) {
      // Skip variadic params (...) - just add placeholder
      if (param.includes('...')) {
        snippetParams.push(`\${${tabStop}:${param.replace('...', '')}}`);
        tabStop++;
        continue;
      }

      // Handle optional parameters (with ?)
      if (param.includes('?') || param.includes('*')) {
        continue; // Skip optional for initial snippet
      }

      // Clean up parameter name
      const cleanParam = param.replace(/[*?]/g, '').trim();
      snippetParams.push(`\${${tabStop}:${cleanParam}}`);
      tabStop++;
    }

    return new vscode.SnippetString(`${funcName}(${snippetParams.join(', ')})`);
  }

  private addConstants(completions: vscode.CompletionItem[]): void {
    // Color constants
    const colors = [
      'c_aqua', 'c_black', 'c_blue', 'c_dkgray', 'c_fuchsia', 'c_gray', 
      'c_green', 'c_lime', 'c_ltgray', 'c_maroon', 'c_navy', 'c_olive', 
      'c_purple', 'c_red', 'c_silver', 'c_teal', 'c_white', 'c_yellow', 'c_orange'
    ];

    for (const color of colors) {
      const item = new vscode.CompletionItem(color, vscode.CompletionItemKind.Color);
      item.detail = 'Color constant';
      item.sortText = '3' + color;
      completions.push(item);
    }

    // Virtual key constants
    const vkeys = [
      'vk_nokey', 'vk_anykey', 'vk_enter', 'vk_return', 'vk_shift', 'vk_control',
      'vk_alt', 'vk_escape', 'vk_space', 'vk_backspace', 'vk_tab', 'vk_pause',
      'vk_printscreen', 'vk_left', 'vk_right', 'vk_up', 'vk_down', 'vk_home',
      'vk_end', 'vk_delete', 'vk_insert', 'vk_pageup', 'vk_pagedown',
      'vk_f1', 'vk_f2', 'vk_f3', 'vk_f4', 'vk_f5', 'vk_f6', 'vk_f7', 'vk_f8',
      'vk_f9', 'vk_f10', 'vk_f11', 'vk_f12',
      'vk_numpad0', 'vk_numpad1', 'vk_numpad2', 'vk_numpad3', 'vk_numpad4',
      'vk_numpad5', 'vk_numpad6', 'vk_numpad7', 'vk_numpad8', 'vk_numpad9',
      'vk_divide', 'vk_multiply', 'vk_subtract', 'vk_add', 'vk_decimal',
      'vk_lshift', 'vk_lcontrol', 'vk_lalt', 'vk_rshift', 'vk_rcontrol', 'vk_ralt'
    ];

    for (const vk of vkeys) {
      const item = new vscode.CompletionItem(vk, vscode.CompletionItemKind.Constant);
      item.detail = 'Virtual key constant';
      item.sortText = '3' + vk;
      completions.push(item);
    }

    // Mouse button constants
    const mouseButtons = ['mb_left', 'mb_right', 'mb_middle', 'mb_any', 'mb_none'];
    for (const mb of mouseButtons) {
      const item = new vscode.CompletionItem(mb, vscode.CompletionItemKind.Constant);
      item.detail = 'Mouse button constant';
      item.sortText = '3' + mb;
      completions.push(item);
    }

    // Alignment constants
    const alignments = ['fa_left', 'fa_center', 'fa_right', 'fa_top', 'fa_middle', 'fa_bottom'];
    for (const fa of alignments) {
      const item = new vscode.CompletionItem(fa, vscode.CompletionItemKind.Constant);
      item.detail = 'Text alignment constant';
      item.sortText = '3' + fa;
      completions.push(item);
    }

    // Event constants
    const events = [
      'ev_create', 'ev_destroy', 'ev_step', 'ev_alarm', 'ev_keyboard', 'ev_mouse',
      'ev_collision', 'ev_other', 'ev_draw', 'ev_draw_begin', 'ev_draw_end',
      'ev_draw_pre', 'ev_draw_post', 'ev_keypress', 'ev_keyrelease',
      'ev_left_button', 'ev_right_button', 'ev_middle_button',
      'ev_step_normal', 'ev_step_begin', 'ev_step_end',
      'ev_gui', 'ev_gui_begin', 'ev_gui_end',
      'ev_room_start', 'ev_room_end', 'ev_game_start', 'ev_game_end',
      'ev_animation_end', 'ev_end_of_path',
      'ev_user0', 'ev_user1', 'ev_user2', 'ev_user3', 'ev_user4',
      'ev_user5', 'ev_user6', 'ev_user7', 'ev_user8', 'ev_user9',
      'ev_user10', 'ev_user11', 'ev_user12', 'ev_user13', 'ev_user14', 'ev_user15'
    ];

    for (const ev of events) {
      const item = new vscode.CompletionItem(ev, vscode.CompletionItemKind.Constant);
      item.detail = 'Event constant';
      item.sortText = '3' + ev;
      completions.push(item);
    }

    // Blend mode constants
    const blendModes = [
      'bm_normal', 'bm_add', 'bm_subtract', 'bm_max', 'bm_complex',
      'bm_zero', 'bm_one', 'bm_src_color', 'bm_inv_src_color',
      'bm_src_alpha', 'bm_inv_src_alpha', 'bm_dest_alpha', 'bm_inv_dest_alpha',
      'bm_dest_color', 'bm_inv_dest_color', 'bm_src_alpha_sat'
    ];

    for (const bm of blendModes) {
      const item = new vscode.CompletionItem(bm, vscode.CompletionItemKind.Constant);
      item.detail = 'Blend mode constant';
      item.sortText = '3' + bm;
      completions.push(item);
    }

    // Primitive type constants
    const primitives = [
      'pr_pointlist', 'pr_linelist', 'pr_linestrip',
      'pr_trianglelist', 'pr_trianglestrip', 'pr_trianglefan'
    ];

    for (const pr of primitives) {
      const item = new vscode.CompletionItem(pr, vscode.CompletionItemKind.Constant);
      item.detail = 'Primitive type constant';
      item.sortText = '3' + pr;
      completions.push(item);
    }

    // Buffer constants
    const bufferTypes = [
      'buffer_fixed', 'buffer_grow', 'buffer_wrap', 'buffer_fast', 'buffer_vbuffer',
      'buffer_u8', 'buffer_s8', 'buffer_u16', 'buffer_s16', 'buffer_u32', 'buffer_s32',
      'buffer_u64', 'buffer_f16', 'buffer_f32', 'buffer_f64',
      'buffer_bool', 'buffer_text', 'buffer_string',
      'buffer_seek_start', 'buffer_seek_relative', 'buffer_seek_end'
    ];

    for (const buf of bufferTypes) {
      const item = new vscode.CompletionItem(buf, vscode.CompletionItemKind.Constant);
      item.detail = 'Buffer constant';
      item.sortText = '3' + buf;
      completions.push(item);
    }

    // Data structure type constants
    const dsTypes = [
      'ds_type_map', 'ds_type_list', 'ds_type_stack',
      'ds_type_queue', 'ds_type_grid', 'ds_type_priority'
    ];

    for (const ds of dsTypes) {
      const item = new vscode.CompletionItem(ds, vscode.CompletionItemKind.Constant);
      item.detail = 'Data structure type constant';
      item.sortText = '3' + ds;
      completions.push(item);
    }

    // OS constants
    const osTypes = [
      'os_windows', 'os_macosx', 'os_linux', 'os_ios', 'os_android',
      'os_unknown', 'os_uwp', 'os_ps4', 'os_xboxone'
    ];

    for (const os of osTypes) {
      const item = new vscode.CompletionItem(os, vscode.CompletionItemKind.Constant);
      item.detail = 'OS constant';
      item.sortText = '3' + os;
      completions.push(item);
    }

    // Gamepad constants
    const gamepadButtons = [
      'gp_face1', 'gp_face2', 'gp_face3', 'gp_face4',
      'gp_shoulderl', 'gp_shoulderr', 'gp_shoulderlb', 'gp_shoulderrb',
      'gp_select', 'gp_start', 'gp_stickl', 'gp_stickr',
      'gp_padu', 'gp_padd', 'gp_padl', 'gp_padr',
      'gp_axislh', 'gp_axislv', 'gp_axisrh', 'gp_axisrv'
    ];

    for (const gp of gamepadButtons) {
      const item = new vscode.CompletionItem(gp, vscode.CompletionItemKind.Constant);
      item.detail = 'Gamepad constant';
      item.sortText = '3' + gp;
      completions.push(item);
    }

    // Asset type constants
    const assetTypes = [
      'asset_object', 'asset_sprite', 'asset_sound', 'asset_room',
      'asset_path', 'asset_script', 'asset_font', 'asset_timeline',
      'asset_tiles', 'asset_shader', 'asset_unknown'
    ];

    for (const at of assetTypes) {
      const item = new vscode.CompletionItem(at, vscode.CompletionItemKind.Constant);
      item.detail = 'Asset type constant';
      item.sortText = '3' + at;
      completions.push(item);
    }

    // Layer element type constants
    const layerTypes = [
      'layerelementtype_undefined', 'layerelementtype_background',
      'layerelementtype_instance', 'layerelementtype_oldtilemap',
      'layerelementtype_sprite', 'layerelementtype_tilemap',
      'layerelementtype_particlesystem', 'layerelementtype_tile'
    ];

    for (const lt of layerTypes) {
      const item = new vscode.CompletionItem(lt, vscode.CompletionItemKind.Constant);
      item.detail = 'Layer element type constant';
      item.sortText = '3' + lt;
      completions.push(item);
    }

    // Network constants
    const networkTypes = [
      'network_socket_tcp', 'network_socket_udp', 'network_socket_bluetooth',
      'network_type_connect', 'network_type_disconnect', 'network_type_data',
      'network_type_non_blocking_connect'
    ];

    for (const nt of networkTypes) {
      const item = new vscode.CompletionItem(nt, vscode.CompletionItemKind.Constant);
      item.detail = 'Network constant';
      item.sortText = '3' + nt;
      completions.push(item);
    }
  }

  private addKeywords(completions: vscode.CompletionItem[]): void {
    const keywords = [
      'if', 'else', 'for', 'while', 'do', 'until', 'repeat', 'switch',
      'case', 'default', 'break', 'continue', 'return', 'exit', 'with',
      'var', 'globalvar', 'enum', 'function', 'constructor', 'new',
      'delete', 'try', 'catch', 'finally', 'throw', 'static',
      'and', 'or', 'xor', 'not', 'mod', 'div',
      'begin', 'end', 'then'
    ];

    for (const keyword of keywords) {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      item.detail = 'Keyword';
      item.sortText = '4' + keyword;
      completions.push(item);
    }

    // Special values
    const specialValues = ['true', 'false', 'undefined', 'noone', 'self', 'other', 'all', 'global'];
    for (const sv of specialValues) {
      const item = new vscode.CompletionItem(sv, vscode.CompletionItemKind.Keyword);
      item.detail = 'Special value';
      item.sortText = '4' + sv;
      completions.push(item);
    }
  }

  /**
   * Provide completions when typing after a dot (e.g., collision.x)
   */
  private provideInstancePropertyCompletions(
    document: vscode.TextDocument,
    position: vscode.Position,
    variableName: string
  ): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Get the object type for this variable
    const objectType = this.variableScanner.getInstanceVariableType(variableName, document.uri.fsPath);
    
    if (objectType) {
      // Add variables from the object (including inheritance and children if parent)
      const objVars = this.variableScanner.getObjectVariables(objectType, true);
      
      for (const v of objVars) {
        const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Property);
        item.detail = v.type || 'any';
        
        if (v.objectContext) {
          item.detail += ` (${v.objectContext})`;
        }
        
        if (v.comment) {
          item.documentation = new vscode.MarkdownString(v.comment);
        }
        
        item.sortText = '0' + v.name;
        completions.push(item);
      }
      
      // Also add built-in instance variables
      this.addBuiltInInstanceVariables(completions);
    } else {
      // If we don't know the type, just add built-in instance variables
      this.addBuiltInInstanceVariables(completions);
    }
    
    return completions;
  }

  /**
   * Add built-in instance variables to completions
   */
  private addBuiltInInstanceVariables(completions: vscode.CompletionItem[]): void {
    for (const [name, variable] of gmlVariables) {
      if (variable.scope === 'instance') {
        const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
        item.detail = variable.type + (variable.readonly ? ' (readonly)' : '');
        item.documentation = new vscode.MarkdownString(variable.description);
        item.sortText = '1' + name;
        completions.push(item);
      }
    }
  }

  /**
   * Get the with() block context if cursor is inside one
   * Returns the object/variable being referenced in with()
   */
  private getWithContext(document: vscode.TextDocument, position: vscode.Position): string | null {
    const text = document.getText();
    const offset = document.offsetAt(position);
    
    // Track brace depth to find matching with() blocks
    let braceDepth = 0;
    let inWith = false;
    let withTarget = '';
    let withStack: string[] = [];
    
    // Parse from the beginning to cursor position
    let i = 0;
    while (i < offset) {
      // Skip strings
      if (text[i] === '"' || text[i] === "'") {
        const quote = text[i];
        i++;
        while (i < offset && text[i] !== quote) {
          if (text[i] === '\\') i++; // Skip escaped chars
          i++;
        }
        i++;
        continue;
      }
      
      // Skip single-line comments
      if (text[i] === '/' && text[i + 1] === '/') {
        while (i < offset && text[i] !== '\n') i++;
        i++;
        continue;
      }
      
      // Skip multi-line comments
      if (text[i] === '/' && text[i + 1] === '*') {
        i += 2;
        while (i < offset - 1 && !(text[i] === '*' && text[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      
      // Check for 'with' keyword
      if (text.substring(i, i + 4) === 'with' && !/[a-zA-Z0-9_]/.test(text[i + 4] || '')) {
        // Find the target in parentheses
        let j = i + 4;
        while (j < offset && text[j] !== '(') j++;
        
        if (text[j] === '(') {
          j++;
          let parenDepth = 1;
          let targetStart = j;
          
          while (j < offset && parenDepth > 0) {
            if (text[j] === '(') parenDepth++;
            else if (text[j] === ')') parenDepth--;
            j++;
          }
          
          if (parenDepth === 0) {
            withTarget = text.substring(targetStart, j - 1).trim();
            i = j;
            continue;
          }
        }
      }
      
      // Track braces
      if (text[i] === '{') {
        braceDepth++;
        if (withTarget) {
          withStack.push(withTarget);
          withTarget = '';
        }
      } else if (text[i] === '}') {
        braceDepth--;
        if (withStack.length > 0 && braceDepth < withStack.length) {
          withStack.pop();
        }
      }
      
      i++;
    }
    
    // Return the innermost with context
    if (withStack.length > 0) {
      return withStack[withStack.length - 1];
    }
    
    return null;
  }

  /**
   * Provide completions inside a with() block
   */
  private provideWithBlockCompletions(
    document: vscode.TextDocument,
    position: vscode.Position,
    withTarget: string
  ): vscode.CompletionItem[] {
    const completions: vscode.CompletionItem[] = [];
    
    // Determine if withTarget is an object or a variable referencing an instance
    let objectName = withTarget;
    
    // Check if it's a variable that holds an instance
    const instanceType = this.variableScanner.getInstanceVariableType(withTarget, document.uri.fsPath);
    if (instanceType) {
      objectName = instanceType;
    }
    
    // Check if the object exists
    if (this.variableScanner.objectExists(objectName)) {
      // Add variables from the object (including inheritance and children)
      const objVars = this.variableScanner.getObjectVariables(objectName, true);
      
      for (const v of objVars) {
        const item = new vscode.CompletionItem(v.name, vscode.CompletionItemKind.Variable);
        item.detail = v.type || 'any';
        
        if (v.objectContext) {
          item.detail += ` (${v.objectContext})`;
        }
        
        if (v.comment) {
          item.documentation = new vscode.MarkdownString(v.comment);
        }
        
        item.sortText = '0' + v.name;
        completions.push(item);
      }
    }
    
    // Add built-in instance variables
    this.addBuiltInInstanceVariables(completions);
    
    // Also add regular completions (functions, constants, etc.)
    this.addBuiltInFunctions(completions);
    this.addConstants(completions);
    this.addKeywords(completions);
    
    return completions;
  }

  /**
   * Add built-in functions to completions (extracted for reuse)
   */
  private addBuiltInFunctions(completions: vscode.CompletionItem[]): void {
    const addedFunctions = new Set<string>();
    
    for (const [name, func] of gmlFunctions) {
      const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
      item.detail = func.signature;
      item.documentation = new vscode.MarkdownString(func.description);
      item.insertText = this.createFunctionSnippet(func.signature);
      item.sortText = '2' + name;
      completions.push(item);
      addedFunctions.add(name);

      if (name.includes('colour')) {
        const americanName = name.replace(/colour/g, 'color');
        if (!addedFunctions.has(americanName)) {
          const aliasItem = new vscode.CompletionItem(americanName, vscode.CompletionItemKind.Function);
          const aliasSignature = func.signature.replace(/colour/g, 'color');
          aliasItem.detail = aliasSignature;
          aliasItem.documentation = new vscode.MarkdownString(func.description);
          aliasItem.insertText = this.createFunctionSnippet(aliasSignature);
          aliasItem.sortText = '2' + americanName;
          completions.push(aliasItem);
          addedFunctions.add(americanName);
        }
      }
    }
  }

  resolveCompletionItem(
    item: vscode.CompletionItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem> {
    // Could add more detailed documentation here if needed
    return item;
  }
}

