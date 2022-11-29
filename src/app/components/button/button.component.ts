import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="flex justify-center rounded-lg ring-slate-700 bg-slate-500 text-white ring-1 py-1 px-2 cursor-pointer hover:bg-slate-300"><ng-content></ng-content></div>`,
})
export class ButtonComponent { }
