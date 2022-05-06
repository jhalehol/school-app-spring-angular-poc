import {HttpHeaders} from '@angular/common/http';

export class AppConstants {

  public static PAGINATION_DATA = {
    DEFAULT_PAGE_SIZE: 10
  };

  public static FORM_VALIDATIONS = {
    REQUIRED: 'required',
    EMAIL: 'email',
    MAX_LENGTH: 'maxlength',
    MIN_LENGTH: 'minlength',
    MAX_VALUE: 'max',
    MIN_VALUE: 'min'
  };

  public static FORM_ACTION = {
    ADD: 'add',
    UPDATE: 'update',
    DELETE: 'delete'
  };

  public static COMMON_HTTP_OPTIONS = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
}
