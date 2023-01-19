import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { BackButtonDirective } from './directives/back-button.directive';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const COMPONENTS = [
  ButtonComponent,
  CardComponent,
];

const DIRECTIVES = [
  BackButtonDirective,
];

const MODULES = [
  CommonModule,
  FormsModule,
  FontAwesomeModule,
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [...MODULES],
  exports: [...COMPONENTS, ...MODULES]
})
export class SharedModule { }
