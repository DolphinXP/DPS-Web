import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkflowListComponent1} from './workflow-list-component1.component';

describe('ListComponent', () => {
    let component: WorkflowListComponent1;
    let fixture: ComponentFixture<WorkflowListComponent1>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WorkflowListComponent1]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WorkflowListComponent1);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
