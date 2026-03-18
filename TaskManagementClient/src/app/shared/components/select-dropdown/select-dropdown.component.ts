import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './select-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true,
    },
  ],
})
export class SelectDropdownComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() options: SelectOption[] = [];
  @Input() id!: string;
  @Input() isInvalid = false;
  @Input() errorMessage = 'שדה חובה';

  value = '';
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelect(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
