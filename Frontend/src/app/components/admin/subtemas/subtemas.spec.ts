import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtemas } from './subtemas';

describe('Subtemas', () => {
  let component: Subtemas;
  let fixture: ComponentFixture<Subtemas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtemas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtemas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
