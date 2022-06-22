export class DataService {
    data = 'Data';
    getDetails(): Promise<string> {
        const resultPromise = new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve(this.data);
            }, 1500);
        });
        return resultPromise;
    }
}
