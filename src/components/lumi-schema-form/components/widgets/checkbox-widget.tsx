/* eslint-disable no-unused-vars */
import React from "react";

/**
 * @description Checkbox widget properties interface
 */
interface CheckboxWidgetProps {
  /** Field ID */
  id: string;
  /** Field value */
  value?: boolean;
  /** Value change callback */
  onChange: (value: boolean) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/**
 * @description Component for rendering checkbox input widget
 * @param props Component parameters
 */
const CheckboxWidget = (props: CheckboxWidgetProps): React.ReactElement => {
  const { id, value, onChange, disabled = false } = props;

  return (
    <input
      type="checkbox"
      id={id}
      checked={!!value}
      onChange={(e): void => onChange(e.target.checked)}
      disabled={disabled}
    />
  );
};

export default CheckboxWidget;
