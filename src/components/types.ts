import type { ISchema } from "./lumi-schema-form/data";
import type { FormInstance } from "./lumi-schema-form/hooks/use-form";


/**
 * @description SchemaForm组件的属性接口
 */
export interface SchemaFormProps {
  /** 表单的Schema定义 */
  schema: ISchema;
  /** 表单的初始值 */
  initialValues?: Record<string, unknown>;
  /** 表单实例，用于控制表单 */
  form?: FormInstance;
  /** 表单值变化时的回调 */
  onChange?: (values: Record<string, unknown>) => void;
  /** 表单提交时的回调 */
  onSubmit?: (values: Record<string, unknown>) => void;
}

/**
 * @description 通用字段属性接口
 */
export interface FieldProps {
  /** 字段名称 */
  name: string;
  /** 字段模式 */
  schema: ISchema;
  /** 字段值 */
  value: unknown;
  /** 值变化回调 */
  onChange: (name: string, value: unknown) => void;
}
