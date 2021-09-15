/* How to use

Attach an event using ".on" on the root element of the slider.

Events
change = triggered after the value has been changed.
changing = triggered every frame the slider is moved

Example:
 $('#slider1').on('change', function(event, value){        
        alert(value);
  });


Note:
Change to class.

*/



//All sliders on the page stored as an object.
//Contains all range and position data,
//as well as the DOM elements for each item.
var sliders = [];

//The slider we are currently moving
var $movingSlider = null;


// //the definition of a Slider Object
// function Slider(root, value, minV, maxV, /*bar, handle, input, */ type, units, step){
//     this.element = root;                                //The root element
//     this.id = this.element.attr('id');                  //The root ID
//     this.value = value;                                 //The currently stored value
//     this.minValue = minV;                               //The minimum value
//     this.maxValue = maxV;                               //The maximum value  
    
//     this.bar = root.find('.sbar, sbar'),                //The bar element
//     this.handle = root.find('.shandle, shandle'),       //The handle element
//     this.input = root.find('input.slider-output'),      //The input element
        
//     this.type = type;                                   //The type of the value
//     this.usingInput = this.input.length;                //Are we using the input, or just the slider?
//     this.units = units;                                 //The type of units the value is
//     this.step = step;                                   //The value step (0.1, 1, 10, etc...)
                        
//     this.isMoving = false;                              //Is the handle being moved?
//     this.leftPos = 0;                                   //The left bounds?
//     this.rightPos = 0;                                  //The right bounds?
    
// }

//the definition of a Slider Object
function Slider(root, value, minV, maxV, /*bar, handle, input, */ type, units, step){
    this.element = root;                                //The root element
    this.id = this.element.attr('id');                  //The root ID
    
    
    if(arguments.length > 1 && !isNaN(value))           //The currently stored value
        this.value = value;                                 
    else
        this.value = 0;
    
    if(arguments.length > 2 && !isNaN(minV))
        this.minValue = minV;                           //The minimum value
    else
        this.minValue = 0;
    
    if(arguments.length > 3 && !isNaN(maxV))
        this.maxValue = maxV;                           //The maximum value  
    else
        this.maxValue = 100;
    
    this.bar = root.find('.sbar, sbar');                //The bar element
    this.handle = root.find('.shandle, shandle');       //The handle element
    this.input = root.find('input.slider-output');      //The input element
    
    if(this.bar.length == 0){
        this.element.append('<sbar>');
        this.bar = this.element.find('.sbar, sbar');
    }
    
    if(this.handle.length == 0){
        this.bar.append('<shandle>');
        this.handle = root.find('.shandle, shandle');
    }
        
    if(arguments.length > 4 && type !== undefined)
        this.type = type;                               //The type of the value
    else
        this.type = 'int';
    
    this.usingInput = this.input.length == 1;           //Are we using the input, or just the slider?
    
    if(arguments.length > 5 && units !== undefined)
        this.units = units;                             //The type of units the value is

    
    if(arguments.length > 6 && step !== undefined)
        this.step = step;                               //The value step (0.1, 1, 10, etc...)
    else{
        
        switch(this.type){
            case 'font-size':
            case 'int':     this.step = 1;      break;
            case 'float':   this.step = 0.01;   break;
        }
        
    }
                        
    this.isMoving = false;                              //Is the handle being moved?
    this.leftPos = 0;                                   //The left bounds?
    this.rightPos = 0;                                  //The right bounds?
    
    
    this.element.attr('value', this.value),             //The current value  
    this.element.attr('minvalue', this.minValue),       //The Low Number
    this.element.attr('maxvalue', this.maxValue),       //The High Number                
    this.element.attr('type', this.type),               //The type of slider, font-size, int, float
    this.element.attr('units', this.units),             //The measurement unit that will be displayed, or default if using variable.
    this.element.attr('steps', this.steps)              //The custom step for the values
    
}

//Change the tags of the sliders, then setup the objects
//The reason we have to switch the tags later is because
//bootstrap studio does not render custom tags properly.
$(document).ready(function(){    
    $('div.sliderInput').replaceTag('<slider>', true);
    $('div.sbar').replaceTag('<sbar>', true);
    $('div.shandle').replaceTag('<shandle>', true);
    
    //For some reason after replacing tags there is an unchanged duplicate
    //hanlde that is a child of the new hanlde with the replaced tag.
    //Untill the bug is fixed removing it will do.
    $('div.shandle').remove();
    
    //Remove the old classes.
    $('slider').removeClass('sliderInput');
    $('sbar').removeClass('sbar');
    $('shandle').removeClass('shandle');
    
    SetupSliderObjects();
    CreateSliderMouseEvents();
});


Slider.prototype.Setup = function(){
    
      //If the slider is using the input then we need to set the type
        if(this.usingInput){
            this.input.show();
            this.input.val(this.value);
            
            //Make sure the input cannot go higher then the slider
            this.input.attr('minlength', this.minValue);
            this.input.attr('maxlength', this.maxValue);

            switch(this.type){
                case "font-size":
                    //Make sure the input is type text so we can use letters
                    $(this.input).attr('type', 'text');
                    if(this.input.val().indexOf('pt') == -1 && this.input.val().indexOf('px') == -1){
                        this.input.val(this.value + "pt");
                    }
                    break;
                case "measurement":     
                    //Make sure the input is type text so we can use letters
                    $(this.input).attr('type', 'text');
                    if(this.units != null){
                        this.input.val(this.value + this.units);
                    }else{
                        this.input.val(this.value);
                    }
                    break;
                case "variable":
                    //Make sure the input is type text so we can use letters
                    $(this.input).attr('type', 'text');                    
                    
                    //Get the unit from the value
                    var customUnit = this.input.val().replace(/[0-9]/g, '').replace('.', '');
                    
                    //If the custom unit is empty then we will use default unit
                    if(customUnit == ''){                    
                        if(sthis.units != null){
                            this.input.val(this.value + this.units);
                        }else{
                            this.input.val(this.value);
                        }
                    }else{
                        
                        //Unit has been set, it may be the same as the default,
                        //but it also could be something different like a percent sign
                        this.input.val(this.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') + customUnit);
                    }
                    
                    break;
                case "int":
                    $(this.input).attr('type', 'number');
                    //$(this.input).attr('steps', 1);
                    break;
                case "float":
                    $(this.input).attr('type', 'number');
                    break;
            }

            //if we change the input box then we will want to update the handle position
            $(this.input).change(function(){
                this.SetValue(this.input.val());
                //this.CalculateHandlePosition(this.input.val());
            });
        }else{
            this.input.hide();
        }
        
        this.CalculateHandlePosition(this.input.val());
}


//Find each slider and create an object,
//along with all the data needed.
function SetupSliderObjects(){
    $.each($('slider'), function(index, value){

        //If the slider does not have an ID we will create one
        //Warning, does not check if other elements have the same ID
        if($(value).attr('id') == "" || $(value).attr('id') == null){
            $(value).attr('id', "InputSlider" + sliders.length.pad());
        }

        sliders.push(new Slider(
            $(value),                               //The root element  
            Number($(value).attr('value')),         //The current value  
            Number($(value).attr('minValue')),      //The Low Number
            Number($(value).attr('maxValue')),      //The High Number                
            // $(value).find('.sbar, sbar'),           //The bar element
            // $(value).find('.shandle, shandle'),     //The handle element
            // $(value).find('input.slider-output'),   //The input element
            $(value).attr('type'),                  //The type of slider, font-size, int, float
            // $(value).attr('useInput') != null,      //Are we using the input element?
            $(value).attr('units'),                //The measurement unit that will be displayed, or default if using variable.
            $(value).attr('steps')                 //The custom step for the values
        ));
        
        sliders[index].Setup();

    });
}


//Moves the handle when the user clicks and holds
function CreateSliderMouseEvents(){
    
    //When the mouse is held down we will drag it
    $('.shandle, shandle').mousedown(function(){

        //If we are already moving the handle there is no need
        //run the code again.
        if($.movingSlider != null) return;

        //Gets the slider object from the handle which was clicked
        $.movingSlider = GetSlider($(this).closest('.sliderInput, slider'));  

        //Recalculate the position of the bar incase the screen was resized
        //or has moved some how.
        $.movingSlider.GetPositionData();

        //Add the functions to the MouseMove/Up delegates
        EventMouseMove.add(MouseMoveSliderHandle);
        EventMouseUp.add(StopMovingSliderHandle);      
    }); 
    
    //When the bar is clicked we will move the handle into position
    $('.sbar, sbar').on('click', function(){
        
        $.movingSlider = GetSlider($(this).closest('.sliderInput, slider')); 
        
        //Recalculate the position of the bar incase the screen was resized
        //or has moved some how.
        $.movingSlider.GetPositionData();
        
        //Move the slider handle into position
        //and set the slider to null, because
        //we only needed to move it once
        MouseMoveSliderHandle();
        $.movingSlider = null;
        
    });
}

//Moves the handle's X position to where the cursor is
function MouseMoveSliderHandle(){
    
    //Makes sure the handle does not leave the bounds of the bar
    $.movingSlider.handle.css({left: (MathE.Clamp(mouseX, $.movingSlider.leftPos, $.movingSlider.rightPos)) - $.movingSlider.bar.offset().left - ($.movingSlider.handle.width() / 2) });
    $.movingSlider.CalculateSliderValue();
}

//Stop moving the slider handle.
//This is called from the MouseUp delegate.
function StopMovingSliderHandle(){
    
    //Remove the functions from the delegates
    //and set the moving slider to null.
    EventMouseMove.delete(MouseMoveSliderHandle);
    EventMouseUp.delete(StopMovingSliderHandle);  
    $.movingSlider.element.trigger('changing', $.movingSlider.value);
    $.movingSlider.element.trigger('change', $.movingSlider.value);
    $.movingSlider = null;    
}

//Gets the Slider object from the root element's ID
function GetSlider(sliderDom){    
    for(var i = 0; i < sliders.length; i++){
        if(sliders[i].id == sliderDom.attr('id')){
           
            return sliders[i];
            break;
        }
    }
}


//Updates all slider min/max value, type/units,
//as well as the other properties
function UpdateAllSliderProperties(){
    $.each($('slider'), function(index, value){
        UpdateSliderProperties(value);
    });
}

//Updates the slider min/max value, type/units,
//as well as the other properties
function UpdateSliderProperties(sliderDOM){
    
    //Get the object from the array of sliders
    //And then reference the DOM object as a jquery object
    var sliderObj = GetSlider(sliderDOM);
    var $slider = $(sliderDOM);
    
    
    //Set all the properties to their new value
    sliderObj.minValue = Number($slider.attr('minvalue'));
    sliderObj.maxValue = Number($slider.attr('maxvalue'));
    sliderObj.value = $slider.attr('value');
    sliderObj.type = $slider.attr('type');
    sliderObj.units = $slider.attr('units');
    sliderObj.step = Number($slider.attr('steps'));
    
    sliderObj.usingInput = $slider.attr('useinput');
    
    if(sliderObj.usingInput){
        
        //Make sure the input is visible if we are using the input
        $slider.find('input').show();
        
        //Remove the step attribute, if its still a type int
        //it will be set again.
        $(sliderObj.input).removeAttr('steps');
        
        //Make sure the input cannot go higher then the slider
        sliderObj.input.attr('minlength', sliderObj.minValue);
        sliderObj.input.attr('maxlength', sliderObj.maxValue);
        
         switch(sliderObj.type){
                case "font-size":
                 //Make sure the input is type text so we can use letters
                    $($slider).attr('type', 'text');
                    if(sliderObj.input.val().indexOf('pt') == -1 && sliderObj.input.val().indexOf('px') == -1){
                        sliderObj.input.val(sliders[index].value + "pt");
                    }
                    break;
                case "measurement":
                 //Make sure the input is type text so we can use letters
                    $(sliderObj.input).attr('type', 'text');
                    if(sliderObj.units != null){
                        sliderObj.input.val(sliderObj.value + sliderObj.units);
                    }else{
                        sliderObj.input.val(sliderObj.value);
                    }
                    break;
                case "variable":
                    //Make sure the input is type text so we can use letters
                    $(sliders[index].input).attr('type', 'text');                    
                    
                    //Get the unit from the value
                    var customUnit = sliders[index].input.val().replace(/[0-9]/g, '').replace('.', '');
                    
                    //If the custom unit is empty then we will use default unit
                    if(customUnit == ''){                    
                        if(sliders[index].units != null){
                            sliders[index].input.val(sliders[index].value + sliders[index].units);
                        }else{
                            sliders[index].input.val(sliders[index].value);
                        }
                    }else{
                        
                        //Unit has been set, it may be the same as the default,
                        //but it also could be something different like a percent sign
                        sliders[index].input.val(sliders[index].value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') + customUnit);
                    }
                    
                    break;
                case "int":
                    $(sliderObj.input).attr('type', 'number');
                    
                    if(solderObj.step < 1)
                        $(sliderObj.input).attr('steps', 1);
                    break;
                case "float":
                    $(sliderObj.input).attr('type', 'number');
                    break;
            }
        
        //If a custom step has been set we will set that now
        if(sliderObj.step != null && sliderObj.step != ""){
            $(sliderObj.input).attr('steps', Number(sliderObj.step));
        }

        //if we change the input box then we will want to update the handle position
        $(sliderObj.input).change(function(){
            sliderObj.CalculateHandlePosition(sliderObj.input.val());
        });
        
    }else{
        //unbind the change event and then hide it
        //No point having the event if we are not using it
        $(sliderObj.input).unbind('change');
        $(sliderObj.input).hide();
    }
    
    //Recalculate the handle position with our new range.
    sliderObj.CalculateHandlePosition(sliderObj.value);

    
    //Now we need to update the input, even if we arent using an input
    //We will just run this cause its easier to do, all becuase it needs
    //to be ran after we calculate the handle position
    sliderObj.CalculateSliderValue();
    
}

//Calculates and stores the current position of the bar
//in the slider object
Slider.prototype.GetPositionData = function (){
    
    //Get the left/right position of the Bar so we can calculate the value
    var rect = this.bar.get(0).getBoundingClientRect();    
    this.leftPos = rect.left + (this.handle.width() / 2);
    this.rightPos = rect.right - (this.handle.width() / 2);

    //Another way to get the left/right position
    //this.leftPos = this.bar.offset().left;
    //this.rightPos = this.bar.offset().left + this.bar.outerWidth()
}

//Calculates the value from the position of the slider
Slider.prototype.CalculateSliderValue = function (){
     
    //If the slider is hidden this function will not calculate a valid result
    //To maintain the value stop running the code
    if($('#' + this.id).offsetParent === null) return;
    
    //Change the value of the input box relative to the handle on the bar.
    var value = MathE.Map(this.handle.offset().left + (this.handle.width() / 2), this.leftPos, this.rightPos, this.minValue, this.maxValue);
    
    //If the custom step has been set, we will round it off
    if(this.step != null && this.step != ""){
        value = value.P_Round(this.step, 0);
    }
    
    switch(this.type){
        case "font-size":            
            //We need to see if we are using pixels or points
            var units = this.input.val().indexOf('px') != -1 ? 'px' : 'pt'; 
            this.value = value + units;
            $('#' + this.id).attr('value', value + units);
            
            if(this.usingInput){
                this.input.val(value + units);
            }
            
        break;
        case "measurement":
             //We need to see if we are using pixels or points
            var units = this.units != null ? this.units : "";
            this.value = value + units; 
            $('#' + this.id).attr('value', value + units);
            
            if(this.usingInput){
                this.input.val(value + units);
            }
            break;
            
        case "variable":
            
            //Get the unit from the value
            var customUnit = this.input.val().replace(/[0-9]/g, '').replace('.', '');
            
            //We need to see if we are using pixels or points
            //If the custom unit is null we will check if default are
            var units =  customUnit != null ?  customUnit : (this.units != null ? this.units : "");
            
            
            this.value = value + units; 
            
            $('#' + this.id).attr('value', value + units);
            
            if(this.usingInput){
                this.input.val(value + units);
            }
            break;
            
        case "int":
            this.value = Math.round(value);
            $('#' + this.id).attr('value', Math.round(value));
            
            if(this.usingInput){
                this.input.val(Math.round(value));
            }
            break;
            
        default:
            this.value = value;
            $('#' + this.id).attr('value', value);
            
            if(this.usingInput){
                this.input.val(value);
            }
            break;
    }  
    

    //changed we must use this custom event
    //this.element.trigger('SliderChange', this.value);
    //this.element.trigger('change', this.value);
    this.element.trigger('changing', this.value);
}

//Calculates the position of the slider, from the value in the input box.
Slider.prototype.CalculateHandlePosition = function (value){
    
    //Don't allow the code to run if the input is not in use
    if(!this.usingInput) return;
    
    //If the value is a string we will extract the number from it
    if(typeof value == "string"){
        value = value.match(/\d+/g).map(Number);       
    }
    
    //If the value is over the max then set to max
    value = value > this.maxValue ? this.maxValue : value;
    
    //If the value is under the min then set to min
    value = value < this.minValue ? this.minValue : value;
    
    //Make sure the bar position data is correct
    this.GetPositionData();
    
    //Change the reference values to the input value
    this.value = value;    
    $('#' + this.id).attr('value', value);
    
    
    //Calculate the position from the value
    //Since we may be dealing with font sizes 
    //we will extract the number from the value
    var position =  MathE.Map(this.value, this.minValue, this.maxValue, this.leftPos, this.rightPos);
    
    //Set the handle's position
    this.handle.css({left:  (position - (this.handle.width() / 2)) - this.handle.parent().offset().left});
    
    //Trigger the SliderChange event, we can't use the regular change event
    //for the slider because there is the input as well as the bar/handle
    //which isn't a standard input. To to be able to tell when the slider has 
    //changed we must use this custom event
    this.element.trigger('changing', this.value);
    this.element.trigger('change', this.value);
}

Slider.prototype.SetValue = function(value){
    
    //If the value is over the max then set to max
    value = value > this.maxValue ? this.maxValue : value;
    
    //If the value is under the min then set to min
    value = value < this.minValue ? this.minValue : value;
    
    
    switch(this.type){
        case "font-size":            
            //We need to see if we are using pixels or points
            var units = this.input.val().indexOf('px') != -1 ? 'px' : 'pt'; 
            this.value = value + units;
            $('#' + this.id).attr('value', value + units);
            
            if(this.usingInput){
                this.input.val(value + units);
            }
            
        break;
        case "measurement":
             //We need to see if we are using pixels or points
            var units = this.units != null ? this.units : "";
            this.value = value + units; 
            $('#' + this.id).attr('value', value + units);
            
            if(this.usingInput){
                this.input.val(value + units);
            }
            break;
        case "variable":
            
            //Get the unit from the value
            var customUnit = this.input.val().replace(/[0-9]/g, '').replace('.', '');
            
            //We need to see if we are using pixels or points
            //If the custom unit is null we will check if default are
            var units =  customUnit != null ?  customUnit : (this.units != null ? this.units : "");
            

            this.value = value ;//+ units; 
            $('#' + this.id).attr('value', value);// + units);
            
            if(this.usingInput){
                this.input.val(value);// + units);
            }
            break;
            
        case "int":
            this.value = Math.round(value);
            $('#' + this.id).attr('value', Math.round(value));
            
            if(this.usingInput){
                this.input.val(Math.round(value));
            }
            break;
            
        default:
            this.value = value;
            $('#' + this.id).attr('value', value);
            
            if(this.usingInput){
                this.input.val(value);
            }
            break;
    }  
    
    //Make sure the handle matches the position of the value
    this.CalculateHandlePosition();
    
    //Return the value. The value may have been changed since calling the function
    //because of the min and max values. This allows the setter to update its value 
    //if needed.
    return value;
    
}

