import {Component} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzTableComponent, NzTdAddOnComponent} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";
import {ListItemComponent} from "../list-item/list-item.component";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";

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
    NzPaginationComponent
  ],
  styleUrl: './list.component.css'
})
export class ListComponent {
  workflows: any;

  constructor(private workflowService: WorkflowService) {
    this.workflowService.getWorkflows().subscribe(data => {
      this.workflows = data.data;
      console.log(data);
    });
  }
}
