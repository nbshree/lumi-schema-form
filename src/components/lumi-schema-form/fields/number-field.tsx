import React from "react";
import type { ISchema } from "../data";

/**
 * @description Number field properties interface
 */
interface NumberFieldProps {
  /** Field name */
  name: string;
  /** Field schema */
  schema: ISchema;
  /** Field value */
  value?: number;
  /** Value change callback */
  onChange: (name: string, value: number | undefined) => void;
}

/**
 * @description Component for rendering number input fields
 * @param props Component parameters
 */
const NumberField = (props: NumberFieldProps) => {
  const { name, schema, value, onChange } = props;

  return (
    <input
      type="number"
      id={name}
      value={value === undefined ? "" : value}
      onChange={(e) =>
        onChange(
          name,
          e.target.value ? Number(e.target.value) : undefined
        )
      }
      min={schema.minimum}
      max={schema.maximum}
      step={schema.type === "integer" ? 1 : "any"}
    />
  );
};

export default NumberField;
