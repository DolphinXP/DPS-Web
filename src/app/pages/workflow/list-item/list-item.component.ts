import {Component} from '@angular/core';
import {NzStepsModule} from "ng-zorro-antd/steps";

@Component({
    selector: 'app-workflow-list-item',
    standalone: true,
    imports: [
        NzStepsModule
    ],
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.css']
})
export class ListItemComponent {
    index = 0;

    onIndexChange(event: number): void {
        this.index = event;
    }
}
