import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
    id: number | undefined;
    editMode: boolean = false;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.editMode = params['id'] != null;
            if (this.editMode) {
                this.id = +params['id'];
            }
        });
        // since it is an angular observer the unsuscribe can be omitted
    }
}
