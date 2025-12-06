"use strict";
/**
 * GML Functions Database
 * Contains function signatures and documentation for hover providers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gmlVariables = exports.gmlFunctions = void 0;
exports.gmlFunctions = new Map([
    // Type checking functions
    ['is_real', {
            name: 'is_real',
            signature: 'is_real(val)',
            description: 'Checks whether a value is a real number.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is a real number, false otherwise' },
            category: 'Data Types'
        }],
    ['is_string', {
            name: 'is_string',
            signature: 'is_string(val)',
            description: 'Checks whether a value is a string.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is a string, false otherwise' },
            category: 'Data Types'
        }],
    ['is_array', {
            name: 'is_array',
            signature: 'is_array(val)',
            description: 'Checks whether a value is an array.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is an array, false otherwise' },
            category: 'Data Types'
        }],
    ['is_undefined', {
            name: 'is_undefined',
            signature: 'is_undefined(val)',
            description: 'Checks whether a value is undefined.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is undefined, false otherwise' },
            category: 'Data Types'
        }],
    ['is_struct', {
            name: 'is_struct',
            signature: 'is_struct(val)',
            description: 'Checks whether a value is a struct.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is a struct, false otherwise' },
            category: 'Data Types'
        }],
    ['is_method', {
            name: 'is_method',
            signature: 'is_method(val)',
            description: 'Checks whether a value is a method.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to check' }],
            returns: { type: 'bool', description: 'Returns true if the value is a method, false otherwise' },
            category: 'Data Types'
        }],
    ['typeof', {
            name: 'typeof',
            signature: 'typeof(val)',
            description: 'Returns a string representation of the data type of a value.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to get the type of' }],
            returns: { type: 'string', description: 'A string representing the type (e.g., "number", "string", "array", "struct")' },
            category: 'Data Types'
        }],
    // Math functions
    ['abs', {
            name: 'abs',
            signature: 'abs(x)',
            description: 'Returns the absolute value of x.',
            parameters: [{ name: 'x', type: 'real', description: 'The number to get the absolute value of' }],
            returns: { type: 'real', description: 'The absolute value of x' },
            example: 'var val = abs(-5); // Returns 5',
            category: 'Math'
        }],
    ['round', {
            name: 'round',
            signature: 'round(x)',
            description: 'Returns x rounded to the nearest integer.',
            parameters: [{ name: 'x', type: 'real', description: 'The number to round' }],
            returns: { type: 'real', description: 'The rounded value' },
            category: 'Math'
        }],
    ['floor', {
            name: 'floor',
            signature: 'floor(x)',
            description: 'Returns the floor of x (rounds down to nearest integer).',
            parameters: [{ name: 'x', type: 'real', description: 'The number to floor' }],
            returns: { type: 'real', description: 'The floored value' },
            category: 'Math'
        }],
    ['ceil', {
            name: 'ceil',
            signature: 'ceil(x)',
            description: 'Returns the ceiling of x (rounds up to nearest integer).',
            parameters: [{ name: 'x', type: 'real', description: 'The number to ceil' }],
            returns: { type: 'real', description: 'The ceiled value' },
            category: 'Math'
        }],
    ['sign', {
            name: 'sign',
            signature: 'sign(x)',
            description: 'Returns the sign of x (-1, 0, or 1).',
            parameters: [{ name: 'x', type: 'real', description: 'The number to get the sign of' }],
            returns: { type: 'real', description: '-1 if negative, 0 if zero, 1 if positive' },
            category: 'Math'
        }],
    ['sqrt', {
            name: 'sqrt',
            signature: 'sqrt(x)',
            description: 'Returns the square root of x.',
            parameters: [{ name: 'x', type: 'real', description: 'The number (must be >= 0)' }],
            returns: { type: 'real', description: 'The square root of x' },
            category: 'Math'
        }],
    ['sqr', {
            name: 'sqr',
            signature: 'sqr(x)',
            description: 'Returns x squared (x * x).',
            parameters: [{ name: 'x', type: 'real', description: 'The number to square' }],
            returns: { type: 'real', description: 'x squared' },
            category: 'Math'
        }],
    ['power', {
            name: 'power',
            signature: 'power(x, n)',
            description: 'Returns x raised to the power of n.',
            parameters: [
                { name: 'x', type: 'real', description: 'The base' },
                { name: 'n', type: 'real', description: 'The exponent' }
            ],
            returns: { type: 'real', description: 'x to the power of n' },
            category: 'Math'
        }],
    ['sin', {
            name: 'sin',
            signature: 'sin(radian_angle)',
            description: 'Returns the sine of the angle (in radians).',
            parameters: [{ name: 'radian_angle', type: 'real', description: 'The angle in radians' }],
            returns: { type: 'real', description: 'The sine of the angle' },
            category: 'Math'
        }],
    ['cos', {
            name: 'cos',
            signature: 'cos(radian_angle)',
            description: 'Returns the cosine of the angle (in radians).',
            parameters: [{ name: 'radian_angle', type: 'real', description: 'The angle in radians' }],
            returns: { type: 'real', description: 'The cosine of the angle' },
            category: 'Math'
        }],
    ['tan', {
            name: 'tan',
            signature: 'tan(radian_angle)',
            description: 'Returns the tangent of the angle (in radians).',
            parameters: [{ name: 'radian_angle', type: 'real', description: 'The angle in radians' }],
            returns: { type: 'real', description: 'The tangent of the angle' },
            category: 'Math'
        }],
    ['dsin', {
            name: 'dsin',
            signature: 'dsin(degree_angle)',
            description: 'Returns the sine of the angle (in degrees).',
            parameters: [{ name: 'degree_angle', type: 'real', description: 'The angle in degrees' }],
            returns: { type: 'real', description: 'The sine of the angle' },
            category: 'Math'
        }],
    ['dcos', {
            name: 'dcos',
            signature: 'dcos(degree_angle)',
            description: 'Returns the cosine of the angle (in degrees).',
            parameters: [{ name: 'degree_angle', type: 'real', description: 'The angle in degrees' }],
            returns: { type: 'real', description: 'The cosine of the angle' },
            category: 'Math'
        }],
    ['degtorad', {
            name: 'degtorad',
            signature: 'degtorad(x)',
            description: 'Converts degrees to radians.',
            parameters: [{ name: 'x', type: 'real', description: 'The angle in degrees' }],
            returns: { type: 'real', description: 'The angle in radians' },
            category: 'Math'
        }],
    ['radtodeg', {
            name: 'radtodeg',
            signature: 'radtodeg(x)',
            description: 'Converts radians to degrees.',
            parameters: [{ name: 'x', type: 'real', description: 'The angle in radians' }],
            returns: { type: 'real', description: 'The angle in degrees' },
            category: 'Math'
        }],
    ['min', {
            name: 'min',
            signature: 'min(x1, x2, x3, ...)',
            description: 'Returns the minimum of the given values.',
            parameters: [{ name: 'values', type: 'real', description: 'Two or more values to compare' }],
            returns: { type: 'real', description: 'The smallest value' },
            category: 'Math'
        }],
    ['max', {
            name: 'max',
            signature: 'max(x1, x2, x3, ...)',
            description: 'Returns the maximum of the given values.',
            parameters: [{ name: 'values', type: 'real', description: 'Two or more values to compare' }],
            returns: { type: 'real', description: 'The largest value' },
            category: 'Math'
        }],
    ['clamp', {
            name: 'clamp',
            signature: 'clamp(val, min, max)',
            description: 'Clamps a value between a minimum and maximum.',
            parameters: [
                { name: 'val', type: 'real', description: 'The value to clamp' },
                { name: 'min', type: 'real', description: 'The minimum value' },
                { name: 'max', type: 'real', description: 'The maximum value' }
            ],
            returns: { type: 'real', description: 'The clamped value' },
            example: 'var clamped = clamp(15, 0, 10); // Returns 10',
            category: 'Math'
        }],
    ['lerp', {
            name: 'lerp',
            signature: 'lerp(val1, val2, amount)',
            description: 'Linearly interpolates between two values.',
            parameters: [
                { name: 'val1', type: 'real', description: 'The start value' },
                { name: 'val2', type: 'real', description: 'The end value' },
                { name: 'amount', type: 'real', description: 'The interpolation amount (0-1)' }
            ],
            returns: { type: 'real', description: 'The interpolated value' },
            example: 'x = lerp(x, target_x, 0.1); // Smooth movement',
            category: 'Math'
        }],
    ['point_distance', {
            name: 'point_distance',
            signature: 'point_distance(x1, y1, x2, y2)',
            description: 'Returns the distance between two points.',
            parameters: [
                { name: 'x1', type: 'real', description: 'X coordinate of first point' },
                { name: 'y1', type: 'real', description: 'Y coordinate of first point' },
                { name: 'x2', type: 'real', description: 'X coordinate of second point' },
                { name: 'y2', type: 'real', description: 'Y coordinate of second point' }
            ],
            returns: { type: 'real', description: 'The distance between the two points' },
            category: 'Math'
        }],
    ['point_direction', {
            name: 'point_direction',
            signature: 'point_direction(x1, y1, x2, y2)',
            description: 'Returns the direction from point 1 to point 2 in degrees.',
            parameters: [
                { name: 'x1', type: 'real', description: 'X coordinate of first point' },
                { name: 'y1', type: 'real', description: 'Y coordinate of first point' },
                { name: 'x2', type: 'real', description: 'X coordinate of second point' },
                { name: 'y2', type: 'real', description: 'Y coordinate of second point' }
            ],
            returns: { type: 'real', description: 'The direction in degrees (0-360)' },
            category: 'Math'
        }],
    ['lengthdir_x', {
            name: 'lengthdir_x',
            signature: 'lengthdir_x(len, dir)',
            description: 'Returns the horizontal component of a vector.',
            parameters: [
                { name: 'len', type: 'real', description: 'The length of the vector' },
                { name: 'dir', type: 'real', description: 'The direction in degrees' }
            ],
            returns: { type: 'real', description: 'The horizontal (x) component' },
            example: 'x += lengthdir_x(speed, direction);',
            category: 'Math'
        }],
    ['lengthdir_y', {
            name: 'lengthdir_y',
            signature: 'lengthdir_y(len, dir)',
            description: 'Returns the vertical component of a vector.',
            parameters: [
                { name: 'len', type: 'real', description: 'The length of the vector' },
                { name: 'dir', type: 'real', description: 'The direction in degrees' }
            ],
            returns: { type: 'real', description: 'The vertical (y) component' },
            example: 'y += lengthdir_y(speed, direction);',
            category: 'Math'
        }],
    ['angle_difference', {
            name: 'angle_difference',
            signature: 'angle_difference(src, dest)',
            description: 'Returns the difference between two angles, taking into account wrapping.',
            parameters: [
                { name: 'src', type: 'real', description: 'The source angle in degrees' },
                { name: 'dest', type: 'real', description: 'The destination angle in degrees' }
            ],
            returns: { type: 'real', description: 'The shortest angular difference (-180 to 180)' },
            category: 'Math'
        }],
    // Random functions
    ['random', {
            name: 'random',
            signature: 'random(x)',
            description: 'Returns a random real number between 0 and x (not including x).',
            parameters: [{ name: 'x', type: 'real', description: 'The upper limit' }],
            returns: { type: 'real', description: 'A random real number' },
            category: 'Math'
        }],
    ['random_range', {
            name: 'random_range',
            signature: 'random_range(x1, x2)',
            description: 'Returns a random real number between x1 and x2.',
            parameters: [
                { name: 'x1', type: 'real', description: 'The lower limit' },
                { name: 'x2', type: 'real', description: 'The upper limit' }
            ],
            returns: { type: 'real', description: 'A random real number between x1 and x2' },
            category: 'Math'
        }],
    ['irandom', {
            name: 'irandom',
            signature: 'irandom(x)',
            description: 'Returns a random integer between 0 and x (including x).',
            parameters: [{ name: 'x', type: 'real', description: 'The upper limit' }],
            returns: { type: 'real', description: 'A random integer' },
            category: 'Math'
        }],
    ['irandom_range', {
            name: 'irandom_range',
            signature: 'irandom_range(x1, x2)',
            description: 'Returns a random integer between x1 and x2 (including both).',
            parameters: [
                { name: 'x1', type: 'real', description: 'The lower limit' },
                { name: 'x2', type: 'real', description: 'The upper limit' }
            ],
            returns: { type: 'real', description: 'A random integer between x1 and x2' },
            category: 'Math'
        }],
    ['choose', {
            name: 'choose',
            signature: 'choose(val1, val2, val3, ...)',
            description: 'Returns one of the arguments randomly.',
            parameters: [{ name: 'values', type: 'any', description: 'Two or more values to choose from' }],
            returns: { type: 'any', description: 'One of the provided values' },
            example: 'var color = choose(c_red, c_blue, c_green);',
            category: 'Math'
        }],
    ['randomize', {
            name: 'randomize',
            signature: 'randomize()',
            description: 'Seeds the random number generator with a random value based on current time.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Math'
        }],
    // String functions
    ['string', {
            name: 'string',
            signature: 'string(val)',
            description: 'Converts a value to a string.',
            parameters: [{ name: 'val', type: 'any', description: 'The value to convert' }],
            returns: { type: 'string', description: 'The string representation of the value' },
            category: 'Strings'
        }],
    ['real', {
            name: 'real',
            signature: 'real(str)',
            description: 'Converts a string to a real number.',
            parameters: [{ name: 'str', type: 'string', description: 'The string to convert' }],
            returns: { type: 'real', description: 'The numeric value of the string' },
            category: 'Strings'
        }],
    ['string_length', {
            name: 'string_length',
            signature: 'string_length(str)',
            description: 'Returns the length of a string.',
            parameters: [{ name: 'str', type: 'string', description: 'The string to measure' }],
            returns: { type: 'real', description: 'The number of characters in the string' },
            category: 'Strings'
        }],
    ['string_pos', {
            name: 'string_pos',
            signature: 'string_pos(substr, str)',
            description: 'Returns the position of a substring within a string.',
            parameters: [
                { name: 'substr', type: 'string', description: 'The substring to find' },
                { name: 'str', type: 'string', description: 'The string to search in' }
            ],
            returns: { type: 'real', description: 'Position (1-based), or 0 if not found' },
            category: 'Strings'
        }],
    ['string_copy', {
            name: 'string_copy',
            signature: 'string_copy(str, index, count)',
            description: 'Returns a substring from a string.',
            parameters: [
                { name: 'str', type: 'string', description: 'The source string' },
                { name: 'index', type: 'real', description: 'The starting position (1-based)' },
                { name: 'count', type: 'real', description: 'The number of characters to copy' }
            ],
            returns: { type: 'string', description: 'The extracted substring' },
            category: 'Strings'
        }],
    ['string_lower', {
            name: 'string_lower',
            signature: 'string_lower(str)',
            description: 'Returns a lowercase version of the string.',
            parameters: [{ name: 'str', type: 'string', description: 'The string to convert' }],
            returns: { type: 'string', description: 'The lowercase string' },
            category: 'Strings'
        }],
    ['string_upper', {
            name: 'string_upper',
            signature: 'string_upper(str)',
            description: 'Returns an uppercase version of the string.',
            parameters: [{ name: 'str', type: 'string', description: 'The string to convert' }],
            returns: { type: 'string', description: 'The uppercase string' },
            category: 'Strings'
        }],
    ['string_replace', {
            name: 'string_replace',
            signature: 'string_replace(str, substr, newstr)',
            description: 'Replaces the first occurrence of a substring.',
            parameters: [
                { name: 'str', type: 'string', description: 'The source string' },
                { name: 'substr', type: 'string', description: 'The substring to replace' },
                { name: 'newstr', type: 'string', description: 'The replacement string' }
            ],
            returns: { type: 'string', description: 'The modified string' },
            category: 'Strings'
        }],
    ['string_replace_all', {
            name: 'string_replace_all',
            signature: 'string_replace_all(str, substr, newstr)',
            description: 'Replaces all occurrences of a substring.',
            parameters: [
                { name: 'str', type: 'string', description: 'The source string' },
                { name: 'substr', type: 'string', description: 'The substring to replace' },
                { name: 'newstr', type: 'string', description: 'The replacement string' }
            ],
            returns: { type: 'string', description: 'The modified string' },
            category: 'Strings'
        }],
    // Instance functions
    ['instance_create_layer', {
            name: 'instance_create_layer',
            signature: 'instance_create_layer(x, y, layer_id_or_name, obj)',
            description: 'Creates an instance of an object on a specific layer.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'layer_id_or_name', type: 'string/id', description: 'The layer name or ID' },
                { name: 'obj', type: 'object', description: 'The object to create' }
            ],
            returns: { type: 'id', description: 'The instance ID of the created instance' },
            example: 'var inst = instance_create_layer(x, y, "Instances", obj_bullet);',
            category: 'Instances'
        }],
    ['instance_create_depth', {
            name: 'instance_create_depth',
            signature: 'instance_create_depth(x, y, depth, obj)',
            description: 'Creates an instance of an object at a specific depth.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'depth', type: 'real', description: 'The depth to create at' },
                { name: 'obj', type: 'object', description: 'The object to create' }
            ],
            returns: { type: 'id', description: 'The instance ID of the created instance' },
            category: 'Instances'
        }],
    ['instance_destroy', {
            name: 'instance_destroy',
            signature: 'instance_destroy(id?, execute_event_flag?)',
            description: 'Destroys an instance.',
            parameters: [
                { name: 'id', type: 'id', description: 'The instance to destroy (optional, defaults to self)' },
                { name: 'execute_event_flag', type: 'bool', description: 'Whether to execute the Destroy event (optional)' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Instances'
        }],
    ['instance_exists', {
            name: 'instance_exists',
            signature: 'instance_exists(obj)',
            description: 'Checks if any instances of an object exist.',
            parameters: [{ name: 'obj', type: 'object/id', description: 'The object or instance ID to check' }],
            returns: { type: 'bool', description: 'True if instances exist, false otherwise' },
            category: 'Instances'
        }],
    ['instance_find', {
            name: 'instance_find',
            signature: 'instance_find(obj, n)',
            description: 'Returns the nth instance of an object.',
            parameters: [
                { name: 'obj', type: 'object', description: 'The object to find' },
                { name: 'n', type: 'real', description: 'The index (0-based)' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if not found' },
            category: 'Instances'
        }],
    ['instance_number', {
            name: 'instance_number',
            signature: 'instance_number(obj)',
            description: 'Returns the number of instances of an object.',
            parameters: [{ name: 'obj', type: 'object', description: 'The object to count' }],
            returns: { type: 'real', description: 'The number of instances' },
            category: 'Instances'
        }],
    ['instance_nearest', {
            name: 'instance_nearest',
            signature: 'instance_nearest(x, y, obj)',
            description: 'Returns the nearest instance of an object.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'obj', type: 'object', description: 'The object to find' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if none found' },
            category: 'Instances'
        }],
    // Collision functions
    ['place_meeting', {
            name: 'place_meeting',
            signature: 'place_meeting(x, y, obj)',
            description: 'Checks for a collision at a position.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position to check' },
                { name: 'y', type: 'real', description: 'The y position to check' },
                { name: 'obj', type: 'object', description: 'The object to check collision with' }
            ],
            returns: { type: 'bool', description: 'True if collision detected, false otherwise' },
            example: 'if (place_meeting(x + hspeed, y, obj_wall)) hspeed = 0;',
            category: 'Collisions'
        }],
    ['place_free', {
            name: 'place_free',
            signature: 'place_free(x, y)',
            description: 'Checks if a position is free of solid objects.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position to check' },
                { name: 'y', type: 'real', description: 'The y position to check' }
            ],
            returns: { type: 'bool', description: 'True if position is free, false otherwise' },
            category: 'Collisions'
        }],
    ['collision_point', {
            name: 'collision_point',
            signature: 'collision_point(x, y, obj, prec, notme)',
            description: 'Checks for a collision at a single point.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position to check' },
                { name: 'y', type: 'real', description: 'The y position to check' },
                { name: 'obj', type: 'object', description: 'The object to check collision with' },
                { name: 'prec', type: 'bool', description: 'Use precise collision checking' },
                { name: 'notme', type: 'bool', description: 'Exclude the calling instance' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if no collision' },
            category: 'Collisions'
        }],
    ['collision_rectangle', {
            name: 'collision_rectangle',
            signature: 'collision_rectangle(x1, y1, x2, y2, obj, prec, notme)',
            description: 'Checks for collisions in a rectangular area.',
            parameters: [
                { name: 'x1', type: 'real', description: 'Left edge x coordinate' },
                { name: 'y1', type: 'real', description: 'Top edge y coordinate' },
                { name: 'x2', type: 'real', description: 'Right edge x coordinate' },
                { name: 'y2', type: 'real', description: 'Bottom edge y coordinate' },
                { name: 'obj', type: 'object', description: 'The object to check collision with' },
                { name: 'prec', type: 'bool', description: 'Use precise collision checking' },
                { name: 'notme', type: 'bool', description: 'Exclude the calling instance' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if no collision' },
            category: 'Collisions'
        }],
    ['collision_circle', {
            name: 'collision_circle',
            signature: 'collision_circle(x1, y1, radius, obj, prec, notme)',
            description: 'Checks for collisions in a circular area.',
            parameters: [
                { name: 'x1', type: 'real', description: 'Center x coordinate' },
                { name: 'y1', type: 'real', description: 'Center y coordinate' },
                { name: 'radius', type: 'real', description: 'The radius of the circle' },
                { name: 'obj', type: 'object', description: 'The object to check collision with' },
                { name: 'prec', type: 'bool', description: 'Use precise collision checking' },
                { name: 'notme', type: 'bool', description: 'Exclude the calling instance' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if no collision' },
            category: 'Collisions'
        }],
    ['collision_line', {
            name: 'collision_line',
            signature: 'collision_line(x1, y1, x2, y2, obj, prec, notme)',
            description: 'Checks for collisions along a line.',
            parameters: [
                { name: 'x1', type: 'real', description: 'Start x coordinate' },
                { name: 'y1', type: 'real', description: 'Start y coordinate' },
                { name: 'x2', type: 'real', description: 'End x coordinate' },
                { name: 'y2', type: 'real', description: 'End y coordinate' },
                { name: 'obj', type: 'object', description: 'The object to check collision with' },
                { name: 'prec', type: 'bool', description: 'Use precise collision checking' },
                { name: 'notme', type: 'bool', description: 'Exclude the calling instance' }
            ],
            returns: { type: 'id', description: 'The instance ID, or noone if no collision' },
            category: 'Collisions'
        }],
    // Drawing functions
    ['draw_sprite', {
            name: 'draw_sprite',
            signature: 'draw_sprite(sprite, subimg, x, y)',
            description: 'Draws a sprite at a position.',
            parameters: [
                { name: 'sprite', type: 'sprite', description: 'The sprite to draw' },
                { name: 'subimg', type: 'real', description: 'The sub-image to draw (-1 for current)' },
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_sprite_ext', {
            name: 'draw_sprite_ext',
            signature: 'draw_sprite_ext(sprite, subimg, x, y, xscale, yscale, rot, col, alpha)',
            description: 'Draws a sprite with extended options.',
            parameters: [
                { name: 'sprite', type: 'sprite', description: 'The sprite to draw' },
                { name: 'subimg', type: 'real', description: 'The sub-image to draw (-1 for current)' },
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'xscale', type: 'real', description: 'Horizontal scale' },
                { name: 'yscale', type: 'real', description: 'Vertical scale' },
                { name: 'rot', type: 'real', description: 'Rotation in degrees' },
                { name: 'col', type: 'color', description: 'Blend color' },
                { name: 'alpha', type: 'real', description: 'Alpha transparency (0-1)' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_text', {
            name: 'draw_text',
            signature: 'draw_text(x, y, string)',
            description: 'Draws text at a position.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'string', type: 'string', description: 'The text to draw' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_text_ext', {
            name: 'draw_text_ext',
            signature: 'draw_text_ext(x, y, string, sep, w)',
            description: 'Draws text with line wrapping.',
            parameters: [
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' },
                { name: 'string', type: 'string', description: 'The text to draw' },
                { name: 'sep', type: 'real', description: 'Line separation (-1 for default)' },
                { name: 'w', type: 'real', description: 'Maximum width before wrapping (-1 for no wrap)' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_rectangle', {
            name: 'draw_rectangle',
            signature: 'draw_rectangle(x1, y1, x2, y2, outline)',
            description: 'Draws a rectangle.',
            parameters: [
                { name: 'x1', type: 'real', description: 'Left edge x coordinate' },
                { name: 'y1', type: 'real', description: 'Top edge y coordinate' },
                { name: 'x2', type: 'real', description: 'Right edge x coordinate' },
                { name: 'y2', type: 'real', description: 'Bottom edge y coordinate' },
                { name: 'outline', type: 'bool', description: 'Draw only the outline' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_circle', {
            name: 'draw_circle',
            signature: 'draw_circle(x, y, r, outline)',
            description: 'Draws a circle.',
            parameters: [
                { name: 'x', type: 'real', description: 'Center x coordinate' },
                { name: 'y', type: 'real', description: 'Center y coordinate' },
                { name: 'r', type: 'real', description: 'Radius' },
                { name: 'outline', type: 'bool', description: 'Draw only the outline' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_line', {
            name: 'draw_line',
            signature: 'draw_line(x1, y1, x2, y2)',
            description: 'Draws a line between two points.',
            parameters: [
                { name: 'x1', type: 'real', description: 'Start x coordinate' },
                { name: 'y1', type: 'real', description: 'Start y coordinate' },
                { name: 'x2', type: 'real', description: 'End x coordinate' },
                { name: 'y2', type: 'real', description: 'End y coordinate' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_set_color', {
            name: 'draw_set_color',
            signature: 'draw_set_color(col)',
            description: 'Sets the draw color.',
            parameters: [{ name: 'col', type: 'color', description: 'The color to use' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_set_alpha', {
            name: 'draw_set_alpha',
            signature: 'draw_set_alpha(alpha)',
            description: 'Sets the draw alpha (transparency).',
            parameters: [{ name: 'alpha', type: 'real', description: 'Alpha value (0-1)' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_set_font', {
            name: 'draw_set_font',
            signature: 'draw_set_font(font)',
            description: 'Sets the font for drawing text.',
            parameters: [{ name: 'font', type: 'font', description: 'The font to use (-1 for default)' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_set_halign', {
            name: 'draw_set_halign',
            signature: 'draw_set_halign(halign)',
            description: 'Sets the horizontal alignment for text.',
            parameters: [{ name: 'halign', type: 'constant', description: 'fa_left, fa_center, or fa_right' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_set_valign', {
            name: 'draw_set_valign',
            signature: 'draw_set_valign(valign)',
            description: 'Sets the vertical alignment for text.',
            parameters: [{ name: 'valign', type: 'constant', description: 'fa_top, fa_middle, or fa_bottom' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    ['draw_self', {
            name: 'draw_self',
            signature: 'draw_self()',
            description: 'Draws the instance\'s sprite at its current position.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Drawing'
        }],
    // Keyboard functions
    ['keyboard_check', {
            name: 'keyboard_check',
            signature: 'keyboard_check(key)',
            description: 'Checks if a key is currently held down.',
            parameters: [{ name: 'key', type: 'constant', description: 'The key to check (vk_* constant or character)' }],
            returns: { type: 'bool', description: 'True if key is held, false otherwise' },
            example: 'if (keyboard_check(vk_right)) x += 4;',
            category: 'Input'
        }],
    ['keyboard_check_pressed', {
            name: 'keyboard_check_pressed',
            signature: 'keyboard_check_pressed(key)',
            description: 'Checks if a key was just pressed this step.',
            parameters: [{ name: 'key', type: 'constant', description: 'The key to check' }],
            returns: { type: 'bool', description: 'True if key was just pressed, false otherwise' },
            category: 'Input'
        }],
    ['keyboard_check_released', {
            name: 'keyboard_check_released',
            signature: 'keyboard_check_released(key)',
            description: 'Checks if a key was just released this step.',
            parameters: [{ name: 'key', type: 'constant', description: 'The key to check' }],
            returns: { type: 'bool', description: 'True if key was just released, false otherwise' },
            category: 'Input'
        }],
    // Mouse functions
    ['mouse_check_button', {
            name: 'mouse_check_button',
            signature: 'mouse_check_button(button)',
            description: 'Checks if a mouse button is currently held down.',
            parameters: [{ name: 'button', type: 'constant', description: 'The button to check (mb_left, mb_right, mb_middle)' }],
            returns: { type: 'bool', description: 'True if button is held, false otherwise' },
            category: 'Input'
        }],
    ['mouse_check_button_pressed', {
            name: 'mouse_check_button_pressed',
            signature: 'mouse_check_button_pressed(button)',
            description: 'Checks if a mouse button was just pressed.',
            parameters: [{ name: 'button', type: 'constant', description: 'The button to check' }],
            returns: { type: 'bool', description: 'True if button was just pressed, false otherwise' },
            category: 'Input'
        }],
    ['mouse_check_button_released', {
            name: 'mouse_check_button_released',
            signature: 'mouse_check_button_released(button)',
            description: 'Checks if a mouse button was just released.',
            parameters: [{ name: 'button', type: 'constant', description: 'The button to check' }],
            returns: { type: 'bool', description: 'True if button was just released, false otherwise' },
            category: 'Input'
        }],
    // Audio functions
    ['audio_play_sound', {
            name: 'audio_play_sound',
            signature: 'audio_play_sound(soundid, priority, loops)',
            description: 'Plays a sound.',
            parameters: [
                { name: 'soundid', type: 'sound', description: 'The sound to play' },
                { name: 'priority', type: 'real', description: 'The priority of the sound' },
                { name: 'loops', type: 'bool', description: 'Whether to loop the sound' }
            ],
            returns: { type: 'id', description: 'The sound instance ID' },
            category: 'Audio'
        }],
    ['audio_stop_sound', {
            name: 'audio_stop_sound',
            signature: 'audio_stop_sound(soundid)',
            description: 'Stops a playing sound.',
            parameters: [{ name: 'soundid', type: 'sound/id', description: 'The sound or sound instance to stop' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Audio'
        }],
    ['audio_is_playing', {
            name: 'audio_is_playing',
            signature: 'audio_is_playing(soundid)',
            description: 'Checks if a sound is currently playing.',
            parameters: [{ name: 'soundid', type: 'sound/id', description: 'The sound to check' }],
            returns: { type: 'bool', description: 'True if playing, false otherwise' },
            category: 'Audio'
        }],
    ['audio_sound_gain', {
            name: 'audio_sound_gain',
            signature: 'audio_sound_gain(index, level, time)',
            description: 'Sets the gain (volume) of a sound.',
            parameters: [
                { name: 'index', type: 'sound/id', description: 'The sound to modify' },
                { name: 'level', type: 'real', description: 'The gain level (0-1)' },
                { name: 'time', type: 'real', description: 'Time in ms to reach the new level' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Audio'
        }],
    // Room functions
    ['room_goto', {
            name: 'room_goto',
            signature: 'room_goto(numb)',
            description: 'Goes to a different room.',
            parameters: [{ name: 'numb', type: 'room', description: 'The room to go to' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Rooms'
        }],
    ['room_goto_next', {
            name: 'room_goto_next',
            signature: 'room_goto_next()',
            description: 'Goes to the next room in the room order.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Rooms'
        }],
    ['room_goto_previous', {
            name: 'room_goto_previous',
            signature: 'room_goto_previous()',
            description: 'Goes to the previous room in the room order.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Rooms'
        }],
    ['room_restart', {
            name: 'room_restart',
            signature: 'room_restart()',
            description: 'Restarts the current room.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Rooms'
        }],
    // Game functions
    ['game_restart', {
            name: 'game_restart',
            signature: 'game_restart()',
            description: 'Restarts the game.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Game'
        }],
    ['game_end', {
            name: 'game_end',
            signature: 'game_end()',
            description: 'Ends the game.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Game'
        }],
    // Debug functions
    ['show_debug_message', {
            name: 'show_debug_message',
            signature: 'show_debug_message(str)',
            description: 'Outputs a message to the debug console.',
            parameters: [{ name: 'str', type: 'string', description: 'The message to output' }],
            returns: { type: 'void', description: 'Nothing' },
            example: 'show_debug_message("Player position: " + string(x) + ", " + string(y));',
            category: 'Debug'
        }],
    // Array functions
    ['array_create', {
            name: 'array_create',
            signature: 'array_create(size, val?)',
            description: 'Creates an array of a given size.',
            parameters: [
                { name: 'size', type: 'real', description: 'The size of the array' },
                { name: 'val', type: 'any', description: 'Optional initial value for all elements' }
            ],
            returns: { type: 'array', description: 'The new array' },
            category: 'Arrays'
        }],
    ['array_length', {
            name: 'array_length',
            signature: 'array_length(array)',
            description: 'Returns the length of an array.',
            parameters: [{ name: 'array', type: 'array', description: 'The array to measure' }],
            returns: { type: 'real', description: 'The number of elements in the array' },
            category: 'Arrays'
        }],
    ['array_push', {
            name: 'array_push',
            signature: 'array_push(array, value, ...)',
            description: 'Adds values to the end of an array.',
            parameters: [
                { name: 'array', type: 'array', description: 'The array to modify' },
                { name: 'value', type: 'any', description: 'The value(s) to add' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Arrays'
        }],
    ['array_pop', {
            name: 'array_pop',
            signature: 'array_pop(array)',
            description: 'Removes and returns the last element of an array.',
            parameters: [{ name: 'array', type: 'array', description: 'The array to modify' }],
            returns: { type: 'any', description: 'The removed element' },
            category: 'Arrays'
        }],
    // DS Map functions
    ['ds_map_create', {
            name: 'ds_map_create',
            signature: 'ds_map_create()',
            description: 'Creates a new DS map.',
            parameters: [],
            returns: { type: 'id', description: 'The ID of the new map' },
            category: 'Data Structures'
        }],
    ['ds_map_destroy', {
            name: 'ds_map_destroy',
            signature: 'ds_map_destroy(id)',
            description: 'Destroys a DS map.',
            parameters: [{ name: 'id', type: 'id', description: 'The map to destroy' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Data Structures'
        }],
    ['ds_map_add', {
            name: 'ds_map_add',
            signature: 'ds_map_add(id, key, value)',
            description: 'Adds a key-value pair to a DS map.',
            parameters: [
                { name: 'id', type: 'id', description: 'The map ID' },
                { name: 'key', type: 'any', description: 'The key' },
                { name: 'value', type: 'any', description: 'The value' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Data Structures'
        }],
    ['ds_map_find_value', {
            name: 'ds_map_find_value',
            signature: 'ds_map_find_value(id, key)',
            description: 'Gets a value from a DS map.',
            parameters: [
                { name: 'id', type: 'id', description: 'The map ID' },
                { name: 'key', type: 'any', description: 'The key to find' }
            ],
            returns: { type: 'any', description: 'The value, or undefined if not found' },
            category: 'Data Structures'
        }],
    ['ds_map_exists', {
            name: 'ds_map_exists',
            signature: 'ds_map_exists(id, key)',
            description: 'Checks if a key exists in a DS map.',
            parameters: [
                { name: 'id', type: 'id', description: 'The map ID' },
                { name: 'key', type: 'any', description: 'The key to check' }
            ],
            returns: { type: 'bool', description: 'True if the key exists, false otherwise' },
            category: 'Data Structures'
        }],
    // DS List functions
    ['ds_list_create', {
            name: 'ds_list_create',
            signature: 'ds_list_create()',
            description: 'Creates a new DS list.',
            parameters: [],
            returns: { type: 'id', description: 'The ID of the new list' },
            category: 'Data Structures'
        }],
    ['ds_list_destroy', {
            name: 'ds_list_destroy',
            signature: 'ds_list_destroy(id)',
            description: 'Destroys a DS list.',
            parameters: [{ name: 'id', type: 'id', description: 'The list to destroy' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Data Structures'
        }],
    ['ds_list_add', {
            name: 'ds_list_add',
            signature: 'ds_list_add(id, value, ...)',
            description: 'Adds values to a DS list.',
            parameters: [
                { name: 'id', type: 'id', description: 'The list ID' },
                { name: 'value', type: 'any', description: 'The value(s) to add' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Data Structures'
        }],
    ['ds_list_find_value', {
            name: 'ds_list_find_value',
            signature: 'ds_list_find_value(id, pos)',
            description: 'Gets a value from a DS list at a position.',
            parameters: [
                { name: 'id', type: 'id', description: 'The list ID' },
                { name: 'pos', type: 'real', description: 'The position (0-based)' }
            ],
            returns: { type: 'any', description: 'The value at the position' },
            category: 'Data Structures'
        }],
    ['ds_list_size', {
            name: 'ds_list_size',
            signature: 'ds_list_size(id)',
            description: 'Returns the size of a DS list.',
            parameters: [{ name: 'id', type: 'id', description: 'The list ID' }],
            returns: { type: 'real', description: 'The number of elements in the list' },
            category: 'Data Structures'
        }],
    // JSON functions
    ['json_stringify', {
            name: 'json_stringify',
            signature: 'json_stringify(val)',
            description: 'Converts a struct or array to a JSON string.',
            parameters: [{ name: 'val', type: 'struct/array', description: 'The value to convert' }],
            returns: { type: 'string', description: 'The JSON string' },
            category: 'JSON'
        }],
    ['json_parse', {
            name: 'json_parse',
            signature: 'json_parse(json)',
            description: 'Parses a JSON string into a struct or array.',
            parameters: [{ name: 'json', type: 'string', description: 'The JSON string to parse' }],
            returns: { type: 'struct/array', description: 'The parsed data' },
            category: 'JSON'
        }],
    // Struct functions
    ['struct_exists', {
            name: 'struct_exists',
            signature: 'struct_exists(struct, name)',
            description: 'Checks if a variable exists in a struct.',
            parameters: [
                { name: 'struct', type: 'struct', description: 'The struct to check' },
                { name: 'name', type: 'string', description: 'The variable name' }
            ],
            returns: { type: 'bool', description: 'True if the variable exists' },
            category: 'Structs'
        }],
    ['struct_get', {
            name: 'struct_get',
            signature: 'struct_get(struct, name)',
            description: 'Gets a variable from a struct.',
            parameters: [
                { name: 'struct', type: 'struct', description: 'The struct' },
                { name: 'name', type: 'string', description: 'The variable name' }
            ],
            returns: { type: 'any', description: 'The variable value, or undefined' },
            category: 'Structs'
        }],
    ['struct_set', {
            name: 'struct_set',
            signature: 'struct_set(struct, name, val)',
            description: 'Sets a variable in a struct.',
            parameters: [
                { name: 'struct', type: 'struct', description: 'The struct' },
                { name: 'name', type: 'string', description: 'The variable name' },
                { name: 'val', type: 'any', description: 'The value to set' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Structs'
        }],
    ['struct_get_names', {
            name: 'struct_get_names',
            signature: 'struct_get_names(struct)',
            description: 'Gets an array of all variable names in a struct.',
            parameters: [{ name: 'struct', type: 'struct', description: 'The struct' }],
            returns: { type: 'array', description: 'Array of variable names' },
            category: 'Structs'
        }],
    // Layer functions
    ['layer_get_id', {
            name: 'layer_get_id',
            signature: 'layer_get_id(layer_name)',
            description: 'Gets the ID of a layer by name.',
            parameters: [{ name: 'layer_name', type: 'string', description: 'The name of the layer' }],
            returns: { type: 'id', description: 'The layer ID, or -1 if not found' },
            category: 'Layers'
        }],
    ['layer_create', {
            name: 'layer_create',
            signature: 'layer_create(depth, name?)',
            description: 'Creates a new layer at a depth.',
            parameters: [
                { name: 'depth', type: 'real', description: 'The depth of the layer' },
                { name: 'name', type: 'string', description: 'Optional name for the layer' }
            ],
            returns: { type: 'id', description: 'The ID of the new layer' },
            category: 'Layers'
        }],
    ['layer_destroy', {
            name: 'layer_destroy',
            signature: 'layer_destroy(layer_id)',
            description: 'Destroys a layer.',
            parameters: [{ name: 'layer_id', type: 'id', description: 'The layer to destroy' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Layers'
        }],
    // Surface functions
    ['surface_create', {
            name: 'surface_create',
            signature: 'surface_create(w, h)',
            description: 'Creates a new surface.',
            parameters: [
                { name: 'w', type: 'real', description: 'Width of the surface' },
                { name: 'h', type: 'real', description: 'Height of the surface' }
            ],
            returns: { type: 'id', description: 'The surface ID' },
            category: 'Surfaces'
        }],
    ['surface_free', {
            name: 'surface_free',
            signature: 'surface_free(id)',
            description: 'Frees a surface from memory.',
            parameters: [{ name: 'id', type: 'id', description: 'The surface to free' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Surfaces'
        }],
    ['surface_exists', {
            name: 'surface_exists',
            signature: 'surface_exists(id)',
            description: 'Checks if a surface exists.',
            parameters: [{ name: 'id', type: 'id', description: 'The surface to check' }],
            returns: { type: 'bool', description: 'True if the surface exists' },
            category: 'Surfaces'
        }],
    ['surface_set_target', {
            name: 'surface_set_target',
            signature: 'surface_set_target(id)',
            description: 'Sets the draw target to a surface.',
            parameters: [{ name: 'id', type: 'id', description: 'The surface to draw to' }],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Surfaces'
        }],
    ['surface_reset_target', {
            name: 'surface_reset_target',
            signature: 'surface_reset_target()',
            description: 'Resets the draw target to the application surface.',
            parameters: [],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Surfaces'
        }],
    ['draw_surface', {
            name: 'draw_surface',
            signature: 'draw_surface(id, x, y)',
            description: 'Draws a surface.',
            parameters: [
                { name: 'id', type: 'id', description: 'The surface to draw' },
                { name: 'x', type: 'real', description: 'The x position' },
                { name: 'y', type: 'real', description: 'The y position' }
            ],
            returns: { type: 'void', description: 'Nothing' },
            category: 'Surfaces'
        }]
]);
// Built-in variables database
exports.gmlVariables = new Map([
    // Instance variables
    ['x', { name: 'x', type: 'real', description: 'The x-coordinate of the instance.', readonly: false, scope: 'instance' }],
    ['y', { name: 'y', type: 'real', description: 'The y-coordinate of the instance.', readonly: false, scope: 'instance' }],
    ['xprevious', { name: 'xprevious', type: 'real', description: 'The previous x-coordinate of the instance.', readonly: true, scope: 'instance' }],
    ['yprevious', { name: 'yprevious', type: 'real', description: 'The previous y-coordinate of the instance.', readonly: true, scope: 'instance' }],
    ['xstart', { name: 'xstart', type: 'real', description: 'The starting x-coordinate of the instance.', readonly: true, scope: 'instance' }],
    ['ystart', { name: 'ystart', type: 'real', description: 'The starting y-coordinate of the instance.', readonly: true, scope: 'instance' }],
    ['hspeed', { name: 'hspeed', type: 'real', description: 'The horizontal speed of the instance.', readonly: false, scope: 'instance' }],
    ['vspeed', { name: 'vspeed', type: 'real', description: 'The vertical speed of the instance.', readonly: false, scope: 'instance' }],
    ['speed', { name: 'speed', type: 'real', description: 'The speed of the instance.', readonly: false, scope: 'instance' }],
    ['direction', { name: 'direction', type: 'real', description: 'The direction of motion (0-360 degrees).', readonly: false, scope: 'instance' }],
    ['friction', { name: 'friction', type: 'real', description: 'The friction that slows down the instance.', readonly: false, scope: 'instance' }],
    ['gravity', { name: 'gravity', type: 'real', description: 'The gravity affecting the instance.', readonly: false, scope: 'instance' }],
    ['gravity_direction', { name: 'gravity_direction', type: 'real', description: 'The direction of gravity (0-360 degrees).', readonly: false, scope: 'instance' }],
    ['sprite_index', { name: 'sprite_index', type: 'sprite', description: 'The sprite assigned to this instance.', readonly: false, scope: 'instance' }],
    ['sprite_width', { name: 'sprite_width', type: 'real', description: 'The width of the sprite.', readonly: true, scope: 'instance' }],
    ['sprite_height', { name: 'sprite_height', type: 'real', description: 'The height of the sprite.', readonly: true, scope: 'instance' }],
    ['image_index', { name: 'image_index', type: 'real', description: 'The current sub-image (frame) of the sprite.', readonly: false, scope: 'instance' }],
    ['image_speed', { name: 'image_speed', type: 'real', description: 'The animation speed (frames per step).', readonly: false, scope: 'instance' }],
    ['image_number', { name: 'image_number', type: 'real', description: 'The number of sub-images in the sprite.', readonly: true, scope: 'instance' }],
    ['image_xscale', { name: 'image_xscale', type: 'real', description: 'The horizontal scale of the sprite.', readonly: false, scope: 'instance' }],
    ['image_yscale', { name: 'image_yscale', type: 'real', description: 'The vertical scale of the sprite.', readonly: false, scope: 'instance' }],
    ['image_angle', { name: 'image_angle', type: 'real', description: 'The rotation angle of the sprite.', readonly: false, scope: 'instance' }],
    ['image_alpha', { name: 'image_alpha', type: 'real', description: 'The alpha (transparency) of the sprite (0-1).', readonly: false, scope: 'instance' }],
    ['image_blend', { name: 'image_blend', type: 'color', description: 'The blend color of the sprite.', readonly: false, scope: 'instance' }],
    ['visible', { name: 'visible', type: 'bool', description: 'Whether the instance is visible.', readonly: false, scope: 'instance' }],
    ['solid', { name: 'solid', type: 'bool', description: 'Whether the instance is solid.', readonly: false, scope: 'instance' }],
    ['persistent', { name: 'persistent', type: 'bool', description: 'Whether the instance persists between rooms.', readonly: false, scope: 'instance' }],
    ['depth', { name: 'depth', type: 'real', description: 'The drawing depth of the instance.', readonly: false, scope: 'instance' }],
    ['layer', { name: 'layer', type: 'id', description: 'The layer ID the instance is on.', readonly: false, scope: 'instance' }],
    ['id', { name: 'id', type: 'id', description: 'The unique ID of this instance.', readonly: true, scope: 'instance' }],
    ['object_index', { name: 'object_index', type: 'object', description: 'The object this instance was created from.', readonly: true, scope: 'instance' }],
    ['mask_index', { name: 'mask_index', type: 'sprite', description: 'The sprite used as a collision mask.', readonly: false, scope: 'instance' }],
    ['bbox_left', { name: 'bbox_left', type: 'real', description: 'The left edge of the bounding box.', readonly: true, scope: 'instance' }],
    ['bbox_right', { name: 'bbox_right', type: 'real', description: 'The right edge of the bounding box.', readonly: true, scope: 'instance' }],
    ['bbox_top', { name: 'bbox_top', type: 'real', description: 'The top edge of the bounding box.', readonly: true, scope: 'instance' }],
    ['bbox_bottom', { name: 'bbox_bottom', type: 'real', description: 'The bottom edge of the bounding box.', readonly: true, scope: 'instance' }],
    ['alarm', { name: 'alarm', type: 'array', description: 'Array of alarm timers (alarm[0] to alarm[11]).', readonly: false, scope: 'instance' }],
    // Global variables
    ['room', { name: 'room', type: 'room', description: 'The current room.', readonly: false, scope: 'global' }],
    ['room_width', { name: 'room_width', type: 'real', description: 'The width of the current room.', readonly: true, scope: 'global' }],
    ['room_height', { name: 'room_height', type: 'real', description: 'The height of the current room.', readonly: true, scope: 'global' }],
    ['room_speed', { name: 'room_speed', type: 'real', description: 'The game speed in frames per second.', readonly: false, scope: 'global' }],
    ['fps', { name: 'fps', type: 'real', description: 'The current frames per second.', readonly: true, scope: 'global' }],
    ['fps_real', { name: 'fps_real', type: 'real', description: 'The actual frames per second (not capped).', readonly: true, scope: 'global' }],
    ['delta_time', { name: 'delta_time', type: 'real', description: 'Time since last frame in microseconds.', readonly: true, scope: 'global' }],
    ['current_time', { name: 'current_time', type: 'real', description: 'Time since the game started in milliseconds.', readonly: true, scope: 'global' }],
    ['mouse_x', { name: 'mouse_x', type: 'real', description: 'The x-coordinate of the mouse in the room.', readonly: true, scope: 'global' }],
    ['mouse_y', { name: 'mouse_y', type: 'real', description: 'The y-coordinate of the mouse in the room.', readonly: true, scope: 'global' }],
    ['keyboard_key', { name: 'keyboard_key', type: 'real', description: 'The keycode of the last pressed key.', readonly: true, scope: 'global' }],
    ['keyboard_lastkey', { name: 'keyboard_lastkey', type: 'real', description: 'The keycode of the last pressed key.', readonly: false, scope: 'global' }],
    ['keyboard_lastchar', { name: 'keyboard_lastchar', type: 'string', description: 'The character of the last pressed key.', readonly: false, scope: 'global' }],
    ['view_camera', { name: 'view_camera', type: 'array', description: 'Array of camera IDs for each view.', readonly: false, scope: 'global' }],
    ['view_enabled', { name: 'view_enabled', type: 'bool', description: 'Whether views are enabled.', readonly: false, scope: 'global' }],
    ['view_current', { name: 'view_current', type: 'real', description: 'The currently drawing view (0-7).', readonly: true, scope: 'global' }],
    ['application_surface', { name: 'application_surface', type: 'id', description: 'The main application surface.', readonly: true, scope: 'global' }],
    ['async_load', { name: 'async_load', type: 'id', description: 'DS map containing async event data.', readonly: true, scope: 'global' }],
    ['debug_mode', { name: 'debug_mode', type: 'bool', description: 'Whether the game is running in debug mode.', readonly: true, scope: 'global' }],
    ['game_id', { name: 'game_id', type: 'real', description: 'Unique identifier for the game.', readonly: true, scope: 'global' }],
    ['working_directory', { name: 'working_directory', type: 'string', description: 'The working directory path.', readonly: true, scope: 'global' }],
    ['temp_directory', { name: 'temp_directory', type: 'string', description: 'The temporary directory path.', readonly: true, scope: 'global' }],
    ['os_type', { name: 'os_type', type: 'constant', description: 'The operating system type.', readonly: true, scope: 'global' }],
    ['os_device', { name: 'os_device', type: 'constant', description: 'The device type.', readonly: true, scope: 'global' }],
    ['os_browser', { name: 'os_browser', type: 'constant', description: 'The browser type (for HTML5).', readonly: true, scope: 'global' }],
    // Constants
    ['self', { name: 'self', type: 'id', description: 'Reference to the current instance.', readonly: true, scope: 'constant' }],
    ['other', { name: 'other', type: 'id', description: 'Reference to the other instance in collision events.', readonly: true, scope: 'constant' }],
    ['all', { name: 'all', type: 'constant', description: 'Refers to all instances.', readonly: true, scope: 'constant' }],
    ['noone', { name: 'noone', type: 'constant', description: 'No instance (returned when no instance is found).', readonly: true, scope: 'constant' }],
    ['global', { name: 'global', type: 'struct', description: 'Reference to the global scope.', readonly: true, scope: 'constant' }],
    ['undefined', { name: 'undefined', type: 'constant', description: 'The undefined value.', readonly: true, scope: 'constant' }],
    ['true', { name: 'true', type: 'bool', description: 'Boolean true value (1).', readonly: true, scope: 'constant' }],
    ['false', { name: 'false', type: 'bool', description: 'Boolean false value (0).', readonly: true, scope: 'constant' }],
    ['pi', { name: 'pi', type: 'real', description: 'The mathematical constant π (3.14159...).', readonly: true, scope: 'constant' }]
]);
//# sourceMappingURL=gmlFunctions.js.map