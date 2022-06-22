import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventarioComponent } from './admin-inventario.component';

describe('AdminInventarioComponent', () => {
  let component: AdminInventarioComponent;
  let fixture: ComponentFixture<AdminInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
