import React from "react";
import type { FieldComponentProps } from "../../utils/field-registry";
import NumberWidget from "../widgets/number-widget";

/**
 * @description 渲染数字类型的输入字段组件
 * @param props 组件参数
 */
const NumberField = (props: FieldComponentProps): React.ReactElement => {
  const { name, schema, value, onChange } = props;
  
  // 将 unknown 类型的值转换为数字或 undefined
  const numberValue = value === undefined || value === null || isNaN(Number(value)) 
    ? undefined 
    : Number(value);

  return (
    <NumberWidget 
      id={name} 
      value={numberValue} 
      onChange={(val: number | undefined): void => onChange(name, val)}
      min={schema.minimum}
      max={schema.maximum}
      step={schema.type === "integer" ? 1 : undefined}
    />
  );
};

export default NumberField;
