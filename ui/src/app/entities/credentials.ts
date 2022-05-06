export class Credentials {

  userName: string;
  token: string;

  credentialsAreValid() {
    return this.userName !== '' && this.userName !== undefined && this.userName !== null &&
      this.token !== '' && this.token !== undefined && this.token !== null;
  }
}
