import { TestBed } from '@angular/core/testing';

import { UserRepoService } from './user-repo.service';

describe('UserRepoService', () => {
  let service: UserRepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
