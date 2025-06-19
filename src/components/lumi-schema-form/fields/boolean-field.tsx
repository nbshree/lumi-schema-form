import React from "react";
import type { ISchema } from "../data";

/**
 * @description Boolean field properties interface
 */
interface BooleanFieldProps {
  /** Field name */
  name: string;
  /** Field schema */
  schema: ISchema;
  /** Field value */
  value?: boolean;
  /** Value change callback */
  onChange: (name: string, value: boolean) => void;
}

/**
 * @description Component for rendering boolean input fields
 * @param props Component parameters
 */
const BooleanField = (props: BooleanFieldProps) => {
  const { name, value, onChange } = props;

  return (
    <input
      type="checkbox"
      id={name}
      checked={!!value}
      onChange={(e) => onChange(name, e.target.checked)}
    />
  );
};

export default BooleanField;
