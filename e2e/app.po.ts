import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/login');
  }

  getSidebarHeading() {
    return element(by.css('app-root h1')).getAttribute('class');
  }
}
