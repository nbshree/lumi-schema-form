import React from "react";
import type { ISchema } from "../../types/schema";
import { getFieldType } from "../../utils/schema";
import type { FieldComponentProps } from "../../utils/field-registry";
import { fieldRegistry } from "../../utils/field-registry";
import FieldTemplate from "../templates/field-template";

/**
 * @description 对象字段组件，用于处理嵌套对象
 */
export const ObjectField: React.FC<FieldComponentProps> = (props) => {
  // 解构并重命名为可读的变量
  const { name, schema, value, onChange, error } = props;
  
  /**
   * 处理子字段变更
   * @param fieldName 字段名称
   * @param fieldValue 字段值
   */
  const handleFieldChange = (fieldName: string, fieldValue: unknown): void => {
    // 处理子字段的变更，更新当前对象的值
    // 如果是子字段已经是完整路径，则直接调用onChange
    if (fieldName.includes('.')) {
      onChange(fieldName, fieldValue);
      return;
    }
    
    // 更新对象值
    const newValue = { ...((value as Record<string, unknown>) || {}) };
    newValue[fieldName] = fieldValue;
    
    // 触发两次变更：1. 使用完整路径触发子字段检验 2. 触发父对象值更新
    // 先触发子字段变更，带上完整路径
    onChange(`${name}.${fieldName}`, fieldValue);
    // 再触发对象值更新
    onChange(name, newValue);
  };
  
  // 如果没有schema或者不是对象类型，返回错误提示
  if (!schema || !schema.properties || schema.type !== "object") {
    return <div>Invalid schema for object field</div>;
  }

  /**
   * 获取子字段的错误信息
   * @param path 子字段完整路径
   * @returns 错误信息（如果有）
   */
  const getNestedFieldError = (path: string): string | undefined => {
    // 如果父字段没有错误，则返回 undefined
    if (!error) {
      return undefined;
    }
    
    // 检查错误是否属于当前子字段路径
    // 示例: 如果 path 是 "user.name"，并且 name 是 "user"，则 error 应该包含 "user.name" 的错误
    if (path.startsWith(name) && path !== name) {
      // 返回针对此子字段的错误
      return error;
    }
    
    return undefined;
  };

  /**
   * 渲染对象的所有子字段
   */
  const renderObjectFields = (): React.ReactNode => {
    if (!schema.properties) {
      return null;
    }
    
    return Object.entries(schema.properties).map(([fieldName, fieldSchema]) => {
      const fieldType = getFieldType(fieldSchema as ISchema);
      const FieldComponent = fieldRegistry.getFieldComponent(fieldType);
      
      // 构建嵌套字段的完整路径
      const fullFieldName = `${name}.${fieldName}`;
      const fieldValue = value && typeof value === 'object' 
        ? (value as Record<string, unknown>)[fieldName] 
        : undefined;
      
      // 获取子字段的错误信息
      const fieldError = getNestedFieldError(fullFieldName);
      
      if (!FieldComponent) {
        return <div key={fullFieldName}>Unsupported field type: {fieldType}</div>;
      }
      
      console.log(fieldError);
      return (
        <FieldTemplate
          key={fullFieldName}
          id={fullFieldName}
          label={fieldSchema.title || fieldName}
          description={fieldSchema.description}
          required={fieldSchema.required === true}
          schema={fieldSchema as ISchema}
          error={fieldError}
        >
          <FieldComponent
            name={fullFieldName}
            schema={fieldSchema as ISchema}
            value={fieldValue}
            onChange={handleFieldChange}
            error={fieldError}
          />
        </FieldTemplate>
      );
    });
  };

  return (
    <div className="object-field">
      {renderObjectFields()}
    </div>
  );
};

export default ObjectField;
