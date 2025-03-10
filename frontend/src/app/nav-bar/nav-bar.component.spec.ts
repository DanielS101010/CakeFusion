import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { NavBarComponent } from './nav-bar.component';


describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent, RouterModule.forRoot([])]
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
  
});