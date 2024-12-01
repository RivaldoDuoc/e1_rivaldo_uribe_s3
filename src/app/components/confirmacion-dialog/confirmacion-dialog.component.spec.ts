import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ConfirmacionDialogComponent } from './confirmacion-dialog.component';

describe('ConfirmacionDialogComponent', () => {
  let component: ConfirmacionDialogComponent;
  let fixture: ComponentFixture<ConfirmacionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionDialogComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: {} }, 
        { provide: MAT_DIALOG_DATA, useValue: {} }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
