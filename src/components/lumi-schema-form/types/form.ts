import type { ISchema } from "./schema";
import type { FormInstance } from "../hooks/use-form";
import type { Validator } from "../validators/default";

/**
 * @description Schema Form 组件属性接口
 */
export interface SchemaFormProps {
    /** JSON Schema */
    schema: ISchema;
    /** 初始值 */
    initialValues?: Record<string, unknown>;
    /** 表单实例 */
    form?: FormInstance;
    /** 提交回调 */
    onSubmit?: (values: Record<string, unknown>) => void;
    /** 值变化回调 */
    onChange?: (values: Record<string, unknown>) => void;
    /** 自定义验证器 */
    validator?: Validator;
}

/**
 * @description 字段组件的基本属性接口
 */
export interface FieldProps<T = unknown> {
    /** 字段名称 */
    name: string;
    /** 字段 schema 定义 */
    schema: ISchema;
    /** 字段值 */
    value?: T;
    /** 值变化回调函数 */
    onChange: (name: string, value: T) => void;
}
