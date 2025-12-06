/**
 * Variable Scanner for GML
 * Scans GML files within object contexts to find variable declarations and their comments
 * Also scans for project assets (scripts, sprites, sounds, rooms)
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface ScannedVariable {
  name: string;
  type?: string;
  comment?: string;
  file: string;
  line: number;
  objectContext?: string;
}

export interface ObjectContext {
  name: string;
  path: string;
  variables: Map<string, ScannedVariable>;
}

export interface ScannedAsset {
  name: string;
  type: 'sprite' | 'sound' | 'room' | 'script' | 'object' | 'font' | 'path' | 'timeline' | 'tileset';
  path: string;
  description?: string;
}

export interface ScannedScript {
  name: string;
  path: string;
  signature?: string;
  description?: string;
  parameters?: { name: string; type: string; description: string }[];
}

export interface ObjectInfo {
  name: string;
  path: string;
  parentObjectName?: string;
  parentObjectPath?: string;
  variables: Map<string, ScannedVariable>;
}

export interface InstanceVariable {
  name: string;
  objectType: string;
  file: string;
  line: number;
}

// Functions that return instance IDs - key: function name, value: parameter index containing object type
export const INSTANCE_RETURNING_FUNCTIONS: Map<string, number> = new Map([
  // Collision functions
  ['instance_place', 2],           // instance_place(x, y, obj)
  ['instance_place_list', 2],      // instance_place_list(x, y, obj, list, ordered)
  ['instance_position', 2],        // instance_position(x, y, obj)
  ['instance_position_list', 2],   // instance_position_list(x, y, obj, list, ordered)
  ['instance_nearest', 2],         // instance_nearest(x, y, obj)
  ['instance_furthest', 2],        // instance_furthest(x, y, obj)
  ['instance_find', 1],            // instance_find(obj, n)
  ['collision_point', 2],          // collision_point(x, y, obj, prec, notme)
  ['collision_rectangle', 4],      // collision_rectangle(x1, y1, x2, y2, obj, prec, notme)
  ['collision_circle', 3],         // collision_circle(x, y, radius, obj, prec, notme)
  ['collision_ellipse', 4],        // collision_ellipse(x1, y1, x2, y2, obj, prec, notme)
  ['collision_line', 4],           // collision_line(x1, y1, x2, y2, obj, prec, notme)
  ['collision_point_list', 2],     // collision_point_list(x, y, obj, prec, notme, list, ordered)
  ['collision_rectangle_list', 4], // collision_rectangle_list(...)
  ['collision_circle_list', 3],    // collision_circle_list(...)
  ['collision_ellipse_list', 4],   // collision_ellipse_list(...)
  ['collision_line_list', 4],      // collision_line_list(...)
  // Instance creation
  ['instance_create_layer', 3],    // instance_create_layer(x, y, layer, obj)
  ['instance_create_depth', 3],    // instance_create_depth(x, y, depth, obj)
  // Misc
  ['instance_id_get', 1],          // instance_id_get(obj, n) - 0-indexed
]);

export class VariableScanner {
  private objectContexts: Map<string, ObjectContext> = new Map();
  private globalVariables: Map<string, ScannedVariable> = new Map();
  private assets: Map<string, ScannedAsset> = new Map();
  private scripts: Map<string, ScannedScript> = new Map();
  private fileWatcher: vscode.FileSystemWatcher | undefined;
  private assetWatcher: vscode.FileSystemWatcher | undefined;
  
  // Object hierarchy - maps object name to its info including parent
  private objectHierarchy: Map<string, ObjectInfo> = new Map();
  
  // Instance variable tracking - maps "file:variableName" to object type
  private instanceVariables: Map<string, InstanceVariable> = new Map();
  
  // Script-local variables - maps script file path to its local variables
  private scriptVariables: Map<string, Map<string, ScannedVariable>> = new Map();

  constructor() {
    this.setupFileWatcher();
  }

  private setupFileWatcher(): void {
    // Watch for GML file changes
    this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.gml');
    
    this.fileWatcher.onDidChange(uri => this.scanFile(uri.fsPath));
    this.fileWatcher.onDidCreate(uri => this.scanFile(uri.fsPath));
    this.fileWatcher.onDidDelete(uri => this.removeFile(uri.fsPath));

    // Watch for asset folder changes
    this.assetWatcher = vscode.workspace.createFileSystemWatcher('**/{sprites,sounds,rooms,scripts,objects,fonts,paths,timelines,tilesets}/*');
    
    this.assetWatcher.onDidCreate(() => this.scanAssets());
    this.assetWatcher.onDidDelete(() => this.scanAssets());
  }

  /**
   * Get the object context for a given file path
   */
  public getObjectContextFromPath(filePath: string): string | undefined {
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Match pattern: objects/<object_name>/*.gml
    const objectMatch = normalizedPath.match(/objects\/([^/]+)\//i);
    if (objectMatch) {
      return objectMatch[1];
    }
    
    return undefined;
  }

  /**
   * Get the script context for a given file path
   * Returns the script name if the file is inside scripts/<script_name>/
   */
  public getScriptContextFromPath(filePath: string): string | undefined {
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Match pattern: scripts/<script_name>/*.gml
    const scriptMatch = normalizedPath.match(/scripts\/([^/]+)\//i);
    if (scriptMatch) {
      return scriptMatch[1];
    }
    
    return undefined;
  }

  /**
   * Scan all GML files and assets in the workspace
   */
  public async scanWorkspace(): Promise<void> {
    // First, scan object hierarchy from .yy files
    await this.scanObjectHierarchy();
    
    // Scan GML files
    const files = await vscode.workspace.findFiles('**/*.gml');
    
    for (const file of files) {
      await this.scanFile(file.fsPath);
    }

    // Scan assets
    await this.scanAssets();
  }

  /**
   * Scan all .yy files in objects folder to build object hierarchy
   */
  private async scanObjectHierarchy(): Promise<void> {
    this.objectHierarchy.clear();
    
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    for (const folder of workspaceFolders) {
      const objectsPath = path.join(folder.uri.fsPath, 'objects');
      
      if (!fs.existsSync(objectsPath)) continue;

      try {
        const objectFolders = fs.readdirSync(objectsPath, { withFileTypes: true });
        
        for (const objFolder of objectFolders) {
          if (!objFolder.isDirectory()) continue;
          
          const objName = objFolder.name;
          const yyFilePath = path.join(objectsPath, objName, `${objName}.yy`);
          
          if (fs.existsSync(yyFilePath)) {
            try {
              const yyContent = fs.readFileSync(yyFilePath, 'utf8');
              const yyData = JSON.parse(yyContent);
              
              const objectInfo: ObjectInfo = {
                name: objName,
                path: path.join(objectsPath, objName),
                variables: new Map()
              };
              
              // Extract parent object info
              if (yyData.parentObjectId && yyData.parentObjectId.name) {
                objectInfo.parentObjectName = yyData.parentObjectId.name;
                objectInfo.parentObjectPath = yyData.parentObjectId.path;
              }
              
              this.objectHierarchy.set(objName, objectInfo);
            } catch (e) {
              // JSON parse error, skip this file
            }
          }
        }
      } catch (e) {
        // Directory read error
      }
    }
  }

  /**
   * Get all child objects of a parent (recursively)
   */
  public getChildObjects(parentName: string): string[] {
    const children: string[] = [];
    
    for (const [objName, objInfo] of this.objectHierarchy) {
      if (objInfo.parentObjectName === parentName) {
        children.push(objName);
        // Recursively get grandchildren
        children.push(...this.getChildObjects(objName));
      }
    }
    
    return children;
  }

  /**
   * Get parent object chain (from child up to root)
   */
  public getParentChain(objectName: string): string[] {
    const parents: string[] = [];
    let current = objectName;
    
    while (current) {
      const objInfo = this.objectHierarchy.get(current);
      if (objInfo && objInfo.parentObjectName) {
        parents.push(objInfo.parentObjectName);
        current = objInfo.parentObjectName;
      } else {
        break;
      }
    }
    
    return parents;
  }

  /**
   * Get all variables for an object (including inherited from parents)
   */
  public getObjectVariables(objectName: string, includeChildren: boolean = false): ScannedVariable[] {
    const variables: ScannedVariable[] = [];
    const addedVars = new Set<string>();
    
    // Get variables from this object
    const context = this.objectContexts.get(objectName);
    if (context) {
      for (const v of context.variables.values()) {
        if (!addedVars.has(v.name)) {
          variables.push(v);
          addedVars.add(v.name);
        }
      }
    }
    
    // Get inherited variables from parent chain
    const parents = this.getParentChain(objectName);
    for (const parent of parents) {
      const parentContext = this.objectContexts.get(parent);
      if (parentContext) {
        for (const v of parentContext.variables.values()) {
          if (!addedVars.has(v.name)) {
            variables.push({ ...v, objectContext: `${v.objectContext} (inherited from ${parent})` });
            addedVars.add(v.name);
          }
        }
      }
    }
    
    // If requested, also include variables from child objects
    if (includeChildren) {
      const children = this.getChildObjects(objectName);
      for (const child of children) {
        const childContext = this.objectContexts.get(child);
        if (childContext) {
          for (const v of childContext.variables.values()) {
            if (!addedVars.has(v.name)) {
              variables.push({ ...v, objectContext: `${v.objectContext} (from child ${child})` });
              addedVars.add(v.name);
            }
          }
        }
      }
    }
    
    return variables;
  }

  /**
   * Scan project assets (sprites, sounds, rooms, scripts)
   */
  public async scanAssets(): Promise<void> {
    this.assets.clear();
    this.scripts.clear();

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;

    for (const folder of workspaceFolders) {
      const basePath = folder.uri.fsPath;

      // Scan sprites
      await this.scanAssetFolder(basePath, 'sprites', 'sprite');
      
      // Scan sounds
      await this.scanAssetFolder(basePath, 'sounds', 'sound');
      
      // Scan rooms
      await this.scanAssetFolder(basePath, 'rooms', 'room');
      
      // Scan scripts (special handling for function extraction)
      await this.scanScriptsFolder(basePath);
      
      // Scan objects
      await this.scanAssetFolder(basePath, 'objects', 'object');
      
      // Scan fonts
      await this.scanAssetFolder(basePath, 'fonts', 'font');
      
      // Scan paths
      await this.scanAssetFolder(basePath, 'paths', 'path');
      
      // Scan timelines
      await this.scanAssetFolder(basePath, 'timelines', 'timeline');
      
      // Scan tilesets
      await this.scanAssetFolder(basePath, 'tilesets', 'tileset');
    }
  }

  /**
   * Scan a specific asset folder
   */
  private async scanAssetFolder(basePath: string, folderName: string, assetType: ScannedAsset['type']): Promise<void> {
    const assetPath = path.join(basePath, folderName);
    
    if (!fs.existsSync(assetPath)) return;

    try {
      const entries = fs.readdirSync(assetPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const assetName = entry.name;
          const fullPath = path.join(assetPath, assetName);
          
          this.assets.set(assetName, {
            name: assetName,
            type: assetType,
            path: fullPath,
            description: `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} asset: ${assetName}`
          });
        }
      }
    } catch (error) {
      // Folder doesn't exist or can't be read, skip silently
    }
  }

  /**
   * Scan scripts folder for global scripts
   */
  private async scanScriptsFolder(basePath: string): Promise<void> {
    const scriptsPath = path.join(basePath, 'scripts');
    
    if (!fs.existsSync(scriptsPath)) return;

    try {
      const entries = fs.readdirSync(scriptsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const scriptName = entry.name;
          const scriptFolder = path.join(scriptsPath, scriptName);
          const scriptFile = path.join(scriptFolder, `${scriptName}.gml`);
          
          if (fs.existsSync(scriptFile)) {
            const scriptInfo = this.parseScriptFile(scriptFile, scriptName);
            this.scripts.set(scriptName, scriptInfo);
            
            // Also add as asset for completeness
            this.assets.set(scriptName, {
              name: scriptName,
              type: 'script',
              path: scriptFile,
              description: scriptInfo.description || `Script function: ${scriptName}`
            });
          }
        }
      }
    } catch (error) {
      // Folder doesn't exist or can't be read, skip silently
    }
  }

  /**
   * Parse a script file to extract function info
   */
  private parseScriptFile(filePath: string, scriptName: string): ScannedScript {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      let description = '';
      let signature = `${scriptName}()`;
      const parameters: { name: string; type: string; description: string }[] = [];
      
      // Look for JSDoc-style comments and function declaration
      let inDocComment = false;
      let docLines: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // JSDoc comment start
        if (line.startsWith('///') || line.startsWith('/**')) {
          inDocComment = true;
          docLines = [];
          const commentText = line.replace(/^\/\/\/\s*|^\/\*\*\s*/, '').trim();
          if (commentText) {
            docLines.push(commentText);
          }
          continue;
        }
        
        // Inside doc comment
        if (inDocComment) {
          if (line.startsWith('//') || line.startsWith('*')) {
            const commentText = line.replace(/^\/\/\s*|^\*\s*|^\*\/\s*/, '').trim();
            
            // Parse @param tags
            const paramMatch = commentText.match(/@param\s+(?:\{([^}]+)\})?\s*(\w+)\s*(.*)/);
            if (paramMatch) {
              parameters.push({
                name: paramMatch[2],
                type: paramMatch[1] || 'any',
                description: paramMatch[3] || ''
              });
            } else if (commentText.startsWith('@description')) {
              description = commentText.replace('@description', '').trim();
            } else if (!commentText.startsWith('@') && commentText) {
              docLines.push(commentText);
            }
            
            if (line.includes('*/')) {
              inDocComment = false;
            }
            continue;
          }
          inDocComment = false;
        }
        
        // Look for function declaration
        const funcMatch = line.match(/^function\s+(\w+)\s*\(([^)]*)\)/);
        if (funcMatch) {
          signature = `${funcMatch[1]}(${funcMatch[2]})`;
          
          // Parse parameters from function declaration if not from JSDoc
          if (parameters.length === 0 && funcMatch[2]) {
            const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
            for (const param of params) {
              const paramName = param.replace(/\s*=.*$/, '').trim();
              if (paramName) {
                parameters.push({
                  name: paramName,
                  type: 'any',
                  description: ''
                });
              }
            }
          }
          break;
        }
        
        // Also match scriptName = function() style
        const scriptFuncMatch = line.match(new RegExp(`^${scriptName}\\s*=\\s*function\\s*\\(([^)]*)\\)`));
        if (scriptFuncMatch) {
          signature = `${scriptName}(${scriptFuncMatch[1]})`;
          break;
        }
      }
      
      // Use doc lines as description if no @description
      if (!description && docLines.length > 0) {
        description = docLines.join(' ').trim();
      }
      
      return {
        name: scriptName,
        path: filePath,
        signature,
        description: description || `Script function: ${scriptName}`,
        parameters
      };
      
    } catch (error) {
      return {
        name: scriptName,
        path: filePath,
        signature: `${scriptName}()`,
        description: `Script function: ${scriptName}`
      };
    }
  }

  /**
   * Scan a single GML file for variable declarations
   */
  public async scanFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const objectContext = this.getObjectContextFromPath(filePath);
      const scriptContext = this.getScriptContextFromPath(filePath);
      
      // Initialize or get object context
      let context: ObjectContext | undefined;
      if (objectContext) {
        if (!this.objectContexts.has(objectContext)) {
          this.objectContexts.set(objectContext, {
            name: objectContext,
            path: path.dirname(filePath),
            variables: new Map()
          });
        }
        context = this.objectContexts.get(objectContext);
      }

      // Initialize script variables map for this file
      if (scriptContext) {
        // Clear existing variables for this script file
        this.scriptVariables.set(filePath, new Map());
      }

      // Clear previous instance variables for this file
      for (const [key, iv] of this.instanceVariables) {
        if (iv.file === filePath) {
          this.instanceVariables.delete(key);
        }
      }

      let currentComment = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Collect comments for variables
        if (trimmedLine.startsWith('///') || trimmedLine.startsWith('//')) {
          // JSDoc-style comment or regular comment
          currentComment = trimmedLine.replace(/^\/\/\/?/, '').trim();
          
          // Check for multi-line comments by looking ahead
          let j = i + 1;
          while (j < lines.length && (lines[j].trim().startsWith('///') || lines[j].trim().startsWith('//'))) {
            const nextComment = lines[j].trim().replace(/^\/\/\/?/, '').trim();
            if (!this.isVariableDeclaration(lines[j])) {
              currentComment += '\n' + nextComment;
            }
            j++;
          }
          continue;
        }
        
        // Check for instance-returning function assignments
        this.parseInstanceAssignment(line, i + 1, filePath);
        
        // Check for variable declarations
        const variable = this.parseVariableDeclaration(line, i + 1, filePath, currentComment);
        
        if (variable) {
          variable.objectContext = objectContext;
          
          // Store in appropriate context
          if (this.isGlobalVariable(line)) {
            this.globalVariables.set(variable.name, variable);
          } else if (context) {
            context.variables.set(variable.name, variable);
          } else if (scriptContext) {
            // Store script-local variables
            const scriptVars = this.scriptVariables.get(filePath);
            if (scriptVars) {
              variable.objectContext = `script: ${scriptContext}`;
              scriptVars.set(variable.name, variable);
            }
          }
        }
        
        // Reset comment if we processed a non-comment line
        if (!trimmedLine.startsWith('//') && trimmedLine.length > 0) {
          currentComment = '';
        }
      }
    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error);
    }
  }

  /**
   * Parse an instance assignment like: var colision = instance_place(x, y, obj_plataforma)
   */
  private parseInstanceAssignment(line: string, lineNumber: number, filePath: string): void {
    const trimmed = line.trim();
    
    // Match patterns like: var name = function(...) or name = function(...)
    for (const [funcName, paramIndex] of INSTANCE_RETURNING_FUNCTIONS) {
      // Regex to match: (var )? variableName = funcName(...)
      const regex = new RegExp(
        `(?:var\\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\\s*=\\s*${funcName}\\s*\\(([^)]*)\\)`,
        'i'
      );
      
      const match = trimmed.match(regex);
      if (match) {
        const variableName = match[1];
        const paramsStr = match[2];
        
        // Parse the parameters
        const params = this.parseParameters(paramsStr);
        
        // Get the object type from the relevant parameter
        if (params.length > paramIndex) {
          const objectType = params[paramIndex].trim();
          
          // Verify it looks like an object reference
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(objectType)) {
            const key = `${filePath}:${variableName}`;
            this.instanceVariables.set(key, {
              name: variableName,
              objectType: objectType,
              file: filePath,
              line: lineNumber
            });
          }
        }
      }
    }
  }

  /**
   * Parse function parameters (handling nested parentheses and commas)
   */
  private parseParameters(paramsStr: string): string[] {
    const params: string[] = [];
    let current = '';
    let depth = 0;
    
    for (const char of paramsStr) {
      if (char === '(' || char === '[' || char === '{') {
        depth++;
        current += char;
      } else if (char === ')' || char === ']' || char === '}') {
        depth--;
        current += char;
      } else if (char === ',' && depth === 0) {
        params.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      params.push(current.trim());
    }
    
    return params;
  }

  /**
   * Get the object type associated with a variable in a file
   */
  public getInstanceVariableType(variableName: string, filePath: string): string | undefined {
    const key = `${filePath}:${variableName}`;
    const instanceVar = this.instanceVariables.get(key);
    return instanceVar?.objectType;
  }

  /**
   * Get all instance variables for a file
   */
  public getInstanceVariablesForFile(filePath: string): InstanceVariable[] {
    const result: InstanceVariable[] = [];
    
    for (const [key, iv] of this.instanceVariables) {
      if (iv.file === filePath) {
        result.push(iv);
      }
    }
    
    return result;
  }

  private isVariableDeclaration(line: string): boolean {
    const trimmed = line.trim();
    return /^(var\s+)?[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed) ||
           /^self\.[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed);
  }

  private isGlobalVariable(line: string): boolean {
    return line.includes('globalvar') || line.includes('global.');
  }

  private parseVariableDeclaration(line: string, lineNumber: number, filePath: string, comment: string): ScannedVariable | null {
    const trimmed = line.trim();
    
    // Match patterns:
    // var variableName = value
    // variableName = value
    // self.variableName = value
    // globalvar variableName
    // global.variableName = value
    
    // Pattern for var declarations
    let match = trimmed.match(/^var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (match) {
      return {
        name: match[1],
        type: this.inferType(line),
        comment: comment || undefined,
        file: filePath,
        line: lineNumber
      };
    }
    
    // Pattern for self.variable declarations
    match = trimmed.match(/^self\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (match) {
      return {
        name: match[1],
        type: this.inferType(line),
        comment: comment || undefined,
        file: filePath,
        line: lineNumber
      };
    }
    
    // Pattern for direct instance variable assignments (in Create event context)
    match = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*[^=]/);
    if (match && !this.isBuiltInVariable(match[1]) && !this.isKeyword(match[1])) {
      return {
        name: match[1],
        type: this.inferType(line),
        comment: comment || undefined,
        file: filePath,
        line: lineNumber
      };
    }
    
    // Pattern for globalvar
    match = trimmed.match(/^globalvar\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (match) {
      return {
        name: match[1],
        type: 'global',
        comment: comment || undefined,
        file: filePath,
        line: lineNumber
      };
    }
    
    // Pattern for global.variable
    match = trimmed.match(/^global\.([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (match) {
      return {
        name: match[1],
        type: 'global',
        comment: comment || undefined,
        file: filePath,
        line: lineNumber
      };
    }
    
    return null;
  }

  private inferType(line: string): string {
    const valueMatch = line.match(/=\s*(.+?)(;|$)/);
    if (!valueMatch) return 'any';
    
    const value = valueMatch[1].trim();
    
    // String
    if (/^["']/.test(value)) return 'string';
    if (/^@"/.test(value)) return 'string';
    
    // Boolean
    if (value === 'true' || value === 'false') return 'bool';
    
    // Number
    if (/^-?\d+\.?\d*$/.test(value)) return 'real';
    if (/^\$[0-9A-Fa-f]+$/.test(value)) return 'real'; // Hex
    
    // Array
    if (value.startsWith('[') || value.startsWith('array_create')) return 'array';
    
    // Struct
    if (value.startsWith('{') || value.includes('constructor')) return 'struct';
    
    // DS structures
    if (value.includes('ds_list_create')) return 'ds_list';
    if (value.includes('ds_map_create')) return 'ds_map';
    if (value.includes('ds_grid_create')) return 'ds_grid';
    if (value.includes('ds_stack_create')) return 'ds_stack';
    if (value.includes('ds_queue_create')) return 'ds_queue';
    
    // Instance creation
    if (value.includes('instance_create')) return 'id';
    
    // Surface
    if (value.includes('surface_create')) return 'surface';
    
    // Sprite/Resource references
    if (/^spr_/.test(value)) return 'sprite';
    if (/^obj_/.test(value)) return 'object';
    if (/^rm_/.test(value)) return 'room';
    if (/^snd_/.test(value)) return 'sound';
    if (/^fnt_/.test(value)) return 'font';
    
    // Undefined/noone
    if (value === 'undefined') return 'undefined';
    if (value === 'noone') return 'id';
    
    return 'any';
  }

  private isBuiltInVariable(name: string): boolean {
    const builtIns = new Set([
      'x', 'y', 'xprevious', 'yprevious', 'xstart', 'ystart',
      'hspeed', 'vspeed', 'direction', 'speed', 'friction',
      'gravity', 'gravity_direction', 'sprite_index', 'image_index',
      'image_speed', 'image_xscale', 'image_yscale', 'image_angle',
      'image_alpha', 'image_blend', 'visible', 'solid', 'persistent',
      'depth', 'layer', 'alarm', 'id', 'object_index', 'mask_index',
      'bbox_left', 'bbox_right', 'bbox_top', 'bbox_bottom',
      'sprite_width', 'sprite_height', 'sprite_xoffset', 'sprite_yoffset',
      'image_number', 'path_index', 'path_position', 'path_speed',
      'timeline_index', 'timeline_position', 'timeline_speed'
    ]);
    return builtIns.has(name);
  }

  private isKeyword(name: string): boolean {
    const keywords = new Set([
      'if', 'else', 'for', 'while', 'do', 'until', 'repeat', 'switch',
      'case', 'default', 'break', 'continue', 'return', 'exit', 'with',
      'var', 'globalvar', 'enum', 'function', 'constructor', 'new',
      'delete', 'try', 'catch', 'finally', 'throw', 'static',
      'and', 'or', 'xor', 'not', 'mod', 'div', 'true', 'false',
      'self', 'other', 'all', 'noone', 'global', 'local', 'undefined'
    ]);
    return keywords.has(name);
  }

  private removeFile(filePath: string): void {
    const objectContext = this.getObjectContextFromPath(filePath);
    
    if (objectContext) {
      const context = this.objectContexts.get(objectContext);
      if (context) {
        // Remove variables from this file
        for (const [name, variable] of context.variables) {
          if (variable.file === filePath) {
            context.variables.delete(name);
          }
        }
      }
    }
    
    // Also check global variables
    for (const [name, variable] of this.globalVariables) {
      if (variable.file === filePath) {
        this.globalVariables.delete(name);
      }
    }
    
    // Remove script-local variables
    this.scriptVariables.delete(filePath);
  }

  /**
   * Get variables available in a specific file context
   */
  public getVariablesForFile(filePath: string): ScannedVariable[] {
    const objectContext = this.getObjectContextFromPath(filePath);
    const variables: ScannedVariable[] = [];
    
    // Add global variables
    for (const variable of this.globalVariables.values()) {
      variables.push(variable);
    }
    
    // Add object context variables
    if (objectContext) {
      const context = this.objectContexts.get(objectContext);
      if (context) {
        for (const variable of context.variables.values()) {
          variables.push(variable);
        }
      }
    }
    
    // Add script-local variables if this is a script file
    const scriptVars = this.scriptVariables.get(filePath);
    if (scriptVars) {
      for (const variable of scriptVars.values()) {
        variables.push(variable);
      }
    }
    
    return variables;
  }

  /**
   * Get a specific variable by name within a file's context
   */
  public getVariable(name: string, filePath: string): ScannedVariable | undefined {
    // Check script-local variables first (higher priority in script context)
    const scriptVars = this.scriptVariables.get(filePath);
    if (scriptVars && scriptVars.has(name)) {
      return scriptVars.get(name);
    }
    
    // Check global variables
    if (this.globalVariables.has(name)) {
      return this.globalVariables.get(name);
    }
    
    // Check object context
    const objectContext = this.getObjectContextFromPath(filePath);
    if (objectContext) {
      const context = this.objectContexts.get(objectContext);
      if (context && context.variables.has(name)) {
        return context.variables.get(name);
      }
    }
    
    return undefined;
  }

  /**
   * Get all object contexts
   */
  public getObjectContexts(): ObjectContext[] {
    return Array.from(this.objectContexts.values());
  }

  /**
   * Get all global variables
   */
  public getGlobalVariables(): ScannedVariable[] {
    return Array.from(this.globalVariables.values());
  }

  /**
   * Get an asset by name
   */
  public getAsset(name: string): ScannedAsset | undefined {
    return this.assets.get(name);
  }

  /**
   * Get all assets
   */
  public getAllAssets(): ScannedAsset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get a script by name
   */
  public getScript(name: string): ScannedScript | undefined {
    return this.scripts.get(name);
  }

  /**
   * Get all scripts
   */
  public getAllScripts(): ScannedScript[] {
    return Array.from(this.scripts.values());
  }

  /**
   * Get object info from hierarchy
   */
  public getObjectInfo(objectName: string): ObjectInfo | undefined {
    return this.objectHierarchy.get(objectName);
  }

  /**
   * Get all objects in hierarchy
   */
  public getAllObjects(): ObjectInfo[] {
    return Array.from(this.objectHierarchy.values());
  }

  /**
   * Check if an object exists
   */
  public objectExists(objectName: string): boolean {
    return this.objectHierarchy.has(objectName) || this.assets.has(objectName);
  }

  public dispose(): void {
    if (this.fileWatcher) {
      this.fileWatcher.dispose();
    }
    if (this.assetWatcher) {
      this.assetWatcher.dispose();
    }
  }
}
