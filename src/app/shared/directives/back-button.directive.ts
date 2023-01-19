import { Directive, HostListener } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Directive({
  selector: '[appBackButton]'
})
export class BackButtonDirective {
  @HostListener('click') click() {
    this.navigationService.back();
  }

  constructor(private navigationService: NavigationService) { }
}
