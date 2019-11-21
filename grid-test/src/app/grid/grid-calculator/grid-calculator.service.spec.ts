import { TestBed } from '@angular/core/testing';

import { GridCalculatorService } from './grid-calculator.service';

describe('GridCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridCalculatorService = TestBed.get(GridCalculatorService);
    expect(service).toBeTruthy();
  });
});
