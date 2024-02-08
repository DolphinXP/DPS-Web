import {Component, OnInit} from '@angular/core';
import {WorkTemplateService} from "../../../services/work-template.service";
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
    selector: 'app-work-template-job-list',
    templateUrl: './work-template-list.component.html',
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
    styleUrls: ['./work-template-list.component.css']
})
export class WorkTemplateListComponent implements OnInit {
    workItems: any[] = [];
    workTemplateWorkItems: any[] = [];
    workTemplates: any;
    currentWorkTemplate: any;
    isCreateModalVisible = false;
    createForm: FormGroup;
    updateMode: boolean = false;
    warningMessage = "* The modified workflow template only takes effect for tasks created afterwards.";

    constructor(private workTemplateService: WorkTemplateService, private workItemService: WorkItemService, private formBuilder: FormBuilder, private modalService: NzModalService) {
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

        this.workTemplateService.getWorkTemplates().subscribe(data => {
            this.workTemplates = data.data;
            console.log(data);
        });
    }

    showCreateModal() {
        this.updateMode = false;
        this.createForm.reset();
        this.workTemplateWorkItems = [];
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
        if (this.workTemplateWorkItems.length === 0) {
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
            WorkItems: this.workTemplateWorkItems
        };

        if (this.updateMode) {
            const id = this.currentWorkTemplate.id;
            workflow.id = this.currentWorkTemplate.id;
            this.workTemplateService.updateWorkTemplate(id, workflow).subscribe(data => {
                console.log(data);
                this.isCreateModalVisible = false;
                this.refreshList();
            });
        } else {
            this.workTemplateService.createWorkTemplate(workflow).subscribe(data => {
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
        if (targetArray === this.workTemplateWorkItems) {
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
        this.workTemplateService.deleteWorkTemplate(id).subscribe({
            next: response => {
                this.workTemplates = this.workTemplates.filter((workflow: any) => workflow.id !== id);
            }, error: err => {
                // Handle error
                console.error('Error deleting workflow:', err);
            }
        });
    }

    editWorkflow(id: string) {
        this.updateMode = true;
        this.currentWorkTemplate = this.workTemplates.find((w: { id: string; }) => w.id === id);

        this.createForm.patchValue({
            Name: this.currentWorkTemplate.Name,
        });
        this.workTemplateWorkItems = this.currentWorkTemplate.WorkItems;

        this.isCreateModalVisible = true;
    }
}
