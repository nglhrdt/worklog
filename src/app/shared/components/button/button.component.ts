import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Input() mode: 'danger' | 'default' = 'default';
  @Input() icon?: IconDefinition;

  onClick(event: Event): void {
    if (this.disabled) event.stopPropagation();
  }
}
