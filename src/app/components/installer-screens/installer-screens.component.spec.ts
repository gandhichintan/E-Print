import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallerScreensComponent } from './installer-screens.component';

describe('InstallerScreensComponent', () => {
  let component: InstallerScreensComponent;
  let fixture: ComponentFixture<InstallerScreensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallerScreensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallerScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
