import type { ValidationError } from "../utils/validation";
import { SchemaValidator } from "../utils/validation";
import type { ISchema } from "../types";

/**
 * @description 验证器接口
 */
export interface Validator {
  /** 
   * 验证表单数据方法
   * @param data 表单数据
   * @param schema JSON Schema
   * @returns 错误数组
   */
  validate(data: Record<string, unknown>, schema: ISchema): ValidationError[];
  
  /**
   * 验证单个字段值
   * @param value 字段值
   * @param schema 字段schema
   * @param path 字段路径
   * @returns 错误数组
   */
  validateValue(value: unknown, schema: ISchema, path: string): ValidationError[];
}

/**
 * @description 默认验证器实现，继承了 SchemaValidator 类
 */
export class DefaultValidator extends SchemaValidator implements Validator {
  /**
   * @description 验证表单数据
   * @param data 表单数据
   * @param schema JSON Schema
   * @returns 错误数组
   */
  validate(data: Record<string, unknown>, schema: ISchema): ValidationError[] {
    return this.validateFormData(data, schema);
  }
  
  /**
   * @description 验证单个字段值
   * @param value 字段值
   * @param schema 字段schema
   * @param path 字段路径
   * @returns 错误数组
   */
  validateValue(value: unknown, schema: ISchema, path: string): ValidationError[] {
    // 直接使用 SchemaValidator 中的 validateValue 方法
    return super.validateValue(value, schema, path);
  }
}
