# JColor
## A custom HTML5 colour picker
JColor is a custom HTML5 colour picker that features custom palettes with importing and exporting, and creating colors from RGB or HSL. 
Uses Jquery and Bootstrap.

![](https://github.com/AddioElectronics/JColor/blob/main/images/colorpicker_colorwall.png?raw=true)
![](https://github.com/AddioElectronics/JColor/blob/main/images/colorpicker_builtinpalettes.png?raw=true)
![](https://github.com/AddioElectronics/JColor/blob/main/images/colorpicker_custompalettes.png?raw=true)
![](https://github.com/AddioElectronics/JColor/blob/main/images/colorpicker_advanctedtab.png?raw=true)

## Features

+ Colour wall
+ Palettes
    + Built in palettes
    + Custom Palettes 
    + Importing/Exporting
    + All used Colors stored in the "Current" palette
    + "Session" stores favourites for the session only.
    + Linking with Database ***1**
+ RGB or HEX Html
+ RGB or HSL Controls
+ Themes (Sort of, with CSS... Only partially implemented)

***1** `Not implemented at this time`

## Required References

JColor uses 2 open source projects that are required.

- [Twitter Bootstrap] - Can be removed with little effort. Only a few elements use this.
- [Jquery] - All code is written with Jquery, a complete rewrite would need to be done to remove it.

## Installation

You can follow the instructions below, or open "index.html" and "assets/js/Example.js" to see an example.


#### Style Sheets

Link these style sheets in the head.

``` html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Changa">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css">
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="stylesheet" href="assets/css/ColorPicker/color-input.css">
<link rel="stylesheet" href="assets/css/ColorPicker/color-picker_scrollbar.css">
<link rel="stylesheet" href="assets/css/ColorPicker/color-picker.css">
<link rel="stylesheet" href="assets/css/slider/SliderInput.css">
<link rel="stylesheet" href="assets/css/element-helpers.css">
```

#### Scripts

Reference these scripts.
Not all are needed, but I do not have the time to figure out what ones are.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/Extensions/jquery.js"></script>
<script src="assets/js/Extensions/array.js"></script>
<script src="assets/js/Extensions/Color.js"></script>
<script src="assets/js/Extensions/Map.js"></script>
<script src="assets/js/Extensions/MathE.js"></script>
<script src="assets/js/Extensions/Number.js"></script>
<script src="assets/js/Extensions/set.js"></script>
<script src="assets/js/Extensions/Object.js"></script>
<script src="assets/js/Extensions/Position.js"></script>
<script src="assets/js/delegates/EventWindowResize.js"></script>
<script src="assets/js/delegates/EventKeyUp.js"></script>
<script src="assets/js/delegates/EventKeyDown.js"></script>
<script src="assets/js/delegates/EventKeyPress.js"></script>
<script src="assets/js/delegates/EventMouseClick.js"></script>
<script src="assets/js/delegates/EventReady.js"></script>
<script src="assets/js/delegates/EventMouseDoubleClick.js"></script>
<script src="assets/js/delegates/EventMouseDown.js"></script>
<script src="assets/js/delegates/EventMouseMove.js"></script>
<script src="assets/js/delegates/EventMouseUp.js"></script>
<script src="assets/js/slider/SliderInput.js"></script>
<script src="assets/js/ColorPicker/ColorData.js"></script>
<script src="assets/js/ColorPicker/ColorInput.js"></script>
<script src="assets/js/ColorPicker/ColorPicker.js"></script>
<script src="assets/js/Example.js"></script>
```

Note: The items below should be referenced after the "/Extensions/" and "/Delegates/"

- slider/SliderInput.js       (Must be above ColorPicker/...)
- ColorPicker/ColorInput.js   (Must be above ColorPicker.js)
- ColorPicker/ColorPicker.js

#### Using the Color element

##### HTML

``` html
<!-- The original project supported themes. The ColorPicker only had the dark theme finished.
So if you don't add theme="dark" to either the body or html, it will not display properly.
Read more in "Pitfalls"-->
<html theme="dark">
<!-- or -->
<body theme="dark">
<!-- Insert a color element, preferably with an ID. -->
<color id="color1"></color>
...
```

##### Javascript (Jquery)
How to retrieve the value from &lt;color&gt;, with an event.
``` javascript
//Simply attach an event listener to the "color" element.
//When the "modal" closes, the "change" event will be triggered.
$('#color1').on('change', function(event, color){
    $('#example_heading').css('color', color);
});
```
How to retrieve the value from &lt;color&gt;, at any time.
``` javascript
//Can pass ID of "color"
var color =  ColorInput.GetColor('#color1');    

//Or the element as a jquery object
var element = $('#color1');
var color = ColorInput.GetColor(element);    
```
How to programmatically set a &lt;color&gt;'s value
``` javascript
//Can pass ID of "color"
ColorInput.SetColor('#color1');    

//Or the element as a jquery object
var element = $('#color1');
ColorInput.SetColor(element);  

//Which is equal to...

$('#color1').attr('value');
$('#color1').css('box-shadow', '0px 0px 0px 50px inset ' + color);
//The reason box-shadow is used, is because the background-image is a transparency grid,
//and this is the only way the preview will show the correct color.
```

#### Using the Slider element

##### Do not use the slider. To get it into a working state quickly I just had to butcher the code. It's only stable to use in the ColorWindow.


## Pitfalls

- Code is incredibly messy.
- Dynamically creating and deleting &lt;color&gt; elements
Deleting the element will not delete the "ColorInput" JS object.
Creating without an ID, will give it an ID based on the length of "ColorInput.objects."
This is code I never got around to. For static websites you should have no problems.
- Not a lot of error/type checking. Most functions will expect the correct data and types.
- Themes... The &lt;html&gt; or &lt;body&gt; element requires 'theme="dark"'.
The original Website/Article builder project supported themes but the ColorPicker only worked with the dark theme.
So if you don't add theme="dark" to either the body or html, it will not display the correct styling.
It is an easy fix, just remove all the [theme=dark] from the style sheets, or create a new theme.
- There are many problems with the &lt;slider&gt;, in the current state it should not be used outside of the ColorWindow.




## Notes

#### CSS Duplicates
You may notice in the css files, a lot of styling has something like the example below.
```
color, .input-color{
    "styling...."
}
```
This project was created in BootstrapStudio, which does not allow previewing Custom Code.
To be able to preview in the editor, a "color" element is replaced with a &lt;div class=".input=color"&gt;.
On the page load Javascript then turns it into a "color" element.
This is why you will see a bunch of seemingly unnecessary css.


#### Please Note
> This is an old project from years ago that I never got to finish, 
> which also happens to be some of the first Javascript I've ever written.
> It was apart of a larger Website/Article Builder I was working on for a website, and this had to be seperated from that.
> I only spent the last 2 days disintegrating it from that project, and then patching it back together.
> Because of those reasons, the code is ~~very messy and disorganized~~ butchered.
> I attempted to make things (mostly the &lt;slider&gt;) stable outside of the &lt;colorwindow&gt;, 
> but ultimately just butchered the code while trying to quickly add/finish/fix the functionality I had originally planned.

> I was contemplating releasing this in its current state, but the end result looks good, it works fine for static designs,
> and as long as you ignore the appearance of the code its not bad, so here it is.

> This will not see updates for a long time, so if you are going to use this hoping it will be cleaned up,
> do not count on it.
> I do plan to rewrite a lot of the code, but I do not have the time.

## License

No specific license at the moment.
Will always be free for personal and commercial use.


