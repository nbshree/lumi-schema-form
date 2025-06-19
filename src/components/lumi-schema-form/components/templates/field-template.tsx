/* eslint-disable no-unused-vars */
import React from "react";
import type { ISchema } from "../../types";

/**
 * @description 字段模板属性接口
 */
interface FieldTemplateProps {
  /** 字段ID */
  id: string;
  /** 字段标签 */
  label?: string;
  /** 字段描述 */
  description?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否有错误 */
  error?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义CSS类名 */
  className?: string;
  /** 字段内容 */
  children: React.ReactNode;
  /** 字段Schema */
  schema?: ISchema;
}

/**
 * @description 字段模板组件，提供统一的字段布局
 * @param props 组件参数
 */
const FieldTemplate = (props: FieldTemplateProps): React.ReactElement => {
  const {
    id,
    label,
    description,
    required,
    error,
    children,
    className = "",
    schema,
  } = props;

  // 如果有错误，添加错误类名
  const fieldClassName = `form-field ${className} ${
    error ? "field-error" : ""
  }`;
  console.log(error);
  return (
    <div className={fieldClassName}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required-mark">*</span>}
          {description && (
            <span className="field-description" title={description}>
              ℹ️
            </span>
          )}
        </label>
      )}
      <div className="field-input">{children}</div>
      {error && <div className="field-error-text">{error}</div>}
    </div>
  );
};

export default FieldTemplate;
