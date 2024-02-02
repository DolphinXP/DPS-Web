import {Component} from '@angular/core';
import {TestService} from "../../../services/test.service";
import {JsonPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [
    NgForOf,
    JsonPipe
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  tests: any;

  constructor(private testService: TestService) {
    this.testService.getTests().subscribe(data => {
      this.tests = data.data;
      console.log(data);
    });
  }
}
