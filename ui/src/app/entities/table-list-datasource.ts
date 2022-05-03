import {AppConstants} from '../common/app-constants';

export class TableListDatasource {

  list: any[] = [];
  totalElements: number;
  pageSize: number = AppConstants.PAGINATION_DATA.DEFAULT_PAGE_SIZE;
  selectedPage: number = 0;
}
