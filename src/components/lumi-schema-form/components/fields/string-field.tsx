import React from "react";
import type { FieldComponentProps } from "../../utils/field-registry";
import TextWidget from "../widgets/text-widget";

/**
 * @description 字符串字段组件
 * @param props 组件属性
 * @returns React元素
 */
const StringField = (props: FieldComponentProps): React.ReactElement => {
  const { name, schema, value, onChange } = props;
  const stringValue = (value === undefined || value === null) ? "" : String(value);

  // 如果有枚举值，渲染下拉选择框
  if (schema.enum && Array.isArray(schema.enum)) {
    return (
      <select
        id={name}
        value={stringValue}
        onChange={(e): void => onChange(name, e.target.value)}
      >
        <option value="">请选择...</option>
        {schema.enum.map((option) => (
          <option key={String(option)} value={String(option)}>
            {String(option)}
          </option>
        ))}
      </select>
    );
  }

  // 特殊格式处理
  if (schema.format) {
    switch (schema.format) {
      case "date":
        return (
          <input
            type="date"
            id={name}
            value={stringValue}
            onChange={(e): void => onChange(name, e.target.value)}
          />
        );
      case "email":
        return (
          <input
            type="email"
            id={name}
            value={stringValue}
            onChange={(e): void => onChange(name, e.target.value)}
          />
        );
      case "password":
        return (
          <input
            type="password"
            id={name}
            value={stringValue}
            onChange={(e): void => onChange(name, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            id={name}
            value={stringValue}
            onChange={(e): void => onChange(name, e.target.value)}
            rows={5}
          />
        );
    }
  }

  // 默认文本框
  return <TextWidget 
    id={name} 
    value={stringValue} 
    onChange={(val: string): void => onChange(name, val)}
  />;
};

export default StringField;
