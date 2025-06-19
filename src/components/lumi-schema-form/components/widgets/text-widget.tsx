/* eslint-disable no-unused-vars */
import React from "react";

/**
 * @description Text widget properties interface
 */
interface TextWidgetProps {
  /** Field ID */
  id: string;
  /** Field value */
  value?: string;
  /** Value change callback */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Minimum text length */
  minLength?: number;
  /** Maximum text length */
  maxLength?: number;
  /** Text pattern for validation */
  pattern?: string;
}

/**
 * @description Component for rendering text input widget
 * @param props Component parameters
 */
const TextWidget = (props: TextWidgetProps): React.ReactElement => {
  const { 
    id, 
    value, 
    onChange, 
    placeholder, 
    disabled = false,
    minLength,
    maxLength,
    pattern
  } = props;

  return (
    <input
      type="text"
      id={id}
      value={value || ""}
      onChange={(e): void => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
    />
  );
};

export default TextWidget;
