/* eslint-disable no-console */
import {
  IApp,
  IPageContent,
  IPageHeader,
  IPageFooter,
} from '../../types/interfaces';
import { View } from '../../types/enums';
import PageContent from '../PageContent/pageContent';
import PageHeader from '../PageHeader/pageHeader';
import PageFooter from '../PageFooter/pageFooter';

class App implements IApp {
  root: HTMLElement;

  pageHeader: IPageHeader;

  pageContent: IPageContent;

  pageFooter: IPageFooter;

  constructor() {
    this.root = document.getElementById('root') as HTMLElement;
    this.pageHeader = new PageHeader();
    this.pageContent = new PageContent(View.MAIN);
    this.pageFooter = new PageFooter();
  }

  listen(): void {
    this.root.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.pageContent.listen(target);
    });
    this.root.addEventListener('keydown', (event) => {
      const eventCode = (<KeyboardEvent>event).code;
      this.pageContent.listenKey(eventCode);
    });
    document.addEventListener('storage', (event) => {
      const { key } = <StorageEvent>event;
      this.pageContent.listenStorage(key);
    });
  }

  async render() {
    this.root.innerHTML = `
      <header class="page-header">
      </header>
      <main class="page-content">
      </main>
      <footer class="page-footer">
      </footer>
    `;
    this.pageHeader.render();
    this.pageContent.render();
    this.pageFooter.render();
  }
}

export default App;
