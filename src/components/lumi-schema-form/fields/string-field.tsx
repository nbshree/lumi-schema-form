import React from "react";
import type { ISchema } from "../data";

/**
 * @description 字符串字段属性接口
 */
interface StringFieldProps {
  /** 字段名称 */
  name: string;
  /** 字段模式 */
  schema: ISchema;
  /** 字段值 */
  value?: string;
  /** 值变化回调 */
  onChange: (name: string, value: string | undefined) => void;
}

/**
 * @description 渲染字符串类型的输入字段
 * @param props 组件参数
 */
const StringField = (props: StringFieldProps) => {
  const { name, schema, value, onChange } = props;

  // 如果有枚举值，渲染下拉选择框
  if (schema.enum && Array.isArray(schema.enum)) {
    return (
      <select
        id={name}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
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
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case "email":
        return (
          <input
            type="email"
            id={name}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case "password":
        return (
          <input
            type="password"
            id={name}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
          />
        );
      case "textarea":
        return (
          <textarea
            id={name}
            value={value || ""}
            onChange={(e) => onChange(name, e.target.value)}
            rows={5}
          />
        );
    }
  }

  // 默认文本框
  return (
    <input
      type="text"
      id={name}
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      minLength={schema.minLength}
      maxLength={schema.maxLength}
    />
  );
};

export default StringField;
