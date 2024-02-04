import {Component, OnInit} from '@angular/core';
import {WorkItemService} from "../../../services/work-item.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";

@Component({
    selector: 'app-work-item-list',
    templateUrl: './work-item-list.component.html',
    standalone: true,
    imports: [
        DatePipe,
        NgForOf,
        NzButtonModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzTableModule,
        NzWaveModule,
        NzModalModule,
        FormsModule,
        NzFormModule,
        NzGridModule,
        NzInputModule,
        ReactiveFormsModule,
        NgIf
    ],
    styleUrls: ['./work-item-list.component.css']
})
export class WorkItemListComponent implements OnInit {
    workItems: any;
    currentWorkItem: any;
    isCreateModalVisible: boolean = false;
    createForm: FormGroup;
    updateMode: boolean = false;
    warningMessage = "* The modified work item only takes effect for tasks created afterwards.";

    constructor(private workItemService: WorkItemService, private formBuilder: FormBuilder, private modalService: NzModalService) {
        this.createForm = this.formBuilder.group({
            name: ['', Validators.required],
            processPath: ['', Validators.required],
            description: [''],
        });
    }

    ngOnInit(): void {
        this.refreshList();
    }

    refreshList() {
        // Refresh the list
        this.workItemService.getWorkItems().subscribe(data => {
            this.workItems = data.data;
            console.log(data);
        });
    }

    showCreateModal() {
        this.updateMode = false;
        this.createForm.reset();
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
        // Get the values from the form fields
        const name = this.createForm.get('name')?.value;
        const processPath = this.createForm.get('processPath')?.value;
        const description = this.createForm.get('description')?.value;

        // Create a new object with the form field values
        const workItem = {
            id: null,
            name: name,
            processPath: processPath,
            description: description
        };

        if (this.updateMode) {
            const id = this.currentWorkItem.id;
            workItem.id = this.currentWorkItem.id;
            this.workItemService.updateWorkItem(id, workItem).subscribe(data => {
                console.log(data);
                this.isCreateModalVisible = false;
                this.refreshList();
            });
        } else {
            this.workItemService.createWorkItem(workItem).subscribe(data => {
                console.log(data);
                this.isCreateModalVisible = false;
                this.refreshList();
            });
        }
    }

    handleCancel(): void {
        this.isCreateModalVisible = false;
    }

    editWorkItem(id: string) {
        this.updateMode = true;
        this.currentWorkItem = this.workItems.find((w: { id: string; }) => w.id === id);

        this.createForm.patchValue({
            name: this.currentWorkItem.name,
            processPath: this.currentWorkItem.processPath,
            description: this.currentWorkItem.description
        });

        this.isCreateModalVisible = true;
    }

    deleteWorkItem(id: string) {
        const workItem = this.workItems.find((w: { id: string; }) => w.id === id);

        this.workItemService.deleteWorkItem(workItem.id).subscribe({
            next: response => {
                this.workItems = this.workItems.filter((workflow: any) => workflow.id !== id);
            }, error: err => {
                // Handle error
                console.error('Error deleting workflow:', err);
            }
        });
    }
}
