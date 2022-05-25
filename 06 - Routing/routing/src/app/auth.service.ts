// Fake Auth Service Implementation
export class AuthService {
  loggedIn = false;

  isAuthenticated() {
    const promise = new Promise<boolean>(
      (resolve, reject) => {
        setTimeout(() => {
          resolve(this.loggedIn);
        }, 800);
      }
    );
    return promise;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

}
