import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function validObjectValidator(): ValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const textareaValue = control.value;
    if (textareaValue === null || textareaValue === '') {
      return Promise.resolve(null); // Return resolved Promise if the control is empty (optional)
    }

    try {
      const parsedObject = JSON.parse(textareaValue.replace(/'/g, '"'));
      if (typeof parsedObject === 'object' && parsedObject !== null) {
        // Check if the object contains keys "fileName" and "body"
        if ('fileName' in parsedObject && 'body' in parsedObject) {
          return Promise.resolve(null); // Validation passed
        } else {
          return Promise.resolve({ invalidFormat: true }); // Validation failed due to missing "fileName" or "body"
        }
      } else {
        return Promise.resolve({ invalidObject: true }); // Validation failed due to not being a valid object
      }
    } catch (error) {
      return Promise.resolve({ invalidObject: true }); // Validation failed due to invalid JSON format
    }
  };
}
