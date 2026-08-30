import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprioLayout } from './proprio-layout';

describe('ProprioLayout', () => {
  let component: ProprioLayout;
  let fixture: ComponentFixture<ProprioLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProprioLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprioLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
