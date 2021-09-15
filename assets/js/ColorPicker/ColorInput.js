/* Warning:
If you do not create them with an ID, an ID will be created using its index in ColorInput.objects.
In the event other elements were deleted, they may share the same index.
Also nothing is handling the deletion of the ColorInput object, when an element is deleted.
*/


class ColorInput{
    
    constructor(element){
        
        this.element = element;                                 //The root element, holds the value
        
        //Set the index in the element so we know where it is in the array
        //elem.attr('index', ColorInput.objects.length);
        
        //Get default color, first check "value" attribute, then box-shadow, and finally background color.
        //(This is a quick placeholder)
        var cvalue = element.attr('value');
        if(Color.IsColor(cvalue)){
            this.defaultColor = cvalue;
            this.element.css('box-shadow', '0px 0px 0px 50px inset ' + cvalue);
        }else{
            cvalue = element.css('box-shadow').replace(/^.*(rgba?\([^)]+\)).*$/,'$1');
            if(Color.IsColor(cvalue))
                this.defaultColor = cvalue;
            else
                this.defaultColor = element.css('background-color');    
        }
        
        var id = element.attr('id');
        if(id !== null){        
            this.id = element.attr('id');
        }else{
            this.id = 'ColorInput_' + ColorInput.objects.length
            element.attr('id', this.id);
        }
        //this.preview = element.children(":first-child");    //The preview element, displays the color  
        
        this.Setup();   //Setup this ColorInput object
    }
    
    get Color(){
        return this.element.attr('value');
    }
    
    set Color(color){
        this.element.attr('value', color);
        //this.preview.css('background-color', color);
        //this.preview.css('box-shadow', color + '' + ColorPicker.boxshadow_overlay + ';');
        this.element.css('background-color', color);
        this.element.css('box-shadow', ColorPicker.Object.boxshadow_overlay + ' ' + color);
        this.element.trigger('change', color);
        //this.preview.css('background-color', color);
    }
    
    
    
    static CreateElement(color, parent, position){
        var element = jQuery.insertAtPosition(ColorInput.html, parent, position);        
        var ci = ColorInput(element);
        ci.Color = color;
        console.log("Need to make sure the color is passed with the correct format !!!");
        return ci;
    }
    

    //Will setup all Color elements that were always on the DOM
    static Setup(){
        
        //We will store each of these in an array so we can use
        //prototype functions.
        $('color').each(function(){
            
            var elem = $(this);
            
            //Create a new ColorInput and set the constructor values
            var ci = new ColorInput($(this));
            
            //Add it to the array, we do this after we get the index because
            //0 is actually 1
            //ColorInput.objects.push(ci);
        });
    }
    
    /*
    Sets the value of a <color> element. (Or any element really)
    a       : can be an ID, or a Jquery Element.
    color   : can be Html string, or Color object.
    */
    static SetColor(a, color){
        
        var element;
        
        if(typeof a == 'string'){
            element = ColorInput.GetInputByID(a);
        }else if(a instanceof jQuery){
            element = a;
        }
        
        if(color instanceof Color){
            var c = color.ToHTML();
            $(a).attr('value', c);
            $(a).css('box-shadow', '0px 0px 0px 50px inset ' + c);
        }else{
            $(a).attr('value', color);
            $(a).css('box-shadow', '0px 0px 0px 50px inset ' + color);
        }
        
        
    }
    
     /*
     Gets the value of a <color> element. (Or any element really)
     a       : can be an ID, or a Jquery Element.
     html    : If true, or not passed, function returns the color as an Html string.
               If false, a Color object will be returned.
     */
    static GetColor(a, html){
        
        var element;
        
        if(typeof a == 'string'){
            element = ColorInput.GetInputByID(a);
        }else if(a instanceof jQuery){
            element = a;
        }
        
        var color = $(a).attr('value');
        
        if(arguments.length == 1 || html == true){
            return color;
        }else{
            return new Color(color);
        }
    }
    
    //Gets the ColorInput by its ID
    static GetInputByID(id){
        
        for(var i = 0; i < ColorInput.objects.length; i++){
            if(ColorInput.objects[i].id == id)
                return ColorInput.objects[i];
        }
        return -1;
    }

}

ColorInput.html = '<color><div class="preview"></div></color>';
ColorInput.objects = [];

//Use "set Color(color)" instead
// ColorInput.prototype.SetColor = function(color){
    

//     this.element.attr('value', color);
//     //this.preview.css('background-color', color);
//     //this.preview.css('box-shadow', color + '' + ColorPicker.boxshadow_overlay + ';');
//     this.element.css('background-color', color);
//     this.element.css('box-shadow', ColorPicker.Object.boxshadow_overlay + ' ' + color);
//     this.element.trigger('change', color);
// }

ColorInput.prototype.RevertToDefault = function(){

    this.element.attr('value', this.defaultColor);
    this.element.css('background-color', this.defaultColor);
    this.element.css('box-shadow', ColorPicker.Object.boxshadow_overlay + ' ' + this.defaultColor);
    this.element.trigger('change', this.defaultColor);
    //this.preview.removeAttr('style');
}

ColorInput.prototype.Setup = function(){
    
    var input = this;
    
    this.element.on('click', function(){
        
        var color = $(this).attr('value');
        
        //Open the color picker, we pass the object, the type, the current color, as well as the function that will set the color
        ColorPicker.OpenColorPicker(input, 'colorinput', color);
            
    });
    
    ColorInput.objects.push(this);
}

 ColorInput.prototype.AddEvent = function(change){
     this.delegate = delegate;
 } 



$(document).ready(function(){
    
    //First we need to change the tag to our custom one
    $('div.input-color').replaceTag('<color>', true);
    
    //Now we will setup the event handlers to open the color picker
    ColorInput.Setup();
});