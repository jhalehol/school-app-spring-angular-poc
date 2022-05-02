import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {ConfirmAction} from '../../entities/confirm-action';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.css']
})
export class ConfirmActionComponent implements OnInit {

  question: string;
  entity: any;

  constructor(private dialogRef: MatDialogRef<ConfirmActionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data && this.data.question) {
      this.question = this.data.question;
      this.entity = this.data.entity;
    } else {
      this.closeDialog();
    }
  }

  closeDialog(confirm?: boolean) {
    const confirmAction: ConfirmAction = new ConfirmAction();
    confirmAction.confirm = confirm;
    confirmAction.entity = this.entity;
    this.dialogRef.close(confirmAction);
  }
}
