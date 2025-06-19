import type { ISchema } from "../types";
import { getFieldType } from "./schema";

/**
 * @description 验证错误类型
 */
export interface ValidationError {
  /** 错误路径 */
  path: string;
  /** 错误消息 */
  message: string;
}

/**
 * @description Schema验证器类
 */
export class SchemaValidator {
  /**
   * @description 验证整个表单数据是否符合Schema规则
   * @param values 表单数据对象
   * @param schema 根Schema定义
   * @returns 错误数组，如果没有错误则为空数组
   */
  /**
   * 递归验证对象及其嵌套字段
   * @param values 要验证的对象
   * @param schema schema定义
   * @param basePath 基础路径
   * @returns 错误数组
   */
  private validateObjectRecursive(
    values: Record<string, unknown>,
    schema: ISchema,
    basePath: string = ""
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!schema.properties) {
      return errors;
    }
    
    // 遍历所有属性进行验证
    Object.entries(schema.properties).forEach(([name, fieldSchema]) => {
      const fieldPath = basePath ? `${basePath}.${name}` : name;
      const fieldValue = values ? values[name] : undefined;
      
      // 如果字段是对象类型，递归验证
      if (fieldSchema.type === "object" && fieldSchema.properties) {
        const nestedErrors = this.validateObjectRecursive(
          fieldValue as Record<string, unknown>,
          fieldSchema,
          fieldPath
        );
        errors.push(...nestedErrors);
      } 
      // 验证当前字段
      else {
        const fieldErrors = this.validateValue(fieldValue, fieldSchema, fieldPath);
        errors.push(...fieldErrors);
      }
    });
    
    return errors;
  }
  
  public validateFormData(
    values: Record<string, unknown>,
    schema: ISchema
  ): ValidationError[] {
    // 只处理对象类型的根schema
    if (schema.type !== "object") {
      return [];
    }

    // 使用递归方法验证整个对象及其嵌套字段
    return this.validateObjectRecursive(values, schema);
  }

  /**
   * @description 验证单个值是否符合Schema规则
   * @param value 要验证的值
   * @param schema Schema定义
   * @param path 当前字段路径
   * @returns 错误数组，如果没有错误则为空数组
   */
  public validateValue(
    value: unknown,
    schema: ISchema,
    path: string
  ): ValidationError[] {
    const type = getFieldType(schema);

    switch (type) {
      case "string":
        return this.validateString(value as string | undefined, schema, path);
      case "number":
      case "integer":
        return this.validateNumber(value as number | undefined, schema, path);
      case "boolean":
        // 布尔值无需特殊验证
        return [];
      case "array":
      case "object":
        // 复杂类型验证需要递归处理，此处简化处理
        return [];
      default:
        return [];
    }
  }

  /**
   * @description 验证字符串值是否符合Schema规则
   * @param value 要验证的字符串值
   * @param schema Schema定义
   * @param path 当前字段路径
   * @returns 错误数组，如果没有错误则为空数组
   */
  public validateString(
    value: string | undefined,
    schema: ISchema,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // 如果值为空且字段必填，添加错误
    if (value === undefined || value === "") {
      if (schema.required) {
        errors.push({
          path,
          message: `${path} is required`
        });
      }
      return errors;
    }

    // 验证最小长度
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        path,
        message: `${path} should be at least ${schema.minLength} characters`
      });
    }

    // 验证最大长度
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        path,
        message: `${path} should not exceed ${schema.maxLength} characters`
      });
    }

    // 验证模式匹配
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push({
          path,
          message: `${path} does not match pattern ${schema.pattern}`
        });
      }
    }

    return errors;
  }

  /**
   * @description 验证数字值是否符合Schema规则
   * @param value 要验证的数字值
   * @param schema Schema定义
   * @param path 当前字段路径
   * @returns 错误数组，如果没有错误则为空数组
   */
  public validateNumber(
    value: number | undefined,
    schema: ISchema,
    path: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // 如果值为空且字段必填，添加错误
    if (value === undefined) {
      if (schema.required) {
        errors.push({
          path,
          message: `${path} is required`
        });
      }
      return errors;
    }

    // 验证最小值
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({
        path,
        message: `${path} should be greater than or equal to ${schema.minimum}`
      });
    }

    // 验证最大值
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({
        path,
        message: `${path} should be less than or equal to ${schema.maximum}`
      });
    }

    // 整数验证
    if (schema.type === "integer" && !Number.isInteger(value)) {
      errors.push({
        path,
        message: `${path} should be an integer`
      });
    }

    return errors;
  }
}

// 创建默认验证器实例以兼容之前的函数式API
const defaultValidator = new SchemaValidator();

/**
 * @description 验证整个表单数据是否符合Schema规则（兼容函数）
 * @param values 表单数据对象
 * @param schema 根Schema定义
 * @returns 错误数组，如果没有错误则为空数组
 */
export const validateFormData = (
  values: Record<string, unknown>,
  schema: ISchema
): ValidationError[] => {
  return defaultValidator.validateFormData(values, schema);
};

/**
 * @description 验证单个值是否符合Schema规则（兼容函数）
 * @param value 要验证的值
 * @param schema Schema定义
 * @param path 当前字段路径
 * @returns 错误数组，如果没有错误则为空数组
 */
export const validateValue = (
  value: unknown,
  schema: ISchema,
  path: string
): ValidationError[] => {
  return defaultValidator.validateValue(value, schema, path);
};
