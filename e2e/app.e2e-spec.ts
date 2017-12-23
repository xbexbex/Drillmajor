import { AppPage } from './app.po';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display sidebar', () => {
    page.navigateTo();
    expect(page.getSidebarHeading()).toEqual('title');
  });
});
