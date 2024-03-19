import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, Subscription, tap, throwError } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
    private postUrl = 'http://localhost:3000/posts';
    // private postUrl = 'http://localhost:3000/posts-invalid';
    constructor(private http: HttpClient) {}
    error = new Subject<string>();

    createAndStorePost(title: string, content: string) {
        const postData = { title, content };
        this.http
            .post<Post>(this.postUrl, postData, {
                observe: 'response',
            })
      .subscribe({
          next: responseData => {
              console.log(responseData);
              console.log(responseData.body);
              console.log(responseData.headers);
              console.log(responseData.status);
          },
          error: err => {
              this.error.next(err.message);
          },
      })
    }

    fetchPosts() {
        let params = new HttpParams();
        params = params.append('custom-parameter', true);
        params = params.append('limit', 5);
        return this.http
            .get<Post[]>(this.postUrl, {
                headers: new HttpHeaders({
                    'Custom-header': 'hello',
                }),
                // params: new HttpParams().set('custom-parameter', true),
                params: params,
            })
            .pipe(
                map((data: Post[]): Post[] => {
                    console.log(data);
                    // do some operations here..
                    return data;
                }),
                catchError(error => {
                    console.error(error);
                    // return [];
                    return throwError(error)
                }),
            );
    }

    deletePost(id: number) {
        return this.http
            .delete(`${this.postUrl}/${id}`, {
                observe: 'events',
                responseType: 'json'
            })
            .pipe(
                tap(event => {
                    console.log(event);
                    if (event.type === HttpEventType.Response) {
                        console.log(event.body);
                    }
                }),
            );
    }
}
