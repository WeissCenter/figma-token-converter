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
  token_form: FormGroup; // Specify the type explicitly

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

  token_example =
    `{
      "Components": {
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
        },
        "Summary Box": {
          "summary-box-border-radius": {
            "$type": "number",
            "$value": "{md}"
          },
          "summary-box-border-width": {
            "$type": "number",
            "$value": "{1px}"
          },
          "summary-box-border-color": {
            "$type": "color",
            "$value": "{Info.color-info-light}"
          },
          "summary-box-background-color": {
            "$type": "color",
            "$value": "{Info.color-info-lighter}"
          },
          "summary-box-text-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "summary-box-link-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          }
        },
        "Step Indicatior": {
          "step-indicator-segment-height": {
            "$type": "number",
            "$value": "{1}"
          },
          "step-indicator-segment-gap": {
            "$type": "number",
            "$value": "{2px}"
          },
          "step-indicator-segment-color-current": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "step-indicator-segment-color-complete": {
            "$type": "color",
            "$value": "{Primary.color-primary-darker}"
          },
          "step-indicator-heading-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "step-indicator-text-pending-color": {
            "$type": "color",
            "$value": "{Base.color-base-dark}"
          },
          "step-indicator-heading-font-size": {
            "$type": "number",
            "$value": "{lg}"
          },
          "step-indicator-background-color": {
            "$type": "color",
            "$value": "{White.white}"
          },
          "step-indicator-counter-gap": {
            "$type": "number",
            "$value": "{05}"
          },
          "step-indicator-counter-border-width": {
            "$type": "number",
            "$value": "{05}"
          },
          "step-indicator-label-font-size": {
            "$type": "number",
            "$value": "{sm}"
          },
          "step-indicator-min-width": {
            "$type": "number",
            "$value": "{tablet}"
          },
          "step-indicator-segment-color-pending": {
            "$type": "color",
            "$value": "{Gray cool.gray-cool-40}"
          },
          "step-indicator-heading-font-size-small": {
            "$type": "number",
            "$value": "{md}"
          }
        },
        "Process List": {
          "process-list-heading-font-size": {
            "$type": "number",
            "$value": "{lg}"
          },
          "process-list-heading-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "process-list-connector-width": {
            "$type": "number",
            "$value": "{1}"
          },
          "process-list-connector-color": {
            "$type": "color",
            "$value": "{Primary.color-primary-lighter}"
          },
          "process-list-counter-text-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "process-list-counter-background-color": {
            "$type": "color",
            "$value": "{White.white}"
          },
          "process-list-counter-size": {
            "$type": "number",
            "$value": 5
          },
          "process-list-font-size": {
            "$type": "number",
            "$value": "{sm}"
          },
          "process-list-counter-border-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "process-list-counter-border-width": {
            "$type": "number",
            "$value": "{05}"
          },
          "process-list-counter-gap-color": {
            "$type": "color",
            "$value": "{White.white}"
          },
          "process-list-counter-font-size": {
            "$type": "number",
            "$value": "{lg}"
          },
          "process-list-counter-gap-width": {
            "$type": "number",
            "$value": "{05}"
          }
        },
        "Pagination": {
          "pagination-button-border-width": {
            "$type": "number",
            "$value": "{1px}"
          },
          "pagination-button-border-radius": {
            "$type": "number",
            "$value": "{md}"
          },
          "pagination-breakpoint": {
            "$type": "number",
            "$value": "{tablet}"
          },
          "pagination-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          }
        },
        "Modal": {
          "modal-lg-max-width": {
            "$type": "number",
            "$value": "{tablet-lg}"
          },
          "modal-lg-content-max-width": {
            "$type": "number",
            "$value": "{tablet}"
          },
          "modal-default-max-width": {
            "$type": "number",
            "$value": "{mobile-lg}"
          },
          "modal-border-radius": {
            "$type": "number",
            "$value": "{sm}"
          }
        },
        "Identifier": {
          "identifier-secondary-link-color": {
            "$type": "color",
            "$value": "{Base.color-base-light}"
          },
          "identifier-primary-link-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "identifier-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          },
          "identifier-identity-domain-color": {
            "$type": "color",
            "$value": "{Base.color-base-light}"
          },
          "identifier-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-darkest}"
          }
        },
        "Header": {
          "header-min-width": {
            "$type": "number",
            "$value": "{desktop}"
          },
          "header-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          },
          "header-logo-text-width": {
            "$type": "number",
            "$value": 0.33000001311302185
          }
        },
        "Tooltips": {
          "tooltip-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-ink}"
          },
          "tooltip-font-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          },
          "tooltip-font-size": {
            "$type": "number",
            "$value": "{sm}"
          }
        },
        "Footer": {
          "footer-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          }
        },
        "Checkbox": {
          "input-tile-border-width": {
            "$type": "number",
            "$value": "{2px}"
          },
          "input-tile-border-radius": {
            "$type": "number",
            "$value": "{md}"
          },
          "checkbox-border-radius": {
            "$type": "number",
            "$value": "{sm}"
          },
          "input-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          }
        },
        "Card": {
          "card-padding-perimeter": {
            "$type": "number",
            "$value": "{3}"
          },
          "card-flag-min-width": {
            "$type": "number",
            "$value": "{tablet}"
          },
          "card-padding-y": {
            "$type": "number",
            "$value": "{2}"
          },
          "card-border-radius": {
            "$type": "number",
            "$value": "{lg}"
          },
          "card-border-color": {
            "$type": "color",
            "$value": "{Base.color-base-lighter}"
          },
          "card-margin-bottom": {
            "$type": "number",
            "$value": "{4}"
          },
          "card-flag-image-width": {
            "$type": "number",
            "$value": "{card-lg}"
          },
          "card-gap": {
            "$type": "number",
            "$value": "{2}"
          },
          "card-border-width": {
            "$type": "number",
            "$value": "{2px}"
          }
        },
        "Button": {
          "button-stroke-width": {
            "$type": "number",
            "$value": "{2px}"
          },
          "button-small-width": {
            "$type": "number",
            "$value": "{6}"
          },
          "button-border-radius": {
            "$type": "number",
            "$value": "{md}"
          }
        },
        "Breadcrumb": {
          "breadcrumb-separator-color": {
            "$type": "color",
            "$value": "{Base.color-base}"
          },
          "breadcrumb-padding-top": {
            "$type": "number",
            "$value": "{2}"
          },
          "breadcrumb-padding-x": {
            "$type": "number",
            "$value": "{0}"
          },
          "breadcrumb-padding-bottom": {
            "$type": "number",
            "$value": "{2}"
          },
          "breadcrumb-min-width": {
            "$type": "number",
            "$value": "{mobile-lg}"
          },
          "breadcrumb-link-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "breadcrumb-font-size": {
            "$type": "number",
            "$value": "{sm}"
          },
          "breadcrumb-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          }
        },
        "Banner": {
          "banner-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          },
          "banner-link-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "banner-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          }
        },
        "Navigation": {
          "megamenu-columns": {
            "$type": "number",
            "$value": 3
          }
        },
        "Side Nav": {
          "sidenav-current-border-width": {
            "$type": "number",
            "$value": "{05}"
          }
        },
        "Side Alert": {
          "site-alert-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          }
        },
        "Accordion": {
          "accordion-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          },
          "accordion-border-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          },
          "accordion-border-width": {
            "$type": "number",
            "$value": 4
          }
        },
        "In-page navigation": {
          "in-page-nav-top": {
            "$type": "number",
            "$value": "{4}"
          },
          "in-page-nav-margin-top": {
            "$type": "number",
            "$value": "{2}"
          },
          "in-page-nav-margin-left": {
            "$type": "number",
            "$value": "{4}"
          },
          "in-page-nav-main-content-max-width": {
            "$type": "number",
            "$value": "{desktop}"
          },
          "in-page-nav-background-radius": {
            "$type": "number",
            "$value": "{lg}"
          },
          "in-page-nav-background-padding": {
            "$type": "number",
            "$value": "{2}"
          },
          "in-page-nav-background-color": {
            "$type": "color",
            "$value": "{Base.color-base-lightest}"
          },
          "in-page-nav-bar-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "in-page-nav-link-color": {
            "$type": "color",
            "$value": "{Primary.color-primary}"
          },
          "in-page-nav-bar-width": {
            "$type": "number",
            "$value": "{05}"
          }
        }
      },
      "Global": {
        "Focus": {
          "focus-offset": {
            "$type": "number",
            "$value": 0
          },
          "focus-color": {
            "$type": "color",
            "$value": "{Blue vivid.blue-40v}"
          },
          "focus-width": {
            "$type": "number",
            "$value": 4
          }
        }
      },
      "Link": {
        "link-reverse-active-color": {
          "$type": "color",
          "$value": "{White.white}"
        },
        "link-reverse-hover-color": {
          "$type": "color",
          "$value": "{Base.color-base-lightest}"
        },
        "link-reverse-color": {
          "$type": "color",
          "$value": "{Base.color-base-lighter}"
        },
        "link-active-color": {
          "$type": "color",
          "$value": "{Primary.color-primary-darker}"
        },
        "link-hover-color": {
          "$type": "color",
          "$value": "{Primary.color-primary-dark}"
        },
        "link-visited-color": {
          "$type": "color",
          "$value": "{Violet vivid.violet-70v}"
        },
        "link-color": {
          "$type": "color",
          "$value": "{Primary.color-primary}"
        }
      },
      "Body": {
        "text-reverse-color": {
          "$type": "color",
          "$value": "{Gray.gray-2}"
        },
        "text-color": {
          "$type": "color",
          "$value": "{Base.color-base-ink}"
        },
        "body-background-color": {
          "$type": "color",
          "$value": "{Gray.gray-2}"
        }
      },
      "Emergency": {
        "color-emergency-dark": {
          "$type": "color",
          "$value": "{Red warm.red-warm-80}"
        },
        "color-emergency": {
          "$type": "color",
          "$value": "{Red warm vivid.red-warm-60v}"
        }
      },
      "Disabled": {
        "color-disabled-dark": {
          "$type": "color",
          "$value": "{Gray.gray-30}"
        },
        "color-disabled": {
          "$type": "color",
          "$value": "{Gray.gray-20}"
        },
        "color-disabled-light": {
          "$type": "color",
          "$value": "{Gray.gray-10}"
        }
      },
      "Success": {
        "color-success-darker": {
          "$type": "color",
          "$value": "{Green cool vivid.green-cool-60v}"
        },
        "color-success-dark": {
          "$type": "color",
          "$value": "{Green cool vivid.green-cool-50v}"
        },
        "color-success": {
          "$type": "color",
          "$value": "{Green cool vivid.green-cool-40v}"
        },
        "color-success-light": {
          "$type": "color",
          "$value": "{Green cool vivid.green-cool-20v}"
        },
        "color-success-lighter": {
          "$type": "color",
          "$value": "{Green cool.green-cool-5}"
        }
      },
      "Warning": {
        "color-warning-darker": {
          "$type": "color",
          "$value": "{Gold vivid.gold-50v}"
        },
        "color-warning-dark": {
          "$type": "color",
          "$value": "{Gold vivid.gold-30v}"
        },
        "color-warning": {
          "$type": "color",
          "$value": "{Gold vivid.gold-20v}"
        },
        "color-warning-light": {
          "$type": "color",
          "$value": "{Yellow vivid.yellow-10v}"
        },
        "color-warning-lighter": {
          "$type": "color",
          "$value": "{Yellow.yellow-5}"
        }
      },
      "Error": {
        "color-error-darker": {
          "$type": "color",
          "$value": "{Red.red-70}"
        },
        "color-error-dark": {
          "$type": "color",
          "$value": "{Red vivid.red-60v}"
        },
        "color-error": {
          "$type": "color",
          "$value": "{Red warm vivid.red-warm-50v}"
        },
        "color-error-light": {
          "$type": "color",
          "$value": "{Red warm vivid.red-warm-30v}"
        },
        "color-error-lighter": {
          "$type": "color",
          "$value": "{Red warm.red-warm-10}"
        }
      },
      "Info": {
        "color-info-darker": {
          "$type": "color",
          "$value": "{Blue cool.blue-cool-60}"
        },
        "color-info-dark": {
          "$type": "color",
          "$value": "{Cyan vivid.cyan-40v}"
        },
        "color-info": {
          "$type": "color",
          "$value": "{Cyan vivid.cyan-30v}"
        },
        "color-info-light": {
          "$type": "color",
          "$value": "{Cyan.cyan-20}"
        },
        "color-info-lighter": {
          "$type": "color",
          "$value": "{Cyan.cyan-5}"
        }
      },
      "Primary": {
        "color-primary-light": {
          "$type": "color",
          "$value": "{Blue.blue-30}"
        },
        "color-primary-lighter": {
          "$type": "color",
          "$value": "{Blue.blue-10}"
        },
        "color-primary-vivid": {
          "$type": "color",
          "$value": "{Blue warm vivid.blue-warm-60v}"
        },
        "color-primary": {
          "$type": "color",
          "$value": "{Blue vivid.blue-60v}"
        },
        "color-primary-darker": {
          "$type": "color",
          "$value": "{Blue warm vivid.blue-warm-80v}"
        },
        "color-primary-dark": {
          "$type": "color",
          "$value": "{Blue warm vivid.blue-warm-70v}"
        }
      },
      "Base": {
        "color-base-dark": {
          "$type": "color",
          "$value": "{Gray cool.gray-cool-60}"
        },
        "color-base-lighter": {
          "$type": "color",
          "$value": "{Gray cool.gray-cool-10}"
        },
        "color-base-lightest": {
          "$type": "color",
          "$value": "{Gray.gray-5}"
        },
        "color-base-light": {
          "$type": "color",
          "$value": "{Gray cool.gray-cool-30}"
        },
        "color-base-darkest": {
          "$type": "color",
          "$value": "{Gray.gray-90}"
        },
        "color-base": {
          "$type": "color",
          "$value": "{Gray cool.gray-cool-50}"
        },
        "color-base-ink": {
          "$type": "color",
          "$value": "{Gray.gray-90}"
        },
        "color-base-darker": {
          "$type": "color",
          "$value": "{Gray cool.gray-cool-70}"
        }
      },
      "Accent warm": {
        "color-accent-warm-darker": {
          "$type": "color",
          "$value": "{Orange.orange-60}"
        },
        "color-accent-warm-dark": {
          "$type": "color",
          "$value": "{Orange vivid.orange-50v}"
        },
        "color-accent-warm-lighter": {
          "$type": "color",
          "$value": "{Orange.orange-10}"
        },
        "color-accent-warm": {
          "$type": "color",
          "$value": "{Orange vivid.orange-30v}"
        },
        "color-accent-warm-light": {
          "$type": "color",
          "$value": "{Orange vivid.orange-20v}"
        }
      },
      "Accent cool": {
        "color-accent-cool-darker": {
          "$type": "color",
          "$value": "{Blue cool vivid.blue-cool-60v}"
        },
        "color-accent-cool-dark": {
          "$type": "color",
          "$value": "{Blue cool vivid.blue-cool-40v}"
        },
        "color-accent-cool": {
          "$type": "color",
          "$value": "{Cyan vivid.cyan-30v}"
        },
        "color-accent-cool-light": {
          "$type": "color",
          "$value": "{Blue cool vivid.blue-cool-20v}"
        },
        "color-accent-cool-lighter": {
          "$type": "color",
          "$value": "{Blue cool vivid.blue-cool-5v}"
        }
      },
      "Secondary": {
        "color-secondary-darker": {
          "$type": "color",
          "$value": "{Red vivid.red-70v}"
        },
        "color-secondary-vivid": {
          "$type": "color",
          "$value": "{Red cool vivid.red-cool-50v}"
        },
        "color-secondary": {
          "$type": "color",
          "$value": "{Red.red-50}"
        },
        "color-secondary-light": {
          "$type": "color",
          "$value": "{Red.red-30}"
        },
        "color-secondary-lighter": {
          "$type": "color",
          "$value": "{Red cool vivid.red-cool-10v}"
        },
        "color-secondary-dark": {
          "$type": "color",
          "$value": "{Red vivid.red-60v}"
        }
      }
    }`;

  scss_example = `@use "uswds-core" with (
    $theme-image-path: "/src/app/assets/uswds/img",
    $theme-font-path: "/src/app/assets/uswds/fonts",
    $theme-color-info-darker: "blue-cool-80",
    $theme-color-info-dark: "cyan-80v",
    $theme-color-info: "cyan-50v",
    $theme-color-info-light: "cyan-30",
    $theme-color-info-lighter: "cyan-10"
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
          console.log(parentKey);
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
  
      const outputObj = { file_name: fileNameWithoutExtension, string_value: `@use "uswds-core" with (\n  $theme-image-path: "/src/app/assets/uswds/img",\n  $theme-font-path: "/src/app/assets/uswds/fonts",\n  ${sassVariables.join(',\n  ')}\n);` };
      result.push(outputObj);
    }
  
    return result;
  }
  ngOnInit() {};

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

