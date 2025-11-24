import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Temas } from './temas';

describe('Temas', () => {
  let component: Temas;
  let fixture: ComponentFixture<Temas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Temas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Temas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
