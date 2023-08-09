import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function validObjectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const textareaValue = control.value;
    if (textareaValue === null || textareaValue === '') {
      return null; // Return null if the control is empty (optional)
    }

    try {
      const parsedObject = JSON.parse(textareaValue.replace(/'/g, '"'));
      return null; 
    } catch (error) {
      return { invalidFormat: true }; // Validation failed due to invalid JSON format
    }
  };
}
