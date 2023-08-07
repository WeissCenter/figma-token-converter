import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function validObjectValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const textareaValue = control.value;
    if (textareaValue === null || textareaValue === '') {
      return null; // Return null if the control is empty (optional)
    }

    try {
      const parsedObject = JSON.parse(textareaValue.replace(/'/g, '"'));
      if (Array.isArray(parsedObject)) {
        // Check if the array contains valid objects with "fileName" and "body" keys
        for (const obj of parsedObject) {
          if (!('fileName' in obj && 'body' in obj)) {
            return { invalidFormat: true }; // Validation failed due to missing "fileName" or "body"
          }
        }
        return null; // Validation passed
      } else {
        return { invalidFormat: true }; // Validation failed due to not being a valid JSON array
      }
    } catch (error) {
      return { invalidFormat: true }; // Validation failed due to invalid JSON format
    }
  };
}
