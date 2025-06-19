import type { ISchema } from "../types";

/**
 * @description Schema 处理工具类
 */
export class SchemaUtils {
  /**
   * @description Get the field type from schema
   * @param schema JSON Schema object
   * @returns Field type string
   */
  public static getFieldType(schema: ISchema): string {
    if (!schema.type) {
      return "object";
    }

    // Handle array of types case - use first type as primary
    if (Array.isArray(schema.type)) {
      return schema.type[0];
    }

    return schema.type;
  }

  /**
   * @description Get default value for a schema based on its type
   * @param schema JSON Schema object
   * @returns Default value based on schema type
   */
  public static getDefaultValue(schema: ISchema): unknown {
    if (schema.default !== undefined) {
      return schema.default;
    }

    const type = SchemaUtils.getFieldType(schema);
    
    switch (type) {
      case "string":
        return "";
      case "number":
      case "integer":
        return undefined;
      case "boolean":
        return false;
      case "array":
        return [];
      case "object":
        return {};
      default:
        return undefined;
    }
  }

  /**
   * @description Check if a field is required based on its schema
   * @param name Field name
   * @param parentSchema Parent schema
   * @returns Whether the field is required
   */
  public static isRequired(name: string, parentSchema: ISchema): boolean {
    // 检查字段自身的 schema 中的 required 属性
    if (parentSchema.properties && parentSchema.properties[name]) {
      return parentSchema.properties[name].required === true;
    }
    return false;
  }
}

// 为了向后兼容，导出静态方法的函数版本
/**
 * @description Get the field type from schema
 * @param schema JSON Schema object
 * @returns Field type string
 */
export const getFieldType = (schema: ISchema): string => {
  return SchemaUtils.getFieldType(schema);
};

/**
 * @description Get default value for a schema based on its type
 * @param schema JSON Schema object
 * @returns Default value based on schema type
 */
export const getDefaultValue = (schema: ISchema): unknown => {
  return SchemaUtils.getDefaultValue(schema);
};

/**
 * @description Check if a field is required in a schema
 * @param name Field name
 * @param schema Parent schema containing the required array
 * @returns Whether the field is required
 */
export const isRequired = (name: string, schema: ISchema): boolean => {
  return SchemaUtils.isRequired(name, schema);
};
