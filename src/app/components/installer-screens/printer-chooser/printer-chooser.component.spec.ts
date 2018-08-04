import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterChooserComponent } from './printer-chooser.component';

describe('PrinterChooserComponent', () => {
  let component: PrinterChooserComponent;
  let fixture: ComponentFixture<PrinterChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
