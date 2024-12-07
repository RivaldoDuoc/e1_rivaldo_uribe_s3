import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { DbService } from '../services/db.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockDbService: any;

  beforeEach(async () => {
    // Mock del servicio DbService
    mockDbService = jasmine.createSpyObj('DbService', [
      'obtenerTodosLibros',
      'obtenerMejoresValorados',
      'obtenerLibrosPorCategoria',
    ]);
    mockDbService.obtenerTodosLibros.and.returnValue(
      Promise.resolve([
        { titulo: 'Libro 1', autor: 'Autor 1', categoria: 'Narrativos', valoracion: 5 },
        { titulo: 'Libro 2', autor: 'Autor 2', categoria: 'Técnicos', valoracion: 4 },
      ])
    );
    mockDbService.obtenerMejoresValorados.and.returnValue(
      Promise.resolve([
        { titulo: 'Libro 1', valoracion: 5 },
        { titulo: 'Libro 2', valoracion: 4 },
      ])
    );
    mockDbService.obtenerLibrosPorCategoria.and.returnValue(
      Promise.resolve([
        { titulo: 'Libro A', categoria: 'Narrativos' },
        { titulo: 'Libro B', categoria: 'Narrativos' },
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: DbService, useValue: mockDbService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar libros correctamente al cambiar de categoría', async () => {
    component.categoriaSeleccionada = 'Narrativos';
    await component.cambiarCategoria();
    expect(mockDbService.obtenerLibrosPorCategoria).toHaveBeenCalledWith('Narrativos');
    expect(component.librosFiltrados.length).toBe(2);
    expect(component.librosFiltrados[0].titulo).toBe('Libro A');
  });

  it('debería cargar los mejores valorados correctamente', async () => {
    component.categoriaSeleccionada = 'mejores';
    await component.cambiarCategoria();
    expect(mockDbService.obtenerMejoresValorados).toHaveBeenCalled();
    expect(component.librosFiltrados.length).toBe(2);
    expect(component.librosFiltrados[0].titulo).toBe('Libro 1');
  });

  it('debería cargar más libros en scroll infinito', () => {
    component.librosFiltrados = Array.from({ length: 10 }, (_, i) => ({
      titulo: `Libro ${i + 1}`,
      autor: `Autor ${i + 1}`,
    }));
    component.librosMostrados = component.librosFiltrados.slice(0, 5);
    component.cargarMasLibros({ target: { complete: () => {} } });

    expect(component.librosMostrados.length).toBe(10);
  });
});
