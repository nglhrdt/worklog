import { Directive, HostListener } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Directive({
  standalone: true,
  selector: '[appBackButton]'
})
export class BackButtonDirective {
  @HostListener('click') click() {
    this.navigationService.back();
  }

  constructor(private navigationService: NavigationService) { }
}
