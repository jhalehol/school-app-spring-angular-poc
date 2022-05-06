import { EntityCrudResult } from '../entities/entity-crud-result';
import { AppConstants } from './app-constants';
import { TableListDatasource } from '../entities/table-list-datasource';
import { FormGroup } from '@angular/forms';

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

  static isRequiredFieldWithError(form: FormGroup, control: string): boolean {
    if (form) {
      const formControl = form.controls[control];
      if (formControl) {
        return formControl.hasError(AppConstants.FORM_VALIDATIONS.REQUIRED) ||
          formControl.hasError(AppConstants.FORM_VALIDATIONS.MAX_LENGTH) ||
          formControl.hasError(AppConstants.FORM_VALIDATIONS.MAX_VALUE);
      }
    }

    return false;
  }
}

