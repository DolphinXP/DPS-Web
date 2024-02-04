import {Component, OnInit} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzCardModule} from "ng-zorro-antd/card";
import {WorkItemService} from "../../../services/work-item.service";
import {DevUIModule} from "ng-devui";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTagModule} from "ng-zorro-antd/tag";

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    standalone: true,
    imports: [
        DatePipe,
        FormsModule,
        NgForOf,
        NgIf,
        NzButtonModule,
        NzDividerModule,
        NzFormModule,
        NzGridModule,
        NzInputModule,
        NzModalModule,
        NzPopconfirmModule,
        NzTableModule,
        NzWaveModule,
        ReactiveFormsModule,
        DevUIModule,
        NzCardModule,
        NzToolTipModule,
        NzTagModule
    ],
    styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
    workItems: any[] = [];
    workflowWorkItems: any[] = [];
    workflows: any;
    currentWorkflow: any;
    isCreateModalVisible = false;
    createForm: FormGroup;
    updateMode: boolean = false;
    warningMessage = "* The modified workflow only takes effect for tasks created afterwards.";

    constructor(private workflowService: WorkflowService, private workItemService: WorkItemService, private formBuilder: FormBuilder, private modalService: NzModalService) {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            WorkItems: [''],
        });
    }

    ngOnInit(): void {
        this.refreshList();
    }

    refreshList() {
        this.workItemService.getWorkItems().subscribe(data => {
            this.workItems = data.data;
            console.log(data);
        });

        this.workflowService.getWorkflows().subscribe(data => {
            this.workflows = data.data;
            console.log(data);
        });
    }

    showCreateModal() {
        this.updateMode = false;
        this.createForm.reset();
        this.workflowWorkItems = [];
        this.isCreateModalVisible = true;
    }

    handleOk(): void {
        if (!this.createForm.valid) {
            Object.values(this.createForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({onlySelf: true});
                }
            });
            return;
        }
        if (this.workflowWorkItems.length === 0) {
            this.modalService.error({
                nzTitle: 'Error',
                nzContent: 'Please select at least one work item for the workflow.'
            });
            return;
        }
        // Get the values from the form fields
        const Name = this.createForm.get('Name')?.value;

        // Create a new object with the form field values
        const workflow = {
            id: null,
            Name: Name,
            WorkItems: this.workflowWorkItems
        };

        if (this.updateMode) {
            const id = this.currentWorkflow.id;
            workflow.id = this.currentWorkflow.id;
            this.workflowService.updateWorkflow(id, workflow).subscribe(data => {
                console.log(data);
                this.isCreateModalVisible = false;
                this.refreshList();
            });
        } else {
            this.workflowService.createWorkflow(workflow).subscribe(data => {
                console.log(data);
                this.isCreateModalVisible = false;
                this.refreshList();
            });
        }
    }

    handleCancel(): void {
        this.isCreateModalVisible = false;
    }

    onDrop(e: any, targetArray: any[]) {
        // console.log(e);
        let index = e.dropIndex;
        const fromIndex = e.dragFromIndex;
        const item = e.dragData.item;
        const parentArray = e.dragData.parent;

        // 如果是往 workflowWorkItems 放置，原来的workItems不删除
        if (targetArray === this.workflowWorkItems) {
            if (-1 !== index) {
                /* 修正同一个container排序，往下拖动index多了1个位置*/
                if (-1 !== fromIndex && index > fromIndex) {
                    index--;
                }
                targetArray.splice(index, 0, fromIndex === -1 ? item : targetArray.splice(fromIndex, 1)[0]);
            } else {
                targetArray.push(item);
            }
        }
        // 如果是往 workItems 放置，原来的workflowWorkItems删除，但workItems不变
        else if (fromIndex === -1) {
            this.removeItem(item, parentArray);
        }
    }

    removeItem(item: any, list: Array<any>) {
        const index = list.map(function (e) {
            return e.id;
        }).indexOf(item.id);
        list.splice(index, 1);
    }

    deleteWorkflow(id: string) {
        this.workflowService.deleteWorkflow(id).subscribe({
            next: response => {
                this.workflows = this.workflows.filter((workflow: any) => workflow.id !== id);
            }, error: err => {
                // Handle error
                console.error('Error deleting workflow:', err);
            }
        });
    }

    editWorkflow(id: string) {
        this.updateMode = true;
        this.currentWorkflow = this.workflows.find((w: { id: string; }) => w.id === id);

        this.createForm.patchValue({
            Name: this.currentWorkflow.Name,
        });
        this.workflowWorkItems = this.currentWorkflow.WorkItems;

        this.isCreateModalVisible = true;
    }
}
