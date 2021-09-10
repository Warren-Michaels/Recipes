import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await
import { initial } from 'lodash';

// if (model.hot) {
//   model.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id)

    if (!id) return; // guard clause
    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    //1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks)
    //2) loading recipe
    await model.loadRecipe(id); // rememnber that async function returns promise

    //3) rendering recipe
    recipeView.render(model.state.recipe); // ️
    

   
  } catch (err) {
    recipeView.renderError();
    console.error(err)
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // console.log(resultsView);

    // 1) get search query
    const query = searchView.getQuery();
    if (!query) return; // guard clause
    //2) load search results
    await model.loadSearchResults(query);
    //3) render results
    //  console.log(model.state.search.results)
    // resultsView.render(model.state.search.results);                // returnas all sesarch results
    resultsView.render(model.getSearchResultsPage(1));

    //4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage){
 //1) render new results
    //  console.log(model.state.search.results)
    // resultsView.render(model.state.search.results);                // returnas all sesarch results
    resultsView.render(model.getSearchResultsPage(goToPage));

    //2) render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  // Update the recipe servings
  model.updateServings(newServings)
  
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  
};

const controlAddBookmark = function(){
  // add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe)

  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    // show spinner
    addRecipeView.renderSpinner();

    // upload new recipe
   await model.uploadRecipe(newRecipe)
   console.log(model.state.recipe)

   //render recipe
   recipeView.render(model.state.recipe);

   // form success message
   addRecipeView.renderMessage();

   //render bookmark view
   bookmarksView.render(model.state.bookmarks);

   // change url id
   window.history.pushState(null, '', `#${model.state.recipe.id}`);

  //  window.history.back()    /// how you return to last page

   //close form window
   setTimeout(function(){
    addRecipeView.toggleWindow()}, MODAL_CLOSE_SEC * 1000);
  } catch(err){
    console.error("⚡",err, "⚡️" )
    addRecipeView.renderError(err.message);
  }
  // console.log(newRecipe) 
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  // controlServings();
};
init();
git 