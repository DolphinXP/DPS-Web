import {Component, OnInit} from '@angular/core';
import {NomadService} from "../../../services/nomad.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzDividerModule} from "ng-zorro-antd/divider";

@Component({
    selector: 'app-nomad-job-job-list',
    standalone: true,
    templateUrl: './nomad-job-list.component.html',
    imports: [
        NzTableModule,
        NgForOf,
        NzButtonModule,
        NzWaveModule,
        NzDividerModule
    ],
    styleUrls: ['./nomad-job-list.component.css']
})
export class NomadJobListComponent implements OnInit {
    isCreateModalVisible: boolean = false;
    jobs: any;

    constructor(private nomadService: NomadService, private modalService: NzModalService) {

    }

    ngOnInit(): void {
        this.refreshList();
        setInterval(() => {
            this.refreshList();
        }, 1000);
    }

    refreshList() {
        this.nomadService.getJobs().subscribe(data => {
            this.jobs = data.data;
            this.jobs.sort((a: any, b: any) => b.SubmitTime - a.SubmitTime);
            this.jobs = this.jobs.map((job: any) => {
                job.SubmitTime = this.formatTime(job.SubmitTime);
                return job;
            });
            console.log(data);
        });
    }

    formatTime(time: number) {
        let date = new Date(time / 1000000);
        let formattedDate = date.getFullYear() + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('0' + date.getDate()).slice(-2) + ' ' +
            ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2) + ':' +
            ('0' + date.getSeconds()).slice(-2);
        console.log(formattedDate);
        return formattedDate;
    }

    startJob() {
        this.nomadService.startJob(null).subscribe(data => this.refreshList());
    }

    stopJob() {
        this.nomadService.stopJob("test1").subscribe(data => this.refreshList());
    }

    deleteJob() {
        this.nomadService.deleteJob("test1").subscribe(data => this.refreshList());
    }
}
