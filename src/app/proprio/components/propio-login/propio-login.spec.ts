import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropioLogin } from './propio-login';

describe('PropioLogin', () => {
  let component: PropioLogin;
  let fixture: ComponentFixture<PropioLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropioLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(PropioLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
