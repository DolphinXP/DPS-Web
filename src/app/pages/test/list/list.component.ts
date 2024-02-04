import {Component} from '@angular/core';
import {TestService} from "../../../services/test.service";
import {JsonPipe, NgForOf} from "@angular/common";
import {DragDropModule} from "ng-devui";
import {NzCardModule} from "ng-zorro-antd/card";

@Component({
    selector: 'app-test-list',
    standalone: true,
    imports: [
        NgForOf,
        JsonPipe,
        DragDropModule,
        NzCardModule
    ],
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent {
    tests: any;

    list1 = [
        {name: 'Visual Studio Code'},
        {name: 'WebStorm'},
        {name: 'Sublime'},
        {name: 'Atom (disable dragging)'}
    ];
    list2 = [];
    list3 = [];

    constructor(private testService: TestService) {
        this.testService.getTests().subscribe(data => {
            this.tests = data.data;
            console.log(data);
        });
    }

    onDrop(e: any, targetArray: any[]) {
        console.log(e);
        let index = e.dropIndex;
        const fromIndex = e.dragFromIndex;
        const item = e.dragData.item;
        if (-1 !== index) {
            /* 修正同一个container排序，往下拖动index多了1个位置*/
            if (-1 !== fromIndex && index > fromIndex) {
                index--;
            }
            targetArray.splice(index, 0, fromIndex === -1 ? item : targetArray.splice(fromIndex, 1)[0]);
        } else {
            targetArray.push(item);
        }
        if (fromIndex === -1) {
            this.removeItem(item, e.dragData.parent);
        }
    }

    removeItem(item: any, list: Array<any>) {
        const index = list.map(function (e) {
            return e.name;
        }).indexOf(item.name);
        list.splice(index, 1);
    }

    log(...v: any[]) {
        console.log(...v);
    }
}
