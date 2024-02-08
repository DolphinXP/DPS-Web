import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkTemplateListComponent} from './work-template-list.component';

describe('WorkflowListComponent', () => {
    let component: WorkTemplateListComponent;
    let fixture: ComponentFixture<WorkTemplateListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkTemplateListComponent]
        });
        fixture = TestBed.createComponent(WorkTemplateListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
