import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponentsComponent } from './app-components.component';

describe('AppComponentsComponent', () => {
  let component: AppComponentsComponent;
  let fixture: ComponentFixture<AppComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
