import {Component} from '@angular/core';
import {NomadService} from "../../../services/nomad.service";
import {NzTableModule} from "ng-zorro-antd/table";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-nomad-job-list',
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    NzTableModule,
    NgForOf
  ],
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  jobs: any;

  constructor(private nomadService: NomadService) {
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
}
