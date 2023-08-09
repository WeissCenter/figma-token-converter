import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { validObjectValidator } from './validators/object-validator';
import { _valid_uswds_variables, validColorFormat, handleStringToNumber } from './validators/export.validators';
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
  token_form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.token_form = this.formBuilder.group({
      token_import_data: ['', [Validators.required, validObjectValidator()]],
    });
  }

  site_title = 'USWDS SCSS Config Generator';

  _converted_data: ConvertedData[] = [{
    file_name: 'SCSS Output',
    string_value: 'Converted SCSS data will be displayed here.'
  }];

  angular_example = {
    install: "npm install @uswds/uswds --save",
    packageJSON: `...\n "dependencies":{\n  "@angular/common": "^16.1.0",\n\  ...\n  "@uswds/uswds": "^3.5.0",\n }\n...`,
    angularJSON: `...\n"projects":{\n  ...\n "architect": {\n\  ...\n   "build": {\n    ...\n    "assets": [\n      ...\n      {\n       "glob": "**/*",\n       "input": "node_modules/@uswds/uswds/dist/img",\n       "output": "/src/app/assets/uswds/img"\n      },\n      {\n       "glob": "**/*",\n       "input": "node_modules/@uswds/uswds/dist/fonts",\n       "output": "/src/app/assets/uswds/fonts"\n      }\n    ],\n    ...\n    "scripts": [\n      "node_modules/@uswds/uswds/dist/js/uswds.min.js"\n    ],\n    "stylePreprocessorOptions": {\n     "includePaths": [\n      "node_modules/@uswds/uswds/packages",\n      "src/assets/uswds/fonts",\n      "src/assets/uswds/img",\n     ]\n    },\n    ...\n   }\n  }\n }\n...`,
    paths: `@use "uswds-core" with (\n $theme-image-path: "/src/app/assets/uswds/img"\n $theme-font-path: "/src/app/assets/uswds/fonts"\n ... rest of generated tokens ...\n);\n@forward 'uswds';`
  };

  token_example =
    `{"Components": {
      "Table": {
        "table-header-text-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "table-border-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "table-sorted-background-color": {
          "$type": "color",
          "$value": "{Accent cool.color-accent-cool-lighter}"
        },
        "table-text-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "table-sorted-header-background-color": {
          "$type": "color",
          "$value": "{Accent cool.color-accent-cool-light}"
        },
        "table-stripe-text-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "table-sorted-icon-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "table-unsorted-icon-color": {
          "$type": "color",
          "$value": "{Base.color-base}"
        },
        "table-sorted-stripe-background-color": {
          "$type": "color",
          "$value": "{Blue cool vivid.blue-cool-10v}"
        },
        "table-stripe-background-color": {
          "$type": "color",
          "$value": "{Base.color-base-lightest}"
        },
        "table-header-background-color": {
          "$type": "color",
          "$value": "{Base.color-base-lighter}"
        }
      }
  }}`;

  scss_example = `@use "uswds-core" with (
    $theme-table-header-text-color: "ink",
    $theme-table-border-color: "ink",
    $theme-table-sorted-background-color: "accent-cool-lighter",
    $theme-table-text-color: "ink",
    $theme-table-sorted-header-background-color: "accent-cool-light",
    $theme-table-stripe-text-color: "ink",
    $theme-table-sorted-icon-color: "ink",
    $theme-table-unsorted-icon-color: "base",
    $theme-table-sorted-stripe-background-color: "blue-cool-10v",
    $theme-table-stripe-background-color: "base-lightest",
    $theme-table-header-background-color: "base-lighter"
  );`;

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

  convertToSassVariables(input: string): ConvertedData[] {
    let parsedInput: any;

    try {
      parsedInput = JSON.parse(input);
    } catch (error) {
      throw new Error('Invalid input format. The input must be a valid JSON object.');
    }

    if (!Array.isArray(parsedInput)) {
      parsedInput = [parsedInput];
    }

    const result: { file_name: string; string_value: string }[] = [];

    for (const inputObject of parsedInput) {
      if (!inputObject || typeof inputObject !== 'object') {
        continue; // Skip invalid inputs
      }

      const fileNameWithoutExtension = (inputObject.fileName || 'SCSS Config File').replace('.tokens.json', '.scss');

      const processParentTokenObject = (component: any, parentKey = ''): string[] => {
        const componentVariables: string[] = [];
        for (const [key, value] of Object.entries(component)) {
          // console.log(parentKey);
          if (key === '$value') {
            let variable_name = `$theme-${parentKey}`;
            variable_name = variable_name.replace(/-\$value$/, '');
            // The only variable name that breaks the mode is $step-indicator-background-color, as it doesn't start with $theme-
            // This is a hacky way to fix it
            if (variable_name === "$theme-step-indicator-background-color") {
              variable_name = "$step-indicator-background-color";
            }

            // Determine that processed variable name is valid within USWDS
            let valid_name = _valid_uswds_variables.find((x) => x === variable_name) ?? false;
            if (!valid_name) {
              throw new Error(`Invalid variable name: ${variable_name}`);
            }

            let variable_value = component.$value;
            let valid_value = true;

            if (typeof variable_value === 'string' && variable_value.startsWith('{') && variable_value.endsWith('}')) {
              // Variable is an alias to another variable if it's in the form of {value}
              // USWDS uses the last part of what Figma considers to be the name of the value within quotes
              // But without "color-" at the beginning
              // So we need to split the string and get the last part
              if (variable_value.includes("color-")) {
                variable_value = variable_value.replace("color-", "");
                // The exception being "ink" that lists it's associated sass variable name as base-ink, but wnats just "ink" piped in
                if (variable_value.includes("base-ink")) {
                  variable_value = variable_value.replace("base-ink", "ink");
                }
              }
              const fragments = variable_value.replace(/[{}]/g, '').split('.');
              variable_value = handleStringToNumber(fragments[fragments.length - 1]);
            } else if (typeof variable_value === 'string' && (variable_value.includes("#") || variable_value.includes("rgb") || variable_value.includes("hsl"))) {
              // Variable is a "raw" color value and should be checked to see if it's in a valid format and then passed to USWDS wihtout quotes
              valid_value = validColorFormat(variable_value);

            } else if (typeof variable_value === 'string' && variable_value === "") {
              valid_value = false;
            }

            if (!valid_value) {
              throw new Error(`Invalid variable value:\n${variable_name}: ${variable_value}`);
            }

            componentVariables.push(`${variable_name}: ${variable_value}`);
          } else if (typeof value === 'object' && value !== null) {
            componentVariables.push(...processParentTokenObject(value, `${key}`));
          }
        }

        return componentVariables;
      };

      const sassVariables: string[] = [];
      for (const key in inputObject) {
        if (inputObject.hasOwnProperty(key)) {
          const componentOrArray = inputObject[key];
          if (Array.isArray(componentOrArray)) {
            for (const component of componentOrArray) {
              sassVariables.push(...processParentTokenObject(component, key));
            }
          } else {
            sassVariables.push(...processParentTokenObject(componentOrArray, key));
          }
        }
      }

      // const outputObj = { file_name: fileNameWithoutExtension, string_value: `@use "uswds-core" with (\n  $theme-image-path: "/src/app/assets/uswds/img",\n  $theme-font-path: "/src/app/assets/uswds/fonts",\n  ${sassVariables.join(',\n  ')}\n);` };
      const outputObj = {
        file_name: fileNameWithoutExtension,
        string_value: `@use "uswds-core" with (\n  ${sassVariables.join(',\n  ')}\n);`
      };
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
      alert('There was an error converting the token data:\n' + error.message);
    }
  }

  downloadFile(opt: ConvertedData) {
    var file = new File([opt.string_value], opt.file_name, { type: "text/plain;charset=utf-8" });
    saveAs(file);
  }
}

