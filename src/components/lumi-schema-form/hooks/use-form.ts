/**
 * @description Form control hook, creates and returns a form instance
 */
import { useMemo, useCallback } from "react";

/**
 * @description Form instance interface
 */
export interface FormInstance {
  /** Form values */
  values: Record<string, unknown>;
  
  /** Set form values */
  setValues: (values: Record<string, unknown>) => void;
  
  /** Get form values */
  getValues: () => Record<string, unknown>;
  
  /** Reset form to initial values */
  resetFields: () => void;
  
  /** Set initial values */
  setInitialValues: (values: Record<string, unknown>) => void;
  
  /** Submit form */
  submit: () => void;
  
  /** Register internal form component submit function */
  _registerSubmitFn: (fn: () => void) => void;
  
  /** Register change callback when form values change */
  _registerChangeCallback: (callback: (values: Record<string, unknown>) => void) => void;
  
  /** Internal submit function */
  _submitFn: (() => void) | null;
  
  /** Internal change callback */
  _changeCallback: ((values: Record<string, unknown>) => void) | null;
  
  /** Internal initial values */
  _initialValues: Record<string, unknown>;
}

/**
 * @description Hook to create a form instance
 * @param initialValues Initial values for the form
 * @returns Form instance
 */
export function useForm(initialValues: Record<string, unknown> = {}): FormInstance {
  const formInstance = useMemo<FormInstance>(() => {
    const values = { ...initialValues };
    
    const instance: FormInstance = {
      values,
      
      setValues: (newValues) => {
        instance.values = { ...newValues };
        
        // 通知组件值变更
        if (instance._changeCallback) {
          instance._changeCallback(newValues);
        }
      },
      
      getValues: () => {
        return { ...instance.values };
      },
      
      resetFields: () => {
        instance.values = { ...instance._initialValues };
        
        // 通知组件值重置
        if (instance._changeCallback) {
          instance._changeCallback(instance.values);
        }
      },
      
      setInitialValues: (newInitialValues) => {
        instance._initialValues = { ...newInitialValues };
        instance.values = { ...newInitialValues };
      },
      
      submit: () => {
        if (instance._submitFn) {
          instance._submitFn();
        }
      },
      
      _registerSubmitFn: (fn) => {
        instance._submitFn = fn;
      },
      
      _registerChangeCallback: (callback) => {
        instance._changeCallback = callback;
      },
      
      _submitFn: null,
      
      _changeCallback: null,
      
      _initialValues: { ...initialValues }
    };
    
    return instance;
  }, [initialValues]);
  
  // Initialize form instance with initial values
  useCallback(() => {
    formInstance.setInitialValues(initialValues);
  }, [formInstance, initialValues]);
  
  return formInstance;
}
