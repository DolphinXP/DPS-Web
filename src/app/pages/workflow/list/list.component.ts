import {Component} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {CommonModule, NgForOf, NgTemplateOutlet} from "@angular/common";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {CreateComponent} from "../create/create.component";

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    CommonModule,
    NzTableModule,
    NgForOf,
    NzStepsModule,
    NzCardModule,
    NzButtonModule,
    NzDividerModule,
    NgTemplateOutlet,
    NzModalModule,
    CreateComponent
  ],
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  workflows: any;
  expandSet = new Set<string>();

  constructor(private workflowService: WorkflowService, private modalService: NzModalService) {
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

  showModal(): void {
    this.modalService.create({
      nzTitle: 'Workflow form',
      nzContent: CreateComponent,
    });
  }

  editWorkflow(id: string): void {
    const workflow = this.workflows.find((w: { id: string; }) => w.id === id);

    this.modalService.create({
      nzTitle: 'Workflow form',
      nzContent: CreateComponent,
      nzData: {
        workflow: workflow
      }
    });
  }

}
