import {Component, Inject} from '@angular/core';
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzCardModule} from "ng-zorro-antd/card";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  standalone: true,
  imports: [
    NzStepsModule,
    NzCardModule,
    NgForOf
  ],
  styleUrls: ['./workflow-detail.component.css']
})
export class WorkflowDetailComponent {

  workflow: any;

  constructor(@Inject(NZ_MODAL_DATA) public workflowData: any, private modalRef: NzModalRef) {

    this.workflow = workflowData.workflow;
  }
}
