/**
 * @description Form control hook, creates and returns a form instance
 */
import { useMemo, useCallback } from "react";

/**
 * @description Form instance class that handles form state and actions
 */
export class FormInstance {
  /** Form values */
  public values: Record<string, unknown>;
  
  /** Internal submit function */
  private _submitFn: (() => void) | null = null;
  
  /** Internal change callback */
  private _changeCallback: ((values: Record<string, unknown>) => void) | null = null;
  
  /** Internal initial values */
  private _initialValues: Record<string, unknown>;

  /**
   * @description Creates a new form instance
   * @param initialValues Initial form values
   */
  constructor(initialValues: Record<string, unknown> = {}) {
    this._initialValues = { ...initialValues };
    this.values = { ...initialValues };
  }
  
  /**
   * @description Set form values
   * @param newValues New values to set
   */
  public setValues(newValues: Record<string, unknown>): void {
    this.values = { ...newValues };
    
    // Notify component of value changes
    if (this._changeCallback) {
      this._changeCallback(newValues);
    }
  }
  
  /**
   * @description Get current form values
   * @returns Copy of current values
   */
  public getValues(): Record<string, unknown> {
    return { ...this.values };
  }
  
  /**
   * @description Reset form to initial values
   */
  public resetFields(): void {
    this.values = { ...this._initialValues };
    
    // Notify component of reset
    if (this._changeCallback) {
      this._changeCallback(this.values);
    }
  }
  
  /**
   * @description Set initial values
   * @param newInitialValues New initial values
   */
  public setInitialValues(newInitialValues: Record<string, unknown>): void {
    this._initialValues = { ...newInitialValues };
    this.values = { ...newInitialValues };
  }
  
  /**
   * @description Submit the form
   */
  public submit(): void {
    if (this._submitFn) {
      this._submitFn();
    }
  }
  
  /**
   * @description Register internal form component submit function
   * @param fn Submit function to register
   */
  public _registerSubmitFn(fn: () => void): void {
    this._submitFn = fn;
  }
  
  /**
   * @description Register change callback when form values change
   * @param callback Callback to register
   */
  public _registerChangeCallback(callback: (values: Record<string, unknown>) => void): void {
    this._changeCallback = callback;
  }
}

/**
 * @description Hook to create a form instance
 * @param initialValues Initial values for the form
 * @returns Form instance
 */
export function useForm(initialValues: Record<string, unknown> = {}): FormInstance {
  // Create form instance using class
  const formInstance = useMemo<FormInstance>(() => {
    return new FormInstance(initialValues);
  }, [initialValues]);
  
  // Initialize form instance with initial values when they change
  const initFormInstance = useCallback(() => {
    formInstance.setInitialValues(initialValues);
  }, [formInstance, initialValues]);
  initFormInstance();
  
  return formInstance;
}
