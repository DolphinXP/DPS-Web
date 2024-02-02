import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {WorkflowService} from "../../../services/workflow.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";

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
    NzButtonModule
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('workflowNameInput') workflowNameInput!: ElementRef;

  workflowSteps: any[] = [];
  workflowName: string = '';
  workflowStepForm: FormGroup;
  disableDelButton = true;
  buttonText: string = 'Add+';
  index = 0;

  constructor(private workflowService: WorkflowService, private formBuilder: FormBuilder, private modal: NzModalService) {
    this.workflowStepForm = this.formBuilder.group({
      workflowName: [''],
      name: ['', Validators.required],
      processPath: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.workflowSteps.push({name: 'Start', processPath: '', description: 'Start of the workflow'});
    this.workflowSteps.push({name: 'Finish', processPath: '', description: 'Finish of the workflow'});

    // Subscribe to the valueChanges observable of the workflowStepForm
    this.workflowStepForm.valueChanges.subscribe(values => {
      // Check if the current index is not 0
      if (this.index !== 0 && this.index != this.workflowSteps.length - 1) {
        // Update the corresponding item in the workflowSteps array with the new form values
        this.workflowSteps[this.index] = {
          name: values.name,
          processPath: values.processPath,
          description: values.description
        };
      }
    });
  }

  addWorkflowStep() {
    if (!this.workflowStepForm.valid) {
      Object.values(this.workflowStepForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      return;
    }
    if (this.buttonText === 'Update') {
      this.buttonText = 'Add+';
      this.nameInput.nativeElement.focus();
      this.index = this.workflowSteps.length - 1;
      return;
    }

// Get the values from the form fields
    const name = this.workflowStepForm.get('name')?.value;
    const processPath = this.workflowStepForm.get('processPath')?.value;
    const description = this.workflowStepForm.get('description')?.value;

    // Create a new object with the form field values
    const newStep = {
      name: name,
      processPath: processPath,
      description: description
    };

    // Push the new object into the workflowSteps array
    this.workflowSteps.splice(this.workflowSteps.length - 1, 0, newStep);

    this.nameInput.nativeElement.focus();
    this.index = this.workflowSteps.length - 1;

    console.log(newStep);
  }

  removeWorkflowStep() {
    if (this.index === 0 || this.index === this.workflowSteps.length - 1) {
      return;
    }
    this.workflowSteps.splice(this.index, 1);
  }

  onIndexChange(event: number): void {
    this.index = event;
    if (this.index === 0 || this.index === this.workflowSteps.length - 1) {
      this.disableDelButton = true;
      this.buttonText = 'Add+';
      return;
    }

    // Retrieve the step from workflowSteps using the index
    const step = this.workflowSteps[this.index];

    // Check if the step exists
    if (step) {
      // Use patchValue to update the workflowStepForm with the values from the step
      this.workflowStepForm.patchValue({
        name: step.name,
        processPath: step.processPath,
        description: step.description
      });

      this.buttonText = 'Update';
      this.disableDelButton = false;
    }
  }

  onSubmit() {
    this.workflowName = this.workflowStepForm.get('workflowName')?.value.trim();
    if (!this.workflowName) {
      this.modalInfo('Please enter a workflow name.');
      this.workflowNameInput.nativeElement.focus();
      return;
    }
    if (this.workflowSteps.length <= 2) {
      this.modalInfo('Please add at least one step to the workflow.');
      this.nameInput.nativeElement.focus();
      return;
    }

    const result = {
      WorkflowName: this.workflowName,
      WorkflowSteps: this.workflowSteps,
      //WorkflowSteps: this.workflowSteps.slice(1, -1),
    };

    console.log(JSON.stringify(result));
    this.workflowService.createWorkflow(result).subscribe(data => {
      console.log(data);
    });
  }

  modalInfo(message: string): void {
    this.modal.info({
      nzTitle: 'Info',
      nzContent: message,
      nzOnOk: () => console.log('Info OK')
    });
  }
}
