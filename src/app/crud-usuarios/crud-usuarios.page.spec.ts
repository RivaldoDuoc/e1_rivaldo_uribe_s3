import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CrudUsuariosPage } from './crud-usuarios.page';
import { DbService } from '../services/db.service';
import { of } from 'rxjs';

describe('CrudUsuariosPage', () => {
  let component: CrudUsuariosPage;
  let fixture: ComponentFixture<CrudUsuariosPage>;
  let mockDbService: any;

  beforeEach(async () => {
    // Mock del servicio DbService
    mockDbService = jasmine.createSpyObj('DbService', ['getAllUsers', 'updateUser', 'deleteUser']);
    mockDbService.getAllUsers.and.returnValue(of([
      { id: 1, nombre: 'Test', apellidos: 'User', email: 'test@user.com', tipoUsuario: 'admin' },
      { id: 2, nombre: 'John', apellidos: 'Doe', email: 'john@doe.com', tipoUsuario: 'user' },
    ]));
    mockDbService.updateUser.and.returnValue(Promise.resolve());
    mockDbService.deleteUser.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      declarations: [CrudUsuariosPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: DbService, useValue: mockDbService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debería iniciar la edición de un usuario', () => {
    const user = { id: 1, nombre: 'Test', apellidos: 'User', email: 'test@user.com', tipoUsuario: 'admin' };
    component.editUser(user);

    expect(component.selectedUser).toEqual(user);
    expect(component.editForm.value.nombre).toBe(user.nombre);
  });

 
  it('debería cancelar la edición', () => {
    component.selectedUser = { id: 1, nombre: 'Test', apellidos: 'User' };
    component.cancelEdit();

    expect(component.selectedUser).toBeNull();
  });


});
