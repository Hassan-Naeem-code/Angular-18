import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-app-components',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app-components.component.html',
  styleUrl: './app-components.component.css',
})
export class AppComponentsComponent {
  abc: string = 'text';
  inputValue: string = '';

  firstDivViewAngle: boolean = true;
  secondDivViewAngle: boolean = true;

  arrayString: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  arrayOfObject: any[] = [
    { id: 1, name: 'A', work: 'B', school: 'C' },
    { id: 2, name: 'D', work: 'E', school: 'F' },
    { id: 3, name: 'G', work: 'H', school: 'I' },
  ];

  constructor() {
    this.abc = 'jv sknvk';
  }
  showAlert() {
    alert('Hello World');
  }
  toggleFirstDiv() {
    this.firstDivViewAngle = !this.firstDivViewAngle;
  }
  toggleSecondDiv() {
    this.secondDivViewAngle = !this.secondDivViewAngle;
  }
}
