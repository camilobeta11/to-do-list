import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategoriesModalComponent } from './manage-categories-modal.component';

describe('ManageCategoriesModalComponent', () => {
  let component: ManageCategoriesModalComponent;
  let fixture: ComponentFixture<ManageCategoriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCategoriesModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

