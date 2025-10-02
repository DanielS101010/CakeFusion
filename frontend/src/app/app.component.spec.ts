import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FilterService } from './service/filter.service';

const filterServiceStub = {
  setSelectedTags: jasmine.createSpy('setSelectedTags'),
  setSearchTerm: jasmine.createSpy('setSearchTerm'),
  filteredDoughs: jasmine.createSpy('filteredDoughs'),
  filteredFillings: jasmine.createSpy('filteredFillings'),
  filteredToppings: jasmine.createSpy('filteredToppings'),
  filteredCakes: jasmine.createSpy('filteredCakes')
};

describe('AppComponent', () => {
  beforeEach(async () => {
    Object.values(filterServiceStub).forEach(value => {
      if (typeof value === 'function' && 'calls' in value) {
        (value as jasmine.Spy).calls.reset();
      }
    });
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [{ provide: FilterService, useValue: filterServiceStub }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render NavBar and RouterOutlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navBar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
