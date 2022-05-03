import {EntityCrudResult} from '../entities/entity-crud-result';
import {Student} from '../entities/student';
import {AppConstants} from './app-constants';
import {TableListDatasource} from '../entities/table-list-datasource';

export class CrudViewUtil {

  static updateListFromCrudResult(result: EntityCrudResult, datasource: TableListDatasource) {
    if (result) {
      const entity = result.entity;
      if (result.action === AppConstants.FORM_ACTION.ADD) {
        datasource.list.push(entity);
        datasource.totalElements += 1;
      } else {
        const entityIndex =
          datasource.list.findIndex(entityFromList => entityFromList.id === entity.id);
        if (entityIndex >= 0) {
          if (result.action === AppConstants.FORM_ACTION.UPDATE) {
            datasource.list[entityIndex] = entity;
          } else if (result.action === AppConstants.FORM_ACTION.DELETE) {
            datasource.list.splice(entityIndex, 1);
            datasource.totalElements -= 1;
            datasource.pageSize -= 1;
          }
        }
      }
    }

    return datasource;
  }
}

