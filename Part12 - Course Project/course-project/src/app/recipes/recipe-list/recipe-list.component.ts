import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
      new Recipe("A Test Recipe", "Just a test", "https://placedog.net/500/280")
  ];

  constructor() {}

  ngOnInit(): void {}
}
