/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FieldTemplate } from "./components/templates";
import { getFieldType, isRequired } from "./utils/schema";
import { fieldRegistry } from "./utils/field-registry";
import { DefaultValidator, type Validator } from "./validators";
import type { ISchema } from "./types";
import type { SchemaFormProps } from "./types/form";
import { useRefState } from "./hooks/use-ref-state";
import type { ValidationError } from "./utils/validation";
import { useMemoizedFn } from "ahooks";

/**
 * @description 基于JSON Schema生成表单的React组件
 * @param props 组件属性
 */
const SchemaForm = (props: SchemaFormProps): React.ReactElement => {
  const {
    schema,
    initialValues = {},
    form,
    onChange,
    onSubmit,
    validator,
  } = props;
  const [valuesRef, values, setValues] =
    useRefState<Record<string, unknown>>(initialValues);
  const schemaValidator: Validator = validator || new DefaultValidator();

  // 管理字段错误状态 - 按字段路径索引
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ValidationError[]>
  >({});

  // 跟踪最后修改的字段
  const [lastChangedField, setLastChangedField] = useState<string | null>(null);

  /**
   * 处理字段值变化
   * @param name 字段名称
   * @param value 字段新值
   */
  /**
   * 获取嵌套字段的schema
   * @param path 字段路径，如 "obj.name"
   * @returns 字段schema或者undefined如果不存在
   */
  const getNestedFieldSchema = (path: string): { schema: ISchema; parentPath: string } | undefined => {
    // 如果是顶层字段，直接返回
    if (!path.includes(".")) {
      if (schema.type === "object" && schema.properties && schema.properties[path]) {
        return { schema: schema.properties[path], parentPath: "" };
      }
      return undefined;
    }

    // 分解路径部分
    const pathParts = path.split(".");
    let currentSchema = schema;
    let parentPath = "";

    // 遍历除最后一部分外的所有路径部分
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (currentSchema.type !== "object" || !currentSchema.properties || !currentSchema.properties[part]) {
        return undefined; // 路径不存在
      }

      currentSchema = currentSchema.properties[part];
      parentPath = parentPath ? `${parentPath}.${part}` : part;
    }

    // 检查最后一部分
    const lastPart = pathParts[pathParts.length - 1];
    if (currentSchema.type !== "object" || !currentSchema.properties || !currentSchema.properties[lastPart]) {
      return undefined;
    }

    return { 
      schema: currentSchema.properties[lastPart],
      parentPath
    };
  };

  /**
   * 根据路径设置嵌套对象的值
   * @param obj 目标对象
   * @param path 要设置的路径
   * @param value 字段值
   */
  const setNestedValue = (obj: Record<string, unknown>, path: string, value: unknown): void => {
    // 如果不是嵌套路径，直接设置
    if (!path.includes(".")) {
      obj[path] = value;
      return;
    }

    const pathParts = path.split(".");
    let current = obj;

    // 遍历路径部分，确保所有对象存在
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (current[part] === undefined || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    // 设置最终属性
    current[pathParts[pathParts.length - 1]] = value;
  };

  const handleFieldChange = (name: string, value: unknown): void => {
    // 创建新的值对象
    const newValues = { ...values };
    // 处理嵌套字段路径
    setNestedValue(newValues, name, value);
    
    // 更新表单值并记录最后修改的字段
    setValues(newValues);
    setLastChangedField(name);

    // 获取字段 schema 并进行验证
    const fieldInfo = getNestedFieldSchema(name);
    
    if (fieldInfo) {
      // 只验证当前修改的字段
      const errors = schemaValidator.validateValue(value, fieldInfo.schema, name);
      
      // 更新字段错误状态
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errors }));
    }

    if (onChange) {
      onChange(newValues);
    }
  };

  /**
   * 处理表单提交
   * @returns 验证是否通过
   */
  const handleSubmit = useMemoizedFn((): boolean => {
    // 使用验证器验证表单数据
    const errors = schemaValidator.validate(values, schema);

    // 将错误按字段分组
    const errorsByField: Record<string, ValidationError[]> = {};
    errors.forEach((err) => {
      if (!errorsByField[err.path]) {
        errorsByField[err.path] = [];
      }
      errorsByField[err.path].push(err);
    });

    // 更新字段错误状态
    setFieldErrors(errorsByField);
    setLastChangedField(null); // 重置最后更改字段记录

    // 如果没有错误，调用提交回调并返回成功
    if (errors.length === 0) {
      if (onSubmit) {
        onSubmit(values);
      }
      return true;
    } else {
      console.error("表单验证失败:", errors);
      return false;
    }
  });

  // 如果提供了表单实例，设置双向绑定
  useEffect(() => {
    if (form) {
      // 注册提交函数，先验证，后提交
      form._registerSubmitFn(() => {
        // 调用 handleSubmit 进行验证，如果验证成功会自动调用 onSubmit
        return handleSubmit();
      });

      // 注册值变更回调，当表单实例的值变化时更新组件状态
      form._registerChangeCallback((newValues) => {
        setValues(newValues);
      });

      // 初始同步组件值到表单实例
      form.setValues(valuesRef.current);
    }

    // 清理函数
    return () => {
      if (form) {
        form._registerSubmitFn(() => {});
        form._registerChangeCallback(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]); // 只在 form 实例变化时重新设置回调

  /**
   * 渲染表单字段
   * @returns 表单字段React节点
   */
  /**
   * 获取字段相关的所有错误
   * @param fieldPath 字段路径名称
   * @returns 错误数组
   */
  const getFieldErrors = (fieldPath: string): ValidationError[] => {
    // 直接获取完全匹配的错误
    const directErrors = fieldErrors[fieldPath] || [];
    
    // 如果是嵌套路径的父对象，查找所有以该路径开头的错误记录
    // 例如：如果 fieldPath 是 "obj"，我们要查找 "obj.name" 等所有嵌套字段的错误
    const nestedErrors: ValidationError[] = [];
    if (fieldPath) {
      const prefix = `${fieldPath}.`;
      Object.entries(fieldErrors).forEach(([path, errors]) => {
        if (path.startsWith(prefix)) {
          nestedErrors.push(...errors);
        }
      });
    }
    
    return [...directErrors, ...nestedErrors];
  };

  const renderFormFields = (): React.ReactNode => {
    if (schema.type !== "object" || !schema.properties) {
      return <div>Schema must be an object type with properties</div>;
    }

    return Object.entries(schema.properties).map(([name, fieldSchema]) => {
      // 获取字段错误信息，包含直接错误和嵌套错误
      const fieldErrorsArray = getFieldErrors(name);
      const errorMessage =
        fieldErrorsArray.length > 0 ? fieldErrorsArray[0].message : undefined;

      // 判断字段是否需要特殊高亮
      // 如果是嵌套字段，检查最后更改的字段是否以当前路径开头
      const isHighlight =
        (lastChangedField === name || 
          (lastChangedField && lastChangedField.startsWith(`${name}.`))) && 
        fieldErrorsArray.length > 0;

      return (
        <FieldTemplate
          key={name}
          id={name}
          label={fieldSchema.title || name}
          description={fieldSchema.description}
          required={isRequired(name, schema)}
          schema={fieldSchema}
          error={errorMessage}
          className={isHighlight ? "field-highlight" : ""}
        >
          {renderFieldComponent(name, fieldSchema)}
        </FieldTemplate>
      );
    });
  };

  /**
   * 根据字段类型渲染对应的字段组件
   * @param name 字段名称
   * @param fieldSchema 字段Schema
   * @returns 字段组件React节点
   */
  /**
   * 获取指定路径的所有错误信息
   * @param path 要查找的字段路径
   * @returns 错误信息（如果有）
   */
  const getErrorForPath = (path: string): string | undefined => {
    // 直接匹配当前路径
    const directErrors = fieldErrors[path] || [];
    if (directErrors.length > 0) {
      return directErrors[0].message;
    }
    return undefined;
  };

  const renderFieldComponent = (
    name: string,
    fieldSchema: ISchema
  ): React.ReactNode => {
    const value = values[name];
    const fieldType = getFieldType(fieldSchema);
    const error = getErrorForPath(name);

    // 使用全局单例注册表获取字段组件
    const FieldComponent = fieldRegistry.getFieldComponent(fieldType);

    if (!FieldComponent) {
      return <div>Unsupported field type: {fieldType}</div>;
    }

    // 特别处理对象类型，确保错误信息能够传递
    if (fieldType === 'object') {
      return (
        <FieldComponent
          name={name}
          schema={fieldSchema}
          value={value}
          onChange={handleFieldChange}
          error={error}
        />
      );
    }
    
    // 其他类型字段的渲染
    return (
      <FieldComponent
        name={name}
        schema={fieldSchema}
        value={value}
        onChange={handleFieldChange}
      />
    );
  };

  return <div className="schema-form">{renderFormFields()}</div>;
};

export default SchemaForm;
