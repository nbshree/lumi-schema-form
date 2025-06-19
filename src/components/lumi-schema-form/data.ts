/**
 * @description Interface representing a JSON Schema structure
 */
export interface ISchema {
    /** Schema type (string, number, object, array, boolean, null) */
    type?: string | string[];
    /** Schema title */
    title?: string;
    /** Schema description */
    description?: string;
    /** Default value */
    default?: any;
    /** For object type, properties definitions */
    properties?: Record<string, ISchema>;
    /** For array type, item definition */
    items?: ISchema | ISchema[];
    /** Required properties (for object type) */
    required?: string[];
    /** Minimum value (for number type) */
    minimum?: number;
    /** Maximum value (for number type) */
    maximum?: number;
    /** Minimum length (for string or array type) */
    minLength?: number;
    /** Maximum length (for string or array type) */
    maxLength?: number;
    /** String pattern (for string type) */
    pattern?: string;
    /** Enumerated values */
    enum?: any[];
    /** Format hint (e.g., date, email, url) */
    format?: string;
    /** Custom UI widget to render */
    widget?: string;
    /** Additional properties for UI customization */
    ui?: Record<string, any>;
    /** Allow any additional properties to be defined */
    [key: string]: any;
}