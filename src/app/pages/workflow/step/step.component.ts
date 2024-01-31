import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzSpaceItemDirective} from "ng-zorro-antd/space";
import {NzFormDirective} from "ng-zorro-antd/form";

@Component({
  selector: 'app-workflow-step',
  standalone: true,
  templateUrl: './step.component.html',
  imports: [
    ReactiveFormsModule,
    NzInputDirective,
    NzInputGroupComponent,
    NzRowDirective,
    NzColDirective,
    NzSpaceItemDirective,
    NzFormDirective,
  ],
  styleUrl: './step.component.css'
})
export class StepComponent {
  workflowForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.workflowForm = this.formBuilder.group({
      name: ['', Validators.required],
      processPath: ['', Validators.required],
      description: [''],
      multiple: [false]
    });
  }

  getFormValues() {
    if (!this.workflowForm.valid) {
      return "";
    }

    const formValues = {
      name: this.workflowForm.get('name')?.value,
      processPath: this.workflowForm.get('processPath')?.value,
      description: this.workflowForm.get('description')?.value,
      multiple: this.workflowForm.get('multiple')?.value
    };

    return JSON.stringify(formValues);
  }
}
