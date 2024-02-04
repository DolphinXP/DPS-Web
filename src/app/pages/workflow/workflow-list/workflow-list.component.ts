import {Component, OnInit} from '@angular/core';
import {WorkflowService} from "../../../services/workflow.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    standalone: true,
    styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {
    workflows: any;

    constructor(private workflowService: WorkflowService, private modalService: NzModalService) {
    }

    ngOnInit(): void {
    }
}
