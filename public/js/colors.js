const colorThief = new ColorThief();
const img = document.querySelector('img');


var rgbToHex = function (rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  };

  var fullColorHex = function(r,g,b) {   
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
  };

 
// Make sure image is finished loading
if (img.complete) {
   getImageColor();
} else {
  image.addEventListener('load', function() {
    getImageColor();
  });
}

function getImageColor()
{
  color =  colorThief.getColor(img); 
  document.body.querySelector('#html5colorpicker').value = "#" +  fullColorHex(color[0],color[1],color[2])
}
