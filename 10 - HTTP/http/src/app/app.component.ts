import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject, Subscription, throwError } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
    // private postUrl = 'http://localhost:3000/posts';
    loadedPosts: Post[] = [];
    isFetching = false;
    error: string | undefined;
    errorSubscription: Subscription;

    // constructor(private http: HttpClient) { }
    constructor(private postService: PostService) {
        this.errorSubscription = this.postService.error.subscribe(error => (this.error = error));
    }

    ngOnInit() {
        this.fetchAllPosts();
    }

    onCreatePost(postData: { title: string; content: string }) {
        // Send Http request
        console.log(postData);
        this.postService.createAndStorePost(postData.title, postData.content);
        // this.http.post<Post>(this.postUrl, postData).subscribe(responseData => {
        //     console.log(responseData);
        // });
    }

    onFetchPosts() {
        // Send Http request
        this.fetchAllPosts();
    }

    onClearPosts() {
        // Send Http request
        while (this.loadedPosts.length) {
            let cur = this.loadedPosts.pop();
            if (cur && cur.id) {
                this.postService.deletePost(cur.id).subscribe(() => {
                    console.log('Deleted post: ' + cur?.id);
                });
            }
        }
    }

    fetchAllPosts() {
        this.isFetching = true;
        // this.http
        //     .get<Post[]>(this.postUrl)
        //     .pipe(
        //         map((data: Post[]): Post[] => {
        //             console.log(data);
        //             // do some operations here..
        //             return data;
        //         }),
        //     )
        //     .subscribe((responseData: Post[]) => {
        //         // console.log(responseData);
        //         this.isFetching = false;
        //         this.loadedPosts = responseData;
        //     });
        this.postService.fetchPosts().subscribe(
            (responseData: Post[]) => {
                // console.log(responseData);
                this.isFetching = false;
                this.loadedPosts = responseData;
            },
            error => {
                this.isFetching = false;
                this.error = error.message;
            },
        );
    }

    onHandleError() {
        this.error = undefined;
    }

    ngOnDestroy(): void {
        this.errorSubscription.unsubscribe();
    }
}
