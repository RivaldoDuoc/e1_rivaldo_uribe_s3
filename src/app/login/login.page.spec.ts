import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockStorage: any;

  beforeEach(() => {
    // Mock para Storage
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    mockStorage.create.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: mockStorage }, // Proveedor de Storage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
