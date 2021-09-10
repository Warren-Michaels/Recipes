import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!'

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
}
  
  toggleWindow(){
       this._overlay.classList.toggle('hidden');
       this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow(){
      this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
  }

  _addHandlerCloseWindow(){
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
}

  _addHandlerUpload(handler){
      this._parentElement.addEventListener('submit', function (e){
          e.preventDefault();
          const dataArr = [...new FormData(this)]; // gives an array of all add recipe form data
          const data = Object.fromEntries(dataArr) // takes array and converts it to objects
          handler(data);
        })
  }

  _generateMarkup() {
   
  }
}

export default new AddRecipeView();
