import {Component} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzTableComponent, NzTdAddOnComponent, NzThMeasureDirective, NzTrExpandDirective} from "ng-zorro-antd/table";
import {JsonPipe, NgForOf} from "@angular/common";
import {ListItemComponent} from "../list-item/list-item.component";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import {NzStepComponent, NzStepsComponent} from "ng-zorro-antd/steps";

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    NzTableComponent,
    NzTdAddOnComponent,
    NgForOf,
    ListItemComponent,
    NzCardComponent,
    NzButtonComponent,
    NzPaginationComponent,
    NzThMeasureDirective,
    NzTrExpandDirective,
    JsonPipe,
    NzStepComponent,
    NzStepsComponent
  ],
  styleUrl: './list.component.css'
})
export class ListComponent {
  workflows: any;
  expandSet = new Set<string>();

  constructor(private workflowService: WorkflowService) {
    this.workflowService.getWorkflows().subscribe(data => {
      this.workflows = data.data;
      console.log(data);
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}
