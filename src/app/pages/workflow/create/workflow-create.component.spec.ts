import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WorkflowCreateComponent} from './workflow-create.component';

describe('CreateComponent', () => {
  let component: WorkflowCreateComponent;
  let fixture: ComponentFixture<WorkflowCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkflowCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
