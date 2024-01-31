import {Component, ComponentFactoryResolver, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {StepComponent} from "../step/step.component";
import {NgForOf} from "@angular/common";
import {FormBuilder, FormsModule} from "@angular/forms";
import {WorkflowService} from "../../../services/workflow.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzInputDirective} from "ng-zorro-antd/input";

@Component({
  selector: 'app-workflow-create',
  standalone: true,
  imports: [
    NgForOf,
    StepComponent,
    FormsModule,
    NzButtonComponent,
    NzInputDirective
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  @ViewChildren(StepComponent) stepComponents!: QueryList<StepComponent>;
  workflowSteps: any[] = [];
  workflowName: string = '';

  constructor(private formBuilder: FormBuilder, private workflowService: WorkflowService, private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
  }

  addWorkflowStep() {
    // this.workflowSteps.push(new StepComponent(this.formBuilder));
    const factory = this.resolver.resolveComponentFactory(StepComponent);
    const newStep = factory.create(this.container.injector);
    this.workflowSteps.push(newStep);
  }

  removeWorkflowStep(step: StepComponent) {
    this.workflowSteps.splice(this.workflowSteps.indexOf(step), 1);
  }

  onSubmit() {
    if (this.stepComponents.length === 0) {
      alert('Please add at least one step to the workflow.');
      return;
    }

    if (this.workflowName === '') {
      alert('Please enter a workflow name.');
      return;
    }

    const hasEmptyFormValues = this.stepComponents.some(step => {
      const formValues = step.getFormValues();
      return formValues === "";
    });

    if (hasEmptyFormValues) {
      alert('Please fill in all fields in each step.');
      return;
    }


    const result = {
      WorkflowName: this.workflowName,
      WorkflowSteps: this.stepComponents.map(step => JSON.parse(step.getFormValues()))
    };

    console.log(JSON.stringify(result));
    this.workflowService.createWorkflow(result).subscribe(data => {
      console.log(data);
    });
  }
}
