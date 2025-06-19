import { useState } from "react";
import "./App.css";
import SchemaForm from "./components/lumi-schema-form/schema-form";
import type { ISchema } from "./components/lumi-schema-form/types/schema";
import { useForm } from "./components/lumi-schema-form/hooks/use-form";

function App() {
  // 定义一个示例 schema
  const userFormSchema: ISchema = {
    type: "object",
    title: "用户信息表单",
    description: "请填写您的个人信息",
    properties: {
      obj: {
        type: "object",
        title: "对象",
        properties: {
          name: {
            type: "string",
            title: "obj姓名",
            description: "请输入您的全名",
            minLength: 2,
            maxLength: 50,
            required: true,
          },
        },
      },
      name: {
        type: "string",
        title: "姓名",
        description: "请输入您的全名",
        minLength: 2,
        maxLength: 50,
      },
      email: {
        type: "string",
        title: "电子邮箱",
        description: "请输入有效的电子邮箱地址",
        format: "email",
        required: true,
      },
      age: {
        type: "number",
        title: "年龄",
        description: "请输入您的年龄",
        minimum: 18,
        maximum: 120,
        required: true,
      },
      gender: {
        type: "string",
        title: "性别",
        enum: ["男", "女", "其他", "不愿透露"],
      },
      subscribe: {
        type: "boolean",
        title: "订阅通讯",
        description: "是否接收最新资讯和优惠信息",
      },
      bio: {
        type: "string",
        title: "个人简介",
        description: "请简单介绍一下您自己",
        format: "textarea",
      },
    },
  };

  // 初始表单值
  const initialValues = {
    name: "",
    email: "",
    age: 25,
    gender: "",
    subscribe: false,
    bio: "",
  };

  // 状态管理
  const [submittedValues, setSubmittedValues] = useState<Record<
    string,
    unknown
  > | null>(null);

  // 处理表单值变化
  const handleFormChange = (values: Record<string, unknown>) => {
    console.log("Form values changed:", values);
    // 只记录值变化，不需要保存到状态
  };

  // 处理表单提交
  const handleFormSubmit = (values: Record<string, unknown>) => {
    console.log("Form submitted with values:", values);
    setSubmittedValues(values);
  };

  // 创建表单实例
  const form = useForm(initialValues);

  // 处理自定义提交按钮点击
  const handleSubmitClick = () => {
    form.submit();
  };

  return (
    <div className="app-container">
      <h1>JSON Schema Form 示例</h1>

      <div className="form-container">
        <SchemaForm
          form={form}
          schema={userFormSchema}
          initialValues={initialValues}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
        />
      </div>

      <div className="custom-actions">
        <button onClick={handleSubmitClick} className="custom-submit-button">
          提交表单
        </button>
        <button
          onClick={() => {
            form.setValues({
              name: "test",
              email: "test",
              age: 25,
              gender: "男",
              subscribe: true,
              bio: "test",
            });
          }}
          className="custom-submit-button"
        >
          修改表单
        </button>
      </div>

      {submittedValues && (
        <div className="submitted-values">
          <h2>提交的表单数据:</h2>
          <pre>{JSON.stringify(submittedValues, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
