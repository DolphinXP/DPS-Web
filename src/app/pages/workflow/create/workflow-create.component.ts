import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {WorkflowService} from "../../../services/workflow.service";
import {NZ_MODAL_DATA, NzModalModule, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";

@Component({
  selector: 'app-workflow-create',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzCardModule,
    NzStepsModule,
    NgForOf,
    NzButtonModule,
    NzTableModule,
    CdkDropList,
    CdkDrag,
    NzDividerModule,
    NzModalModule,
    NzPopconfirmModule
  ],
  templateUrl: './workflow-create.component.html',
  styleUrls: ['./workflow-create.component.css']
})
export class WorkflowCreateComponent implements OnInit {
  @ViewChild('nameInput') nameInput!: ElementRef;
  selectedIndex = 0;
  updateMode = false;
  workflowSteps: any[] = [];
  workflowName: string = '';
  workflowForm: FormGroup;
  warningMessage: string = '';

  constructor(@Inject(NZ_MODAL_DATA) public workflowData: any, private modalRef: NzModalRef, private workflowService: WorkflowService, private formBuilder: FormBuilder, private modal: NzModalService) {
    this.workflowForm = this.formBuilder.group({
      workflowName: [''],
      name: ['', Validators.required],
      processPath: ['', Validators.required],
      description: [''],
    });

  }

  ngOnInit(): void {
    if (this.workflowData) {
      const data = this.workflowData.workflow;

      // Initialize the form with the workflow data
      this.workflowForm.patchValue({
        workflowName: data.WorkflowName,
      });

      // If workflowSteps is an array, assign it to this.workflowSteps
      if (Array.isArray(data.WorkflowSteps)) {
        this.workflowSteps = data.WorkflowSteps;
      }
      this.warningMessage = "* The modified workflow only takes effect for tasks created afterwards.";
    }
  }

  addWorkflowStep() {
    if (!this.workflowForm.valid) {
      Object.values(this.workflowForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }

// Get the values from the form fields
    const name = this.workflowForm.get('name')?.value;
    const processPath = this.workflowForm.get('processPath')?.value;
    const description = this.workflowForm.get('description')?.value;

    // Create a new object with the form field values
    const newStep = {
      name: name,
      processPath: processPath,
      description: description
    };

    // Push the new object into the workflowSteps array
    if (this.updateMode) {
      this.workflowSteps.splice(this.selectedIndex, 1, newStep);
    } else {
      this.workflowSteps.push(newStep);
    }
    this.updateMode = false;

    this.nameInput.nativeElement.focus();

    console.log(newStep);
  }

  deleteWorkflowStep(index: number) {
    this.workflowSteps.splice(index, 1);
  }

  onSubmit() {
    this.workflowName = this.workflowForm.get('workflowName')?.value.trim();
    if (!this.workflowName) {
      this.modalInfo('Please enter a workflow name.');
      return;
    }
    if (this.workflowSteps.length <= 0) {
      this.modalInfo('Please add at least one step to the workflow.');
      return;
    }


    if (this.workflowData) {// update
      const id = this.workflowData.workflow.id;
      const result = {
        id: id,
        WorkflowName: this.workflowName,
        WorkflowSteps: this.workflowSteps,
      };

      this.workflowService.updateWorkflow(id, result).subscribe(data => {
        console.log(data);
        this.destroyModal();
      });
    } else { // add
      const result = {
        WorkflowName: this.workflowName,
        WorkflowSteps: this.workflowSteps,
      };

      this.workflowService.createWorkflow(result).subscribe(data => {
        console.log(data);
        this.destroyModal();
      });
    }
  }

  modalInfo(message: string): void {
    this.modal.info({
      nzTitle: 'Info',
      nzContent: message,
      nzOnOk: () => console.log('Info OK')
    });
  }

  destroyModal(): void {
    this.modalRef.destroy();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.workflowSteps, event.previousIndex, event.currentIndex);
  }

  rowClicked(index: number) {
// Check if index is within the array bounds
    if (index >= 0 && index < this.workflowSteps.length) {
      this.selectedIndex = index;
      // Get the item from the workflowSteps array
      const item = this.workflowSteps[index];

      // Set the form fields with the values from the item
      this.workflowForm.patchValue({
        name: item.name,
        processPath: item.processPath,
        description: item.description
      });

      this.updateMode = true;
    }
  }
}
