import { TestBed, inject } from '@angular/core/testing';

import { AutosuggestService } from './autosuggest.service';

describe('AutosuggestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutosuggestService]
    });
  });

  it('should be created', inject([AutosuggestService], (service: AutosuggestService) => {
    expect(service).toBeTruthy();
  }));
});
