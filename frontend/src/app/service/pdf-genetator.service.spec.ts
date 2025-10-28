import { TestBed } from '@angular/core/testing';

import { PdfGenetatorService } from './pdf-genetator.service';
import { ImageService } from './image.service';

describe('PdfGenetatorService', () => {
  let service: PdfGenetatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageService]
    });
    service = TestBed.inject(PdfGenetatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
