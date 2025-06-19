import React from "react";
import type { FieldComponentProps } from "../../utils/field-registry";
import CheckboxWidget from "../widgets/checkbox-widget";

/**
 * @description 渲染布尔类型的输入字段组件
 * @param props 组件参数
 */
const BooleanField = (props: FieldComponentProps): React.ReactElement => {
  const { name, value, onChange } = props;
  
  // 将 unknown 类型的值转换为布尔值
  const boolValue = value === true || value === "true" || value === 1;

  return (
    <CheckboxWidget
      id={name}
      value={boolValue}
      onChange={(checked: boolean): void => onChange(name, checked)}
    />
  );
};

export default BooleanField;
