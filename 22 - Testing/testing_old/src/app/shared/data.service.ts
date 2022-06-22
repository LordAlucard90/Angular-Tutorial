export class DataService {
  data = 'Data';
  getDetails(){
    const resultPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.data);
      }, 1500);
    });
    return resultPromise;
  }
}
