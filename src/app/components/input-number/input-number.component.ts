import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent {
  @HostBinding('class') cssClasses = '';
  @Input() value?: number;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() min: number | null = null;
  @Input() max: number | null = null;

  onModelChange(value: number | null): void {
    if (value === null) {
      return;
    }
    if (this.min !== null && value < this.min) {
      value = this.min;
    }

    if (this.max !== null && value > this.max) {
      value = this.max;
    }

    this.value = value;

    this.valueChange.emit(this.value);
  }
}
