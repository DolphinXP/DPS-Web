import {Component} from '@angular/core';
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";

@Component({
  selector: 'app-workflow-list-item',
  standalone: true,
  imports: [
    NzStepsComponent,
    NzStepComponent
  ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent {
  index = 0;

  onIndexChange(event: number): void {
    this.index = event;
  }
}
