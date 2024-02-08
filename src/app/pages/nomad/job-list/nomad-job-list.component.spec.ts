import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NomadJobListComponent} from './nomad-job-list.component';

describe('ListComponent', () => {
    let component: NomadJobListComponent;
    let fixture: ComponentFixture<NomadJobListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NomadJobListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NomadJobListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
