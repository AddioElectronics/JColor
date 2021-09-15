$(document).ready(function(){
    
    //Get Color Method 1
    var color1 = ColorInput.GetColor('#testColor');    
    
    //Get Color Method 2
    var color2 = $('#testColor').attr('value');
    
    //Set Color Method 1
    ColorInput.SetColor('#testColor', 'red');
    
    //Set Color Method 2
     var c = new Color('rgb(0, 200, 0)');
    ColorInput.SetColor('#testColor', c);
    
    
    //Get Color with Events
    $('#testColor').on('change', function(event, color){
        $('#example_heading').css('color', color);
    });
});