import {Component} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzCardModule} from "ng-zorro-antd/card";

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    NzTableModule,
    NgForOf,
    NzStepsModule,
    NzCardModule
  ],
  styleUrls: ['./list.component.css']
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
