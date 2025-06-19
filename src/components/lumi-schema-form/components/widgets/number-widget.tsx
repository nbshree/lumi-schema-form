/* eslint-disable no-unused-vars */
import React from "react";

/**
 * @description Number widget properties interface
 */
interface NumberWidgetProps {
  /** Field ID */
  id: string;
  /** Field value */
  value?: number;
  /** Value change callback */
  onChange: (value: number | undefined) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step value for incrementing/decrementing */
  step?: number | string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * @description Component for rendering number input widget
 * @param props Component parameters
 */
const NumberWidget = (props: NumberWidgetProps): React.ReactElement => {
  const { 
    id, 
    value, 
    onChange, 
    min, 
    max, 
    step = "any",
    disabled = false,
    placeholder
  } = props;

  return (
    <input
      type="number"
      id={id}
      value={value === undefined ? "" : value}
      onChange={(e): void => 
        onChange(e.target.value ? Number(e.target.value) : undefined)
      }
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};

export default NumberWidget;
