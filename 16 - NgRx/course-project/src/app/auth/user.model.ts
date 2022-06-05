export class User {
    constructor(
        public id: number,
        public email: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) {}

    get token(): string | undefined {
        if (!this._token || !this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return undefined;
        }
        return this._token;
    }
}
