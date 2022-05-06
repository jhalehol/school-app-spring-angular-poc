import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  constructor(private snackBar: MatSnackBar) {
  }

  showErrorMessage(message) {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }

  showCrudErrorMessage(details) {
    this.showErrorMessage(`Unable to complete the action, details: ${details}`);
  }

  showCrudCompleted() {
    this.snackBar.open(`Action completed successfully`, '', {
      duration: 2000
    });
  }

  showMessage(message) {
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
}
