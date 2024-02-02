import {Component, OnInit} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {CommonModule, NgForOf, NgTemplateOutlet} from "@angular/common";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {WorkflowCreateComponent} from "../create/workflow-create.component";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {WorkflowDetailComponent} from "../detail/workflow-detail.component";

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  templateUrl: './workflow-list.component.html',
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
    WorkflowCreateComponent,
    NzPopconfirmModule
  ],
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
  workflows: any;

  constructor(private workflowService: WorkflowService, private modalService: NzModalService) {

  }

  ngOnInit(): void {
    this.workflowService.getWorkflows().subscribe(data => {
      this.workflows = data.data;
      console.log(data);
    });
  }

  showModal(): void {
    this.modalService.create({
      nzTitle: 'Workflow form',
      nzContent: WorkflowCreateComponent,
    });
  }

  viewWorkflow(id: string): void {
    const workflow = this.workflows.find((w: { id: string; }) => w.id === id);

    this.modalService.create({
      nzTitle: 'Workflow detail',
      nzContent: WorkflowDetailComponent,
      nzData: {
        workflow: workflow
      }
    });
  }

  editWorkflow(id: string): void {
    const workflow = this.workflows.find((w: { id: string; }) => w.id === id);

    this.modalService.create({
      nzTitle: 'Workflow form',
      nzContent: WorkflowCreateComponent,
      nzData: {
        workflow: workflow
      },
    }).afterClose.subscribe((result: any) => {
      // Refresh the workflows list
      this.workflowService.getWorkflows().subscribe(data => {
        this.workflows = data.data;
      });
    });
  }

  deleteWorkflow(id: string): void {
    const workflow = this.workflows.find((w: { id: string; }) => w.id === id);

    this.workflowService.deleteWorkflow(workflow.id).subscribe({
      next: response => {
        this.workflows = this.workflows.filter((workflow: any) => workflow.id !== id);
      }, error: err => {
        // Handle error
        console.error('Error deleting workflow:', err);
      }
    });
  }
}
