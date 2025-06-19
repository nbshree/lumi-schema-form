import React from "react";
import type { ISchema } from "../types/schema";
import { StringField, NumberField, BooleanField, ObjectField } from "../components/fields";

const DEFAULT_FIELD_COMPONENTS: Record<string, FieldComponent> = {
  string: StringField,
  number: NumberField,
  integer: NumberField,
  boolean: BooleanField,
  object: ObjectField,
};

/**
 * @description 通用字段组件属性接口
 */
export interface FieldComponentProps {
  /** Field name */
  name: string;
  /** Field schema */
  schema: ISchema;
  /** Field value */
  value?: unknown;
  /** Field value change callback */
  onChange: (name: string, value: unknown) => void;
  /** Field error message */
  error?: string;
}

/**
 * @description 字段组件类型
 */
export type FieldComponent = React.ComponentType<FieldComponentProps>;

/**
 * @description Field registry singleton class
 * @class FieldRegistry
 */
export class FieldRegistry {
  private static instance: FieldRegistry;
  private registry: Record<string, FieldComponent> = {};
  
  /**
   * @description 私有构造函数，防止外部直接创建实例
   * @private
   */
  private constructor() {}
  
  /**
   * @description 获取单例实例
   * @returns FieldRegistry 单例实例
   */
  public static getInstance(): FieldRegistry {
    if (!FieldRegistry.instance) {
      FieldRegistry.instance = new FieldRegistry();
      FieldRegistry.instance.registerFields(DEFAULT_FIELD_COMPONENTS);
    }
    return FieldRegistry.instance;
  }

  /**
   * @description Get field component by field type
   * @param type Field type
   * @returns Field component or undefined if not found
   */
  public getFieldComponent(type: string): FieldComponent | undefined {
    return this.registry[type];
  }

  /**
   * @description Register a field component by type
   * @param type Field type
   * @param component Field component
   */
  public registerField(type: string, component: FieldComponent): void {
    if (!type) {
      throw new Error("字段类型不能为空");
    }
    if (!component) {
      throw new Error("字段组件不能为空");
    }
    
    this.registry[type] = component;
  }

  /**
   * @description Register multiple field components
   * @param fields Field components record
   */
  public registerFields(fields: Record<string, FieldComponent>): void {
    Object.entries(fields).forEach(([type, component]) => {
      if (component) {
        this.registerField(type, component);
      }
    });
  }
}

/**
 * @description 默认字段注册表单例
 */
export const fieldRegistry = FieldRegistry.getInstance();
