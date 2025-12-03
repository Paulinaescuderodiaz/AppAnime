// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Import all test files explicitly
// Services
import './app/services/auth.service.spec';
import './app/services/anime.service.spec';
import './app/services/review.service.spec';
import './app/services/storage.service.spec';

// Pages
import './app/pages/home/home.page.spec';
import './app/pages/login/login.page.spec';
import './app/pages/register/register.page.spec';
import './app/pages/anime-detail/anime-detail.page.spec';
import './app/pages/profile/profile.page.spec';
import './app/pages/less-viewed/less-viewed.page.spec';
