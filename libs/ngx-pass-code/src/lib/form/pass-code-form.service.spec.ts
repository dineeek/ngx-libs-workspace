import { TestBed } from '@angular/core/testing';

import { PassCodeFormService } from './pass-code-form.service';

describe('PassCodeFormService', () => {
  let service: PassCodeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassCodeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
