import { TestBed } from '@angular/core/testing';
import { DbService } from './db.service';

describe('DbService', () => {
  let service: DbService;
  let mockSQLite: any;

  beforeEach(() => {
    // Crear mocks para SQLiteConnection
    mockSQLite = jasmine.createSpyObj('SQLiteConnection', [
      'createConnection',
      'open',
      'closeConnection',
      'query',
      'execute',
      'run',
    ]);

    mockSQLite.createConnection.and.returnValue(Promise.resolve(mockSQLite));
    mockSQLite.open.and.returnValue(Promise.resolve());
    mockSQLite.closeConnection.and.returnValue(Promise.resolve());
    mockSQLite.query.and.returnValue(
      Promise.resolve({ values: [{ id: 1, email: 'test@user.com', nombre: 'Test User' }] })
    );
    mockSQLite.run.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        DbService,
        { provide: 'SQLiteConnection', useValue: mockSQLite },
      ],
    });

    service = TestBed.inject(DbService);
  });

  it('debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });  
});
