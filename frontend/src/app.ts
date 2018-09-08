import {Aurelia} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Time Capsule';
    config.map([
      {
        route: ['/', 'search'],
        name: 'search',
        href: 'search',
        moduleId: PLATFORM.moduleName('pages/search/search'),
        title: 'Search',
        nav: true,
      },
      {
        route: ['upload', 'upload'],
        name: 'upload',
        href: 'upload',
        moduleId: PLATFORM.moduleName('pages/upload/upload'),
        title: 'Upload',
        nav: true,
      },
    ]);

    this.router = router;
    console.log(router);
  }
}
