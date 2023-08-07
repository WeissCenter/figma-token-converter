import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { validObjectValidator } from './object-validator';
import * as ClipboardJS from 'clipboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private formBuilder: FormBuilder,

  ) { }

  exported_data = {
    file_name: '',
    data: 'Generated output will display here...',
    string_value: '',
  }

  token_example =
    `{
    "fileName": "uswds-colors-theme.light.tokens.json",
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
  }`;

  scss_example = `@use "uswds-core" with (
  $theme-info-darker: "blue-cool-80",
  $theme-info-dark: "cyan-80v",
  $theme-info: "cyan-50v",
  $theme-info-light: "cyan-30",
  $theme-info-lighter: "cyan-10"
)`;

  token_form = this.formBuilder.group({
    token_import_data: ['', Validators.required, validObjectValidator()],
  });

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy text:', err);
    });
  }

  convertToSassVariables(input: any) {
    let return_obj = {
      file_name: '',
      data: '',
      string_value: '',
    }
    if (!input || typeof input !== 'object') {
      return return_obj; // Return an empty string if the input is invalid
    }

    const fileNameWithoutExtension = (input.fileName || '').replace('.tokens.json', '');

    const sassVariables: string[] = [];
    const bodyKeys = Object.keys(input.body);
    for (const bodyKey of bodyKeys) {
      const component = input.body[bodyKey];
      if (typeof component === 'object') {
        for (const [propertyKey, propertyValue] of Object.entries(component)) {
          if (
            propertyValue !== null &&
            typeof propertyValue === 'object' &&
            propertyValue.hasOwnProperty('$type') && // Check if '$type' property is present
            typeof propertyValue === 'object' &&
            (propertyValue as { $type: string }).$type === 'color' &&
            propertyValue.hasOwnProperty('$value') // Check if '$value' property is present
          ) {
            const isAliased =
              typeof propertyValue === 'object' &&
              (propertyValue as { $value: string }).$value &&
              (propertyValue as { $value: string }).$value.startsWith('{') &&
              (propertyValue as { $value: string }).$value.endsWith('}');
            const variableName = `$theme-${propertyKey}`;
            let variableValue = (propertyValue as { $value: string }).$value.replace(/[{}]/g, ''); // Remove braces {}

            if (isAliased) {
              const fragments = variableValue.split('.');
              variableValue = fragments[fragments.length - 1];
            }

            sassVariables.push(`${variableName}: "${variableValue}"`);
          }
        }
      }
    }
    if (sassVariables.length > 0 && fileNameWithoutExtension) {
      return_obj.string_value = sassVariables.join(',\n  ');
      return_obj.data = `@use "uswds-core" with (\n  ${sassVariables.join(',\n  ')}\n)`;
      return_obj.file_name = fileNameWithoutExtension;
    }
    return return_obj;
  }

  ngOnInit() { };

  convertTokenData() {
    const token_data = this.token_form.value.token_import_data ?? "";
    this.exported_data = this.convertToSassVariables(JSON.parse(token_data));
    console.log(this.exported_data);
  }

  downloadFile(type: 'scss' | 'txt') {
    const file_name = this.exported_data.file_name + '.' + type;
    const file_content = type === 'scss' ? this.exported_data.data : this.exported_data.string_value;
    var file = new File([file_content], file_name, { type: "text/plain;charset=utf-8" });
    saveAs(file);
  }
}

