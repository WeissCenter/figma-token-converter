import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { validObjectValidator } from './object-validator';
import * as ClipboardJS from 'clipboard';

interface TokenValue {
  $type: string;
  $value: string;
}

interface TokenInfo {
  [key: string]: TokenValue;
}

interface BodyInfo {
  [key: string]: TokenInfo | TokenValue;
}

interface InputObject {
  fileName: string;
  body: {
    [key: string]: BodyInfo;
  };
}

interface ConvertedData {
  file_name: string;
  string_value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  token_form: FormGroup; // Specify the type explicitly

  constructor(private formBuilder: FormBuilder) {
    this.token_form = this.formBuilder.group({
      token_import_data: ['', [Validators.required, validObjectValidator()]],
    });
  }

  _converted_data: ConvertedData[] = [{
    file_name: 'SCSS Output',
    string_value: 'Converted SCSS data will be displayed here.'
  }];

  token_example =
    `[{
      "fileName": "uswds-colors-theme.dark.tokens.json",
      "body": {
        "Info": {
          "info-darker": {
            "$type": "color",
            "$value": "{Blue cool.blue-cool-80}"
          },
          "info-dark": {
            "$type": "color",
            "$value": "{Cyan vivid.cyan-80v}"
          },
          "info": {
            "$type": "color",
            "$value": "{Cyan vivid.cyan-50v}"
          },
          "info-light": {
            "$type": "color",
            "$value": "{Cyan.cyan-30}"
          },
          "info-lighter": {
            "$type": "color",
            "$value": "{Cyan.cyan-10}"
          }
        }
      }
    },{
      "fileName": "uswds-colors-theme.light.tokens.json",
      "body": {
        "Info": {
          "info-darker": {
            "$type": "color",
            "$value": "{Blue cool.blue-cool-60}"
          },
          "info-dark": {
            "$type": "color",
            "$value": "{Cyan vivid.cyan-40v}"
          },
          "info": {
            "$type": "color",
            "$value": "{Cyan vivid.cyan-30v}"
          },
          "info-light": {
            "$type": "color",
            "$value": "{Cyan.cyan-20}"
          },
          "info-lighter": {
            "$type": "color",
            "$value": "{Cyan.cyan-5}"
          }
        }
      }
    }]`;

  scss_example = `@use "uswds-core" with (
  $theme-info-darker: "blue-cool-80",
  $theme-info-dark: "cyan-80v",
  $theme-info: "cyan-50v",
  $theme-info-light: "cyan-30",
  $theme-info-lighter: "cyan-10"
)`;

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy text:', err);
    });
  }

  isTokenInfo(input: any): input is TokenInfo {
    return input !== null && typeof input === 'object' && !('$type' in input);
  }

  convertToSassVariables(input: string): { file_name: string; string_value: string }[] {
    let parsedInput: InputObject[];

    try {
      parsedInput = JSON.parse(input);
    } catch (error) {
      throw new Error('Invalid input format. The input must be a valid JSON array.');
    }

    if (!Array.isArray(parsedInput)) {
      throw new Error('Invalid input format. The input must be a valid JSON array.');
    }

    const result: { file_name: string; string_value: string }[] = [];

    for (const inputObject of parsedInput) {
      if (!inputObject || typeof inputObject !== 'object') {
        continue; // Skip invalid inputs
      }

      const fileNameWithoutExtension = (inputObject.fileName || '').replace('.tokens.json', '.scss');



      // Type guard to check if the input is of type TokenInfo
      const isTokenInfo = (data: TokenInfo | TokenValue): data is TokenInfo => {
        return !data.hasOwnProperty('$type');
      };

      const processComponent = (component: TokenInfo | TokenValue): string[] => {
        const componentVariables: string[] = [];

        if (isTokenInfo(component)) {
          // Component is of type TokenInfo
          for (const [propertyKey, propertyValue] of Object.entries(component)) {
            if (
              propertyValue &&
              typeof propertyValue === 'object' &&
              propertyValue.hasOwnProperty('$type') && // Check if '$type' property is present
              propertyValue.$type === 'color' &&
              propertyValue.hasOwnProperty('$value') // Check if '$value' property is present
            ) {
              const isAliased = propertyValue.$value.startsWith('{') && propertyValue.$value.endsWith('}');
              const variableName = `$theme-${propertyKey}`;
              let variableValue = propertyValue.$value.replace(/[{}]/g, ''); // Remove braces {}

              if (isAliased) {
                const fragments = variableValue.split('.');
                variableValue = fragments[fragments.length - 1];
              }

              componentVariables.push(`${variableName}: "${variableValue}"`);
            }
          }
        } else {
          // Component is of type TokenValue
          const propertyKey = 'value'; // You can choose any key name for TokenValue
          const propertyValue = component.$value;
          if (propertyValue) {
            const isAliased = propertyValue.startsWith('{') && propertyValue.endsWith('}');
            const variableName = `$theme-${propertyKey}`;
            let variableValue = propertyValue.replace(/[{}]/g, ''); // Remove braces {}

            if (isAliased) {
              const fragments = variableValue.split('.');
              variableValue = fragments[fragments.length - 1];
            }

            componentVariables.push(`${variableName}: "${variableValue}"`);
          }
        }
        return componentVariables;
      };
  
      const sassVariables: string[] = [];
      const bodyKeys = Object.keys(inputObject.body);
      for (const bodyKey of bodyKeys) {
        const componentOrArray = inputObject.body[bodyKey];
        if (Array.isArray(componentOrArray)) {
          for (const component of componentOrArray) {
            if (isTokenInfo(component)) {
              sassVariables.push(...processComponent(component));
            }
          }
        } else {
          if (this.isTokenInfo(componentOrArray)) {
            sassVariables.push(...processComponent(componentOrArray));
          }
        }
      }
  
      // if (sassVariables.length > 0 && fileNameWithoutExtension) {
      //   sassVariables.push(`// SASS variables for ${fileNameWithoutExtension}`);
      // }
  
      const outputObj = { file_name: fileNameWithoutExtension, string_value: `@use "${fileNameWithoutExtension}" with (\n  ${sassVariables.join(',\n  ')}\n)` };
      result.push(outputObj);
    }
  
    return result;
  }

  ngOnInit() { };

  convertTokenData() {
    const token_data = this.token_form.value.token_import_data ?? "";
    try {
      this._converted_data = this.convertToSassVariables(token_data);
    } catch (error: any) {
      console.error(error.message);
      alert('There was an error converting the token data. Please check the console for more details.');
    }
  }

  downloadFile(opt: ConvertedData) {
    var file = new File([opt.string_value], opt.file_name, { type: "text/plain;charset=utf-8" });
    saveAs(file);
  }
}

