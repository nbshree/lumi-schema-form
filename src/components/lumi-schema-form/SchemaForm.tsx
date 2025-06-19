import React, { useEffect } from "react";
import { StringField, NumberField, BooleanField } from "./fields";
import type { SchemaFormProps } from "../types";
import type { ISchema } from "./data";
import { useRefState } from "./hooks/use-ref-state";

/**
 * @description 基于JSON Schema生成表单的React组件
 * @param props 组件属性
 */
const SchemaForm = (props: SchemaFormProps) => {
  const { schema, initialValues = {}, form, onChange, onSubmit } = props;
  const [valuesRef, values, setValues] =
    useRefState<Record<string, unknown>>(initialValues);

  /**
   * 处理字段值变化
   */
  const handleFieldChange = (name: string, value: unknown): void => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    if (onChange) {
      onChange(newValues);
    }
  };

  /**
   * 处理表单提交
   */
  /**
   * @description Handle form submission
   * @param event Form event object
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  // 如果提供了表单实例，设置双向绑定
  useEffect(() => {
    if (form) {
      // 注册提交函数
      form._registerSubmitFn(() => {
        if (onSubmit) {
          onSubmit(valuesRef.current);
        }
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
   */
  const renderFormFields = (): React.ReactNode => {
    if (schema.type !== "object" || !schema.properties) {
      return <div>Schema must be an object type with properties</div>;
    }

    return Object.entries(schema.properties).map(([name, fieldSchema]) => (
      <div key={name} className="form-field">
        <label htmlFor={name}>
          {fieldSchema.title || name}
          {fieldSchema.description && (
            <span className="field-description" title={fieldSchema.description}>
              ℹ️
            </span>
          )}
        </label>
        {renderFieldInput(name, fieldSchema)}
      </div>
    ));
  };

  /**
   * 根据字段类型渲染适当的输入控件
   */
  const renderFieldInput = (
    name: string,
    fieldSchema: ISchema
  ): React.ReactNode => {
    const value = values[name];
    const fieldType = Array.isArray(fieldSchema.type)
      ? fieldSchema.type[0]
      : fieldSchema.type;

    switch (fieldType) {
      case "string":
        return (
          <StringField
            name={name}
            schema={fieldSchema}
            value={value as string | undefined}
            onChange={handleFieldChange}
          />
        );
      case "number":
      case "integer":
        return (
          <NumberField
            name={name}
            schema={fieldSchema}
            value={value as number | undefined}
            onChange={handleFieldChange}
          />
        );
      case "boolean":
        return (
          <BooleanField
            name={name}
            schema={fieldSchema}
            value={value as boolean | undefined}
            onChange={handleFieldChange}
          />
        );
      case "array":
        return <div>Array fields not supported in this simple version</div>;
      case "object":
        return (
          <div>Nested object fields not supported in this simple version</div>
        );
      default:
        return <div>Unsupported field type: {fieldType}</div>;
    }
  };

  return (
    <form className="schema-form" onSubmit={handleSubmit}>
      {renderFormFields()}
    </form>
  );
};

export default SchemaForm;
