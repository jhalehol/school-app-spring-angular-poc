export class Credentials {

  username: string;
  token: string;

  credentialsAreValid() {
    return this.username !== '' && this.username !== undefined && this.username !== null &&
      this.token !== '' && this.token !== undefined && this.token !== null;
  }
}
