export default function loadImages(list, callback){
  var total = 0, images = {};   //private :)
  for(var i = 0; i < list.length; i++){
      var img = new Image();
      images[list[i].name] = img;
      img.onload = function(){
          total++;
          if(total == list.length){
              callback && callback();
          }
      };
      img.src = list[i].url;
  }
  this.get = function(name){
      return images[name] || (function(){throw "Not exist"})();
  };
}

//Create an ImageCollection to load and store my images
