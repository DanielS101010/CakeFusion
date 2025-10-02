import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FilterService } from '../service/filter.service';

import { NavBarComponent } from './nav-bar.component';

const filterServiceStub = {
  setSearchTerm: jasmine.createSpy('setSearchTerm')
};

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    filterServiceStub.setSearchTerm.calls.reset();
    await TestBed.configureTestingModule({
      imports: [NavBarComponent, RouterModule.forRoot([])],
      providers: [{ provide: FilterService, useValue: filterServiceStub }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a.button');
    expect(links.length).toBe(5);
    expect(links[0].getAttribute('ng-reflect-router-link')).toBe('');
    expect(links[1].getAttribute('ng-reflect-router-link')).toBe('./Teig');
    expect(links[2].getAttribute('ng-reflect-router-link')).toBe('./Füllung');
    expect(links[3].getAttribute('ng-reflect-router-link')).toBe('./Topping');
    expect(links[4].getAttribute('ng-reflect-router-link')).toBe('./Kuchen');
  });

  it('should defer filtering until the search button is pressed', () => {
    const input = fixture.nativeElement.querySelector('.searchBar') as HTMLInputElement;
    input.value = 'Blueberry';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(filterServiceStub.setSearchTerm).not.toHaveBeenCalled();
    expect(component.searchString).toBe('Blueberry');

    const button = fixture.nativeElement.querySelector('.searchButton') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(filterServiceStub.setSearchTerm).toHaveBeenCalledTimes(1);
    expect(filterServiceStub.setSearchTerm).toHaveBeenCalledWith('Blueberry');
  });

  it('should trigger filtering when pressing the enter key', () => {
    const input = fixture.nativeElement.querySelector('.searchBar') as HTMLInputElement;
    input.value = 'Apple Pie';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    filterServiceStub.setSearchTerm.calls.reset();

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    input.dispatchEvent(enterEvent);
    fixture.detectChanges();

    expect(filterServiceStub.setSearchTerm).toHaveBeenCalledTimes(1);
    expect(filterServiceStub.setSearchTerm).toHaveBeenCalledWith('Apple Pie');
  });
  
});
