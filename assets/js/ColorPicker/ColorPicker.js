/* Instructions
Put a <color id="mycolor"></color> element on your page.
With Jquery add a change event to the element.

If the sliders in the gear tab do not work, you need to reference SliderInput.js before ColorPicker.js and ColorInput.js

Jquery Example:

$('#mycolor').on('change', function(event, color){
//Code to handle color change.
alert(color);
});


Note: Currently only works with custom "color" element.
There is code that started to allow something like <input type="color">,
but was never finished.
If you would like to add that, start in the "static AcceptChanges" function.
In "static OpenColorPickertype," the "type" parameter is what needs to be changed.
Then should just need a way to open the window while passing the color.
*/


//When document is ready we will replace the element tag.
//Then setup the events.
$(document).ready(function(){
    $('div.color-picker').replaceTag('<colorwindow>', true);
    ColorPicker.SetupColorPicker();  //Sets up the event handlers as well as creating the ColorPicker.Object object
    ColorPicker.SetupTabControl();   //Setup for the sub-menu tabs
});


//The class which contains all the elements and variables needed for the color picker window
//The reason it is in a class is to avoid variables from crossing
//Access this from the variable named ColorPicker.Object, do NOT create another object for it.
class ColorPicker{
    
    constructor(window, acceptButton, cancelButton, defaultButton, usingFavourites, bg, wall, pointer, hueBar, hueHandle, transBar, transHandle, valueinput, valuetype, lastColor, newColor, rHueSlider, gSatSlider, bBrightSlider, aTransSlider, aWall, aPointer, palettes, paletteSelect, palettePreview, favouriteSelect, favouriteButton, favImportInput, favExportInput, favImport, favExport, favModal, favModalInput, favModalOk, favModalCancel, favDelete, favModalDB){ //, eyedropper, eyeButton) {
        this.window = window;                       //The root element
        this.accept = acceptButton;                 //The accept button
        this.cancel = cancelButton;                 //The cancel button
        this.default = defaultButton;               //The button which reverts the color to default (Only usable for certain types, such as colorinput)
        this.usingFavourites = usingFavourites;     //Are we able to access favourites?
        this.bg = bg;                               //The frame which all elements are relative to
        this.wall = wall;                           //The color wall wall (non advanced)
        this.pointer = pointer;                     //The cursor for the color wall (non advanced)
        this.hueBar = hueBar;                       //The bar for the hue setting (non advanced)
        this.hueHandle = hueHandle;                 //The handle for the hue bar (non advanced)
        this.transBar = transBar;                   //The bar for the transparency (non advanced)
        this.transHandle = transHandle;             //The handle for the transparency (non advanced)
        this.rHueSlider = rHueSlider;               //The Red/Hue slider (advanced tab)
        this.gSatSlider = gSatSlider;               //The Green/Saturation slider (advanced tab)
        this.bBrightSlider = bBrightSlider;         //The Red/Hue slider (advanced tab)
        this.aTransSlider = aTransSlider;           //The Red/Hue slider (advanced tab)
        this.aWall = aWall;                         //The tiny color wall (advanced tab)
        this.aPointer = aPointer;                   //The tiny walls pointer (advanced tab)
        //this.eyedropper = eyedropper;               //The cursor for the eyedropper tool
        //this.eyeButton = eyeButton;                 //The button for the eyedropper tool
        this.palettes = palettes;                   //The parent to all the palettes in the favourites tab
        this.paletteSelect = paletteSelect;         //The select element which allows users to swap palettes.
        this.palettePreview = palettePreview;       //The preview circle for the color you are hovering over.
        this.favouriteSelect = favouriteSelect;     //The select element which allows users to swap palettes in the favourites sub-menu.
        this.favouriteButton = favouriteButton;     //The toggle button to add/remove favourite
        this.favImportInput = favImportInput;       //The hidden file input for importing palettes
        this.favExportInput = favExportInput;       //The hidden file input for exporting palettes
        this.favImport = favImport;                 //The button which is used for importing palettes
        this.favExport = favExport;                 //The button which is used for exporting palettes
        this.favModal = favModal;                   //This is the modal for creating a new favourite palette
        this.favModalInput = favModalInput;         //The input for the new palettes name
        this.favModalOk = favModalOk;               //The modals ok button
        this.favModalCancel = favModalCancel;       //The modals cancel button
        this.favDelete = favDelete;                 //The button to delete temporary favourite palettes. Only visible when temporary palettes are active
        this.favModalDB = favModalDB;               //The toggle for creating a palette as something thats saved to a database, or used in the session only.
        
        this.valueinput = valueinput;               //The input element for entering/reading rgb/rgba/HEX values 
        this.valuetype = valuetype;                 //The type of the value we are entering/reading rgb-a/HEX
        this.eLastColor = lastColor;                //The element which displays the un-edited color
        this.eNewColor = newColor;                  //The element which displays the post edit color
        
        this.movingPointer = null;                  //The pointer being moved by the user
        this.otherPointer = null;                   //The pointer being moved by calculations
        
        this.openTab = "main";                      //The currently open sub-menu
        
        this.mousedown = false;                     //Is the mouse being held down? (Moving the cursor on the wall)
        this.pointerBounds = null;                  //Precalculated bounds and offset for when moving the cursor
        this.aPointerBounds = null;                 //Precalculated bounds and offset for when moving the cursor
        this.sliderBounds = null;                   //Precalculated bounds and offset for moving the hue/transparency handle
        this.movingSlider = null;                   //The hue/transparency bar thats being changed
        this.movingHandle = null;                   //The hue/transparency handle thats currently being moved
        this.advancedMode = "rgb";                  //Are you edtiting the RGB or HSV values in the advanced tab?
        
        this.lastColor = new Color(0,0,0,null);     //The un-edited color
        this.newColor = new Color(0,0,0,1);         //The post edit color
        this.newHSV = new HSV(0,0,0);               //The post edit HSV values
        this.newHex = "#000000";                    //The post edit HEX value
        this.transparency = 1;                      //The post edit transparency value
        
        this.windowOffset = null;                   //The offset of the window to mouse. Used when moving the window.
        
        //this.eyeMode = "background-color";          //When using the janky eyedropper tool, what will it take its color from (auto, background-color, color, gradient, image)
        //this.eyecanvas = null;                      //The canvas used by the eyedropper tool
        //this.canvasContext = null;                  //The context for the eyedropper canvas
        //this.canvasImage = null;                    //The image that will be displayed on the canvas
        
        this.userColors = {current : [],            //The favourite colors, stored in web format (rgb, rgba, hex)
                           session : [],            //Every time you click Accept the color will be stored in the current, session are temp favourites, not stored, favourites are loaded from a database
                          favourite : []};          
        
        
        
        /*
        The type of thing whose color is being changed.
        -colorinput
        -input
        -variable
        -css_'CSS' (element)        
        */
        this.edittype = "";                  
        this.editingcolor = null;                //The reference to the color thats being changed (the variable, element, colorinput, input, etc..) Type is defined in edittype
        
        //The box shadow settings to overlay a color over the transparent background image for palettes.
        this.boxshadow_overlay = '0px 0px 0px 50px inset';
        
  }
    
    /*
    Opens the Color Picker's window and sets the color to the value being changed.
    @param editing      :   The value being changed (colorinput, input, variable, element)
    @param type         :   The type of the value (colorinput, input, variable, element)
    @param currentcolor :   The current color of the element
    //@param delegate     :   (optional) The function you want to be called on accept
    */
    static OpenColorPicker(editing, type, currentcolor){   
        
        //Set the type
        ColorPicker.Object.edittype = type;
        
        //Set the type on the element as well
        ColorPicker.Object.window.attr('type', type);
        
        //Reference the value being changed
        ColorPicker.Object.editingcolor = editing;
        
        //If the value has a color, set that to both the new and last
        if(currentcolor != null && currentcolor != ""){            
            ColorPicker.SetColor(currentcolor);
        }else{
            
            //The value's color is current null so just set it to black.
            ColorPicker.SetColor('#000000');
        }
        
        if(ColorPicker.Object.newColor.a == null || ColorPicker.Object.newColor.a == 'undefined'){
            ColorPicker.Object.newColor.a = 1;
        }
        
        //Set the last color after, we are just copying the newly set color
        //This avoids having a function to set the last color, and converting
        //it to a color twice
        ColorPicker.Object.lastColor = ColorPicker.Object.newColor;
        
        //Set the last color element
        ColorPicker.Object.eLastColor.children().css('background-color', ColorPicker.Object.lastColor.ToHTML());
        
        // if(delegate !=== null){
        //     ColorPicker.Object.window.on('close', delegate);
        // }        
        
        //Open the window
        ColorPicker.OpenWindow();
        
        //Make sure its a child to the body and not another element.
        //This will guarentee that it is positioned correctly
        $('body').append(ColorPicker.Object.window);
        
        //Set the window position to the center of the screen
        ColorPicker.Object.window.css({
            left: $(document).width() / 2,
            top: (($(window).height() - ColorPicker.Object.window.outerHeight()) / 2) + 
                                                $(window).scrollTop()
        });
    }
    
    /*
    ::AcceptChanges::
    Saves the color to the variable, value, input or what ever's color is being changed.
    */
    static AcceptChanges(){
        
        //Would like to replace ColorPicker.Object.edittype with typeof.
        //var type = typeof ColorPicker.Object.editingcolor;
        
        switch(ColorPicker.Object.edittype){
            case "colorinput":
                ColorPicker.Object.editingcolor.Color = ColorPicker.Object.newColor.ToHTML();
                //ColorPicker.Object.editingcolor.SetColor(ColorPicker.Object.newColor.ToHTML());
                ColorPicker.Object.editingcolor.element.children().removeClass('none');
                //ColorPicker.Object.editingcolor.trigger('change'); //Done in ColorInput Set Color
                break;
            // case 'input':
            //     ColorPicker.Object.editingcolor.
            //     break;
        }
        
        ColorPicker.SaveColor('current', ColorPicker.Object.newColor.ToHTML())
        // ColorPicker.Object.editingcolor = null;
        // ColorPicker.Object.edittype = null;
        
        
    }
    
    /*
    ::DefaultChanges::
    Sets the colorinput or what ever is being changed, back to its default.
    */
    static DefaultChanges(){
          
        switch(ColorPicker.Object.edittype){
            case "colorinput":
                ColorPicker.Object.editingcolor.RevertToDefault();
                ColorPicker.Object.editingcolor.element.children().removeClass('none');
                ColorPicker.Object.editingcolor.element.trigger('change');
                break;
        }
    }
    
    /*
    Sets the color and updates all UI components
    ::Multiple ways to pass a color, read params::
    @param r    : Red-3/4/5args     | H-4/5args | HTML-1args    | Color-2args   | HSV-2args | HSL-2args
    @param g    : Green-3/4/5args   | S-4/5args | r-Type(color, hsv, hsl)-2args | Opacity-3args
    @param b    : Blue-3/4/5args    | V-4/5args | L-4args       | rg-Type(hsv-Opacity, hsl-Opacity)
    @param a    : Alpha-4/5args     | rgb-Type(hsv, hsl)-4args  | Opacity 5args
    @param t    : Type(hsv-Opacity, hsl-Opacity)
    */
    static SetColor(r, g, b, a, t){
        
        var color;
        
        switch(arguments.length){
            case 1: //HTML/HEX
                //Extracts color from HTML in HEX or RGB/A format.
                color = Color.ExtractColorFromHtml(r);  
                break;
            case 2://Color/HSV/HSL            
                switch(g){
                    case 'color': color = r;            break;  //r = Color object  (in Color.js)
                    case 'hsv'  : color = r.ToColor();  break;  //r = HSV object    (in Color.js)
                    case 'hsl'  : color = r.ToColor();  break;  //r = HSL object    (in Color.js)
                }      
                break;
            case 3://RGB/HSL-Opacity/HSV-Opacity
                 switch(b){
                    //r = HSV object (in Color.js)
                    //g = opacity
                    case 'hsv'  :   color = r.ToColor();  
                                    color.a = g;
                         break;
                    //r = HSL object (in Color.js)
                    //g = opacity
                    case 'hsl'  :   color = r.ToColor();  
                                    color.a = g;
                         break;
                    //r, g, b = red green blue
                    default :
                         color = new Color(r, g, b);                     
                         break
                }   
                break;
            case 4://RGBA/HSV/HSL
                switch(a){
                    //r, g, b = hue saturation (value or brightness)
                    case "hsv":
                        var hsv = new HSV(r, g, b);
                        color = hsv.ToColor();
                        break;
                    //r, g, b = hue saturation lightness
                    case "hsl":
                        var hsl = new HSL(r, g, b);
                        color = hsl.ToColor();
                        break;
                    //r, g, b, a = red green blue alpha
                    default :
                         color = new Color(r, g, b, a);                     
                         break
                }
                break;
            case 5://HSV-Opacity/HSL-Opacity
                switch(a){
                    //r, g, b = hue saturation (value or brightness)
                    //a = opacity
                    case "hsv":
                        var hsv = new HSV(r, g, b);
                        color = hsv.ToColor();
                        color.a = a;
                        break;
                    //r, g, b = hue saturation lightness
                    //a = opacity
                    case "hsl":
                        var hsl = new HSL(r, g, b);
                        color = hsl.ToColor();
                        color.a = a;
                        break;
                }
                break;
        }
        
        //It was invalid so we will not update anything
        if(color == null) return;      
    
                    
        //Update the color values
        ColorPicker.Object.newColor = color;
        ColorPicker.Object.newHSV = ColorPicker.Object.newColor.ToHsvClass();
        ColorPicker.Object.newHex = ColorPicker.Object.newColor.ToHex();
        
        
        //Update the hue and transparency slider on the main tab
        ColorPicker.SetSliderRelativeToValue(ColorPicker.Object.newHSV.h, ColorPicker.Object.hueBar, ColorPicker.Object.hueHandle, 0, 360, ColorPicker.Object.bg);
        ColorPicker.SetSliderRelativeToValue(ColorPicker.Object.transparency, ColorPicker.Object.transBar, ColorPicker.Object.transHandle, 0, 1,  ColorPicker.Object.bg);
        
        //Update the wall cursor and background
        ColorPicker.SetCursorPositionRelativeToValue();
        
        //Update the advanced sliders
        ColorPicker.UpdateAdvancedSliders();
        
        //Set the preview color
        ColorPicker.PreviewNewColor();
    }
    
    
    //Sets up Window and elements, and creates events.
    static SetupColorPicker(){   

        
    /*
    ::::    Need to write AJAX code to retrive favourite colors saved by account ::::
        -Only for admin accounts?
        -If not only admin, set a limit for saved favourites?
    */
    
    //constructor(colorwindow, usingFavourites, wallcursor, hueBar, hueHandle, transBar, transHandle, valueinput, valuetype, lastColor, newColor) 
    
    ColorPicker.Object = new ColorPicker( 
        $('colorwindow'),
        $('#cp_accept'),
        $('#cp_cancel'),
        $('#cp_none'),
        ColorPicker.FavouritesConnectedToDatabase(), 
        $('#cp_bg'),
        $('#cp_colorwall'),
        $('#cp_cursor'),
        $('#cp_huebar'),
        $('#cp_huehandle'),
        $('#cp_transbar'),
        $('#cp_transhandle'),
        $('#cp_colorvalueinput'),
        $('#cp_colorvaluetype'),
        $('#cp_lastcolor'),
        $('#cp_newcolor'),
        $('#cp_a_redhue'),
        $('#cp_a_greensaturation'),
        $('#cp_a_bluebrightness'),
        $('#cp_a_transparency'),
        $('#cp_a_colorwall'),
        $('#cp_a_cursor'),
        $('#cp_palettes'),
        $('#cp_palette'),
        $('#cp_previewpalette'),
        $('#cp_favourites'),
        $('#cp_favourite'),
        $('#cp_favHiddenImport'),
        document.getElementById('cp_favHiddenExport'),
        $('#cp_favImport'),
        $('#cp_favExport'),
        $('#cp_favModal'),
        $('#cp_inputNewFav'),
        $('#cp_newFavOk'),
        $('#cp_newFavCancel'),
        $('#cp_deleteFav'),
        $('#cp_favModalDB')
        
        
        //$('#cp_eyedropper'),
        //$('#cp_eyedropperbtn')
    );
    
    //Bind the mouse down events
    ColorPicker.AcceptAndCancelEvents();        //Accept and cancel buttons
    ColorPicker.SetupFavouriteEvents();         //Creates events for the favourite button
    ColorPicker.SetupFavouriteImportExport();   //Setting up the import/export input and buttons
    ColorPicker.SetupModalEvents();             //Creates the events for creating a new favourite group
    ColorPicker.ColorWallMouseEvent();          //Color Wall events, handles changing the color 
    ColorPicker.SliderMouseEvents();            //Slider events for hue and transparency on the main tab
    ColorPicker.InputTextboxEvent();            //The event for manually inputing color values to the text box
    ColorPicker.AdvancedButtonEvents();         //RGB/HSV Mode Swap Buttons and tiny color wall toggle
    ColorPicker.AdvancedSliderEvents();         //The events for the advanced sliders which handle updating the color
    ColorPicker.InputOutputTypeEvent();         //The event for the input/output type selector (RGBA/HEX selector)
    //ColorPicker.EyedropperButtonEvent();        //Sets up the button to use the eyedropper tool
    ColorPicker.PopulatePalettes();             //Populates the palettes with colors
    ColorPicker.PaletteSelectEvents();          //Creats the events to swap palettes
    ColorPicker.ColorEvents();                  //Creats the events to select a color from the palette ::NOTE:: Must be done after ColorPicker.PopulatePalettes
    ColorPicker.BackgroundMoveEvent();          //Creates the events for when you have the mouse down on the background allowing the user to drag the window around
    
    //Precalculate the bounds,
    //we need to do this atleast once every time we move the cursor 
    //just incase the window has moved, or something has been resized
    ColorPicker.Object.aPointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.aWall), $(ColorPicker.Object.aPointer));
    ColorPicker.Object.pointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.wall), $(ColorPicker.Object.pointer));

}
    
    static CreateWindow(){
        if($('colorwindow').length != 0 || $('#colorpicker').length != 0 || ($('color, .input-color').length == 0 && $('body').attr('jcolor') === undefined)) return;
        
        var html = '<colorwindow id="colorpicker" class="color-picker window" menu><i class="fa fa-eyedropper" id="cp_eyedropper"></i>\
    <div id="cp_bg" class="relative-fill">\
        <div class="tabs">\
            <div class="tab active" cp-sub-menu-tab="main, shared">\
                <div class="t-overlay"></div><i class="fa fa-adjust"></i>\
            </div>\
            <div class="tab" cp-sub-menu-tab="palette, shared">\
                <div class="t-overlay"></div><i class="material-icons">palette</i>\
            </div>\
            <div class="tab" cp-sub-menu-tab="favourite, shared">\
                <div class="t-overlay"></div><i class="fa fa-heart"></i>\
            </div>\
            <div class="tab" cp-sub-menu-tab="advanced, shared">\
                <div class="t-overlay"></div><i class="fa fa-gears"></i>\
            </div>\
        </div>\
        <div class="show" cp-sub-menu="main">\
            <div id="cp_colorwall" class="color" style="background-color:#ff0000;">\
                <div class="sat">\
                    <div class="val">\
                        <div id="cp_cursor" class="color-wall-cursor"></div>\
                    </div>\
                </div>\
            </div>\
            <div id="cp_huebar" class="hue cp_cbar" minvalue="0" maxvalue="360">\
                <div class="relative-fill">\
                    <div id="cp_huehandle" class="handle smooth"></div>\
                </div>\
            </div>\
            <div id="cp_transbar" class="trans cp_cbar t-bg" minvalue="0" maxvalue="1">\
                <div class="relative-fill">\
                    <div class="bg"></div>\
                    <div id="cp_transhandle" class="handle smooth"></div>\
                </div>\
            </div>\
        </div>\
        <div cp-sub-menu="palette">\
            <div>\
                <div class="active" palette="basic">\
                    <div></div>\
                </div>\
                <div palette="w3">\
                    <div></div>\
                </div>\
                <div palette="extended">\
                    <div></div>\
                </div>\
                <div palette="simple">\
                    <div></div>\
                </div>\
            </div><select id="cp_palette">\
                <optgroup label="Choose a Palette...">\
                    <option value="basic" selected>Basic</option>\
                    <option value="extended">Extended</option>\
                    <option value="w3">W3</option>\
                </optgroup>\
            </select>\
        </div>\
        <div cp-sub-menu="favourite">\
            <div id="cp_palettes">\
                <div palette="session"></div>\
                <div class="active" palette="favourite"></div>\
                <div palette="current"></div>\
            </div>\
            <div id="cp_deleteFav"><i class="fa fa-remove"></i></div><select id="cp_favourites">\
                <optgroup label="Choose a Palette...">\
                    <option value="favourite" selected>Favourites</option>\
                    <option value="session">Session</option>\
                    <option value="current">Current</option>\
                    <option value="new">Create New</option>\
                </optgroup>\
            </select><input type="file" id="cp_favHiddenImport" class="d-none" accept=".pal" /><a id="cp_favHiddenExport" class="d-none" href="#">Link</a>\
            <div id="cp_favModal"><a id="cp_favModalDB"><i class="fa fa-save"></i></a><input type="text" id="cp_inputNewFav" placeholder="Enter a name..." /><button class="btn btn-primary" id="cp_newFavOk" type="button">Ok</button><button class="btn btn-primary" \id="cp_newFavCancel" type="button">✖<br /></button></div>\
            <div role="group" class="btn-group"><button class="btn btn-primary" id="cp_favImport" type="button">Import</button><button class="btn btn-primary" id="cp_favExport" type="button">Export</button></div>\
        </div>\
        <div cp-sub-menu="advanced"><label class="form-label cp_a_label redhue">Red</label><label class="form-label cp_a_label greensaturation">Green</label><label class="form-label cp_a_label bluebrightness">Blue</label><label class="form-label cp_a_label \
transparency">Transparency</label>\
            <div id="cp_a_redhue" class="sliderInput" minvalue="0" maxvalue="255" type="int" useinput="true" value="0" style="margin: auto;width: 275px;" units="°" steps="1">\
                <div class="sbar">\
                    <div class="shandle"></div>\
                </div><input type class="slider-output" maxlength="255" />\
            </div>\
            <div id="cp_a_greensaturation" class="sliderInput" minvalue="0" maxvalue="255" type="int" useinput="true" value="0" style="margin: auto;width: 275px;" units="%" steps="1">\
                <div class="sbar">\
                    <div class="shandle"></div>\
                </div><input type class="slider-output" />\
            </div>\
            <div id="cp_a_bluebrightness" class="sliderInput" minvalue="0" maxvalue="255" type="int" useinput="true" value="0" style="margin: auto;width: 275px;" units="%" steps="1">\
                <div class="sbar">\
                    <div class="shandle"></div>\
                </div><input type class="slider-output" />\
            </div>\
            <div id="cp_a_transparency" class="sliderInput" minvalue="0" maxvalue="100" type="units" useinput="true" value="100" style="margin: auto;width: 275px;" units="%" steps="1">\
                <div class="sbar">\
                    <div class="shandle"></div>\
                </div><input type class="slider-output" />\
            </div>\
            <div class="hsv-rgb_selector">\
                <div id="cp_a_rgb" class="active"><label class="form-label">RGB</label></div>\
                <div id="cp_a_hsv"><label class="form-label">HSL</label></div>\
            </div>\
            <div id="cp_a_walltoggle">\
                <div class="t-overlay"></div><i class="fa fa-plus"></i><i class="fa fa-minus"></i>\
            </div>\
            <div id="cp_a_colorwall" class="color show" style="background-color:#ff0000;">\
                <div class="sat">\
                    <div class="val">\
                        <div id="cp_a_cursor" class="color-wall-cursor"></div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="show" cp-sub-menu="shared">\
            <div id="cp_lastcolor" class="preview t-bg">\
                <div class="t-overlay"></div>\
            </div>\
            <div id="cp_newcolor" class="preview t-bg">\
                <div class="t-overlay"></div>\
            </div>\
            <div id="cp_eyedropperbtn"><i class="fa fa-eyedropper"></i></div>\
            <div class="favourite"><i class="fa fa-heart" id="cp_favourite"></i></div><select id="cp_colorvaluetype" class="value-type" style="width: 78px;height: 28px;">\
                <optgroup label="Color Input/Output Type">\
                    <option value="RGBA" selected>RGBA</option>\
                    <option value="HEX">HEX</option>\
                </optgroup>\
            </select><input type="text" id="cp_colorvalueinput" style="width: 160px;height: 28px;" />\
        </div><button class="btn btn-dark" id="cp_accept" type="button">Accept</button><button class="btn btn-secondary" id="cp_cancel" type="button">Cancel</button><button class="btn btn-secondary" id="cp_none" type="button">Default</button>\
        <div id="cp_previewpalette" style="display:none;"></div>\
    </div>\
</colorwindow>'
        
        $('body').append(html);
        
    }
    
    
    //Opens the Color Picker Window
    static OpenWindow(){
        ColorPicker.Object.window.addClass('open');
        ColorPicker.Object.window.trigger('open');
    }
    
    //Closes the Color Picker Window
    static CloseWindow(){
        ColorPicker.Object.window.removeClass('open');
        ColorPicker.Object.window.trigger('close');
        ColorPicker.Object.editingcolor = null;
        ColorPicker.Object.edittype = null;
    }
    
    //Are we connected to a database which holds and stores favourites?
    static FavouritesConnectedToDatabase(){
        
        //::NOTE:: Remember to set the modal attribute(usedatabase) if true
        
        
        return true; //Set true for now
    }
    
    //Creates events for the buttons inside the Color Picker Window.
    static AcceptAndCancelEvents(){

        
        ColorPicker.Object.accept.on('click', function(){
            ColorPicker.AcceptChanges();
            ColorPicker.SaveColor('current', ColorPicker.Object.newColor.ToHTML())
            ColorPicker.CloseWindow();
        });
        
        ColorPicker.Object.default.on('click', function(){
            ColorPicker.DefaultChanges();
            ColorPicker.CloseWindow();
            // ColorPicker.Object.editingcolor = null;
            // ColorPicker.Object.edittype = null;
        });
        
        ColorPicker.Object.cancel.on('click', function(){
            ColorPicker.CloseWindow();
            // ColorPicker.Object.editingcolor = null;
            // ColorPicker.Object.edittype = null;
        });
        
    }
    
    //Creates event for the favourite button
    static SetupFavouriteEvents(){
        
        ColorPicker.Object.favouriteButton.on('click', function(){
            ColorPicker.ToggleFavourite(ColorPicker.Object.newColor.ToHTML());
        });
       
    }
    
    //Setup events for the internal sub-modals.
    //One modal is used to create a new favourites list.
    static SetupModalEvents(){
        

        //When the user hits the ok button inside the new favourite modal, 
        //create a new favourite list
        ColorPicker.Object.favModalOk.on('click', function(){            
           ColorPicker.CreateNewFavourite();
        });
        
        //If the user clicks cancel just hide the modal
        ColorPicker.Object.favModalCancel.on('click', function(){
            ColorPicker.Object.favModal.removeClass('show');  
            
            //Unbind the enter key from the input
            ColorPicker.Object.favModalOk.unbind('keyup');
        });
        

        //If favourites are connected to the database then enable the ability
        //to create a favourite palette that saves to it.
        if(ColorPicker.Object.usingFavourites){
            
            //This attribute will enable options in the modal that weren't visible before
            ColorPicker.Object.favModal.attr('usedatabase', '');
            
            //When the user clicks the DB toggle, toggle the class to display its state
            ColorPicker.Object.favModalDB.on('click', function(){
                
                switch(ColorPicker.Object.favModalDB.hasClass('active')){
                    case true:
                        ColorPicker.Object.favModalDB.removeClass('active')
                        break;
                    case false:
                        ColorPicker.Object.favModalDB.addClass('active')
                        break;
                }
                
            });
        }
        
    }
    
    //Creates the event on the select element so that
    //the user is able to switch which palette they are viewing
    static PaletteSelectEvents(){
        
        ColorPicker.Object.paletteSelect.change(function(){
            var palette = ColorPicker.Object.paletteSelect.val();
            
            //Because there is 2 sub-menus with palettes we only want to remove the
            //active class from the one we are in. If we did all then the next time
            //we open the other sub-menu no palette will be open
            $('[cp-sub-menu=palette]').find('[palette]').removeClass('active');
            //$('[palette]').removeClass('active');
            $('[palette='+ palette +']').addClass('active');
            
        }); 
        
        ColorPicker.Object.favouriteSelect.change(function(){
            var palette = ColorPicker.Object.favouriteSelect.val();
            
            //When the new is selected we need to choose a new name.
            //This will display a modal for the user to input the name.
            if(palette == "new"){          
                
                //Add the show class to make the modal visible
                ColorPicker.Object.favModal.addClass('show');        
                
                //Set the modal to the mouses position
                ColorPicker.Object.favModal.css({
                    left: mouseX - ColorPicker.Object.favModal.offset().left,
                    top: mouseY - ColorPicker.Object.favModal.offset().top
                });
                
                //Set the favourite select back to the old palette
                ColorPicker.Object.favouriteSelect.val(ColorPicker.Object.favouriteSelect.find('option').val());
                
                //Focus on the input
                ColorPicker.Object.favModalInput.focus();
                
                //When the user hits enter on the input create the favourite
                ColorPicker.Object.favModalInput.keyup(function(e){
                    
                    //If the modal isn't open then don't create it
                    if(!ColorPicker.Object.favModal.hasClass('show')) return;
                    
                    //If the user hits enter then create a new favourite
                    if(e.keyCode == 13)
                    {
                        ColorPicker.CreateNewFavourite();
                    }
                });
                
            }else{
            
            
            ColorPicker.ActivateFavourite(palette);
            ColorPicker.CheckFavouriteColor();
            }
        });   
        
        //Delete the palette when the delete button is clicked
        ColorPicker.Object.favDelete.on('click', function(){            
            ColorPicker.DeletePalette(ColorPicker.Object.favouriteSelect.val());
        });
        
    }
    
    static DeletePalette(name){
        
        if(ColorPicker.Object.userColors[name] == null) return;
        
        //First delete the palette while we still have the selected option
        ColorPicker.Object.palettes.find('[palette='+name+']').remove();    
            
        //Delete the array
        delete ColorPicker.Object.userColors[name];
            
        //After we remove the palette we can remove the option from the select
        ColorPicker.Object.favouriteSelect.find(':selected').remove();
            
        //Set the favourite select back to the old palette
        ColorPicker.Object.favouriteSelect.val(ColorPicker.Object.favouriteSelect.find('option').val());
            
        //Hide the button
        ColorPicker.Object.favDelete.removeClass('show');
    }
    
    static ClearPalette(name){
        if(ColorPicker.Object.userColors[name] == null) return;
        
        //First delete the palette while we still have the selected option
        ColorPicker.Object.palettes.find('[palette='+name+']').html(''); 
        
        //Delete the array and recreate it
        delete ColorPicker.Object.userColors[name];
        ColorPicker.Object.userColors[name] = [];
    }

    //Setup events for importing and exporting palettes.
    static SetupFavouriteImportExport(){
        
        //When the user clicks the import button we will
        //simulate a click on the hidden input.
        //There is an event that will call when the file
        //has been selected.
        ColorPicker.Object.favImport.on('click', function(){
            ColorPicker.Object.favImportInput.trigger('click');
        });
        
        //Click the export button and the current list the 
        //user has open will begin to download as a .pal file
        ColorPicker.Object.favExport.on('click', function(){
            ColorPicker.ExportFavouritePal();
        });
        
        //When a file is selected we will begin the import process.
        ColorPicker.Object.favImportInput.change(function(){
            ColorPicker.ImportFavouritePal();
        });

        
    }
    
    static AddPallete(name, colors){
        
        if(colors instanceof String)
            colors = JSON.parse(colors);
        
         if(Object.keys(colors)[0] == name)
            colors = colors[name];
         
        //attribute checker : just checking to see if the palette exists
        var ac = $('[palette='+ name +']').attr('palette');

        //If there is no palette with the name then we need to create one
        if(ac == null || ac == 'undefined'){
            ColorPicker.CreatePalette(name);
        }else{
            ColorPicker.ActivateFavourite(name);
            ColorPicker.ClearPalette(name);
        }
        
        //Overwrite the palette with our new array
        ColorPicker.Object.userColors[name] = colors;
            
        //Log it to the console
        console.log('Loaded Palette : ' + name + " | Colors : " + colors.length);
            
        //Create all the color elements so the user can select them.
        for(var i = 0; i < colors.length; i++){
            ColorPicker.CreateColorElement($('[palette='+ name +']'), colors[i]);
        }
        
        ColorPicker.StorePalette(name, colors);
    }
    
    //Store use palette in local storage
    static StorePalette(name, colors){
        var palObj = localStorage.getItem('palettes');
        if(palObj == null) 
            palObj = {};
        else
            palObj = JSON.parse(palObj);
        
        palObj[name] = colors;
        
        var jpalettes = JSON.stringify(palObj, null, 2);
        
        localStorage.setItem('palettes', jpalettes);
    }
    
    //Store all user palettes in local storage
    static StorePalettes(){
        for(let key in ColorPicker.Object.userColors){
            StorePalette(name, ColorPicker.Object.userColors[key]);
        }
    }
    
    static LoadLocalPalettes(){
        var palettes = localStorage.getItem('palettes');
        
        if(palettes == null) return;
        
        var palObj = JSON.parse(palettes);
        
        for(let key in palObj){
            ColorPicker.AddPallete(key, palObj[key]);
        }
    }
    
    //Imports a .pal file and creates the palette.
    static ImportFavouritePal(){
        
        //First we need to get the filetype
        var filetype = ColorPicker.Object.favImportInput.val().split('.');
        
        //If the filetype is not .pal then it will probably not be the correct format.
        if(filetype[filetype.length - 1] != 'pal') {
            alert("Wrong File Type \n Please Select a .pal \n Only .pal's that have been exported from here will work. \n Atleast for the moment.");
            return
        };
        
        //Get the file from our hidden input
        var file = ColorPicker.Object.favImportInput.get(0).files[0];
        
        //Get the name of the palette from the filename
        var palette = file.name.split('.')[0].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '');
        
        //Create a filereader and then read as text
        var fr = new FileReader();
        fr.readAsText(file);       
        
        //Since readAsText is asynchronous we need to finish
        //when the file is done loading.
        fr.onload = function() {
            
            //Convert the JSON back to a string array
            //The reason we aren't using JSON.parse is because we want the user to be able to edit
            //and add colors easily, and directly to the .pal file.
            //All they need to do is add a color in web format (rgb, rgba, hex) and seperate them with |
            var colors = JSON.parse(fr.result);
            
            var name = Object.keys(colors)[0];
            
            ColorPicker.AddPallete(name, colors);

        };
        
        
    }
    
    
    
    //Exports the current favourite palette as a .pal file.
    static ExportFavouritePal() {
        
        //Get name of palette and store
        let name = ColorPicker.Object.favouriteSelect.val();        
        
        //Store palette in temporary object.
        let tempObj = {};
        tempObj[name] = ColorPicker.Object.userColors[name];
        
        //Create the variable which we will store the array in (as a string)
        let dataStr = JSON.stringify(tempObj, null, 2);
        
        
        `//First we need to convert the color array into a JSON string.
        $.each(ColorPicker.Object.userColors[ColorPicker.Object.favouriteSelect.val()], function(index, value){            
            dataStr += value;
            
            //We don't want to add the splitter if its the last one, otherwise on import we will get a blank color
            if(ColorPicker.Object.userColors[ColorPicker.Object.favouriteSelect.val()].length - 1 != index)
                dataStr + '|';
        }); `
         
        //Encode the json string into a temporary file.
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        //Set our Gidden links, and link to our temporary file
        ColorPicker.Object.favExportInput.setAttribute('href', dataUri);
        
        //Create a download attribute that has the name of our file
        ColorPicker.Object.favExportInput.setAttribute('download', name + '.pal');
        
        //Simulate a click on the link to begin the download
        ColorPicker.Object.favExportInput.click();        
        
        console.log('Exported Palette : ' + name + " | Colors : " + tempObj[name].length);
    }
    
    //Add or remove current color from the selected palette.
    static ToggleFavourite(color){
        switch(ColorPicker.Object.favouriteSelect.val())
        {
            case "favourite":
            case "session":
            case "current":
                if(ColorPicker.Object.usingFavourites){
                    
                    switch(ColorPicker.IsColorInList('favourite', color)){
                        case true:
                            ColorPicker.RemoveColorFromList('favourite', color);
                            ColorPicker.Object.favouriteButton.removeClass('fav');
                            ColorPicker.SaveColor('session', color, true);
                            ColorPicker.Object.favouriteButton.addClass('sesh');
                            break;
                        case false:
            
                            
                            switch(ColorPicker.IsColorInList('session', color)){
                                case true:
                                    ColorPicker.RemoveColorFromList('session', color);
                                    ColorPicker.Object.favouriteButton.removeClass('sesh');
                                    break;
                                case false:
                                    ColorPicker.SaveColor('favourite', color, true);
                                    ColorPicker.Object.favouriteButton.addClass('fav');
                                    break;
                            }
                            break;
                    }
                }else{
                    switch(ColorPicker.IsColorInList('session', color)){
                        case true:
                            ColorPicker.RemoveColorFromList('session', color);
                            ColorPicker.Object.favouriteButton.removeClass('sesh');                    
                            break;
                        case false:
                            ColorPicker.SaveColor('session', color, true);
                            ColorPicker.Object.favouriteButton.addClass('sesh');
                            break;
                    }
                }
                break;
                
            default:

                switch(ColorPicker.IsColorInList(ColorPicker.Object.favouriteSelect.val(), color)){
                    case false:
                        //boolean - If the favourite is saved to a database it will have the database attribute
                        var database = ColorPicker.Object.favouriteSelect.find(':selected').attr('database') != null && ColorPicker.Object.favouriteSelect.find(':selected').attr('database') != 'undefined';
                        
                        //Save the color and create the element
                        ColorPicker.SaveColor(ColorPicker.Object.favouriteSelect.val(), color, true);
                        
                        //Give it a class which shows if its in a database or the session
                        switch(database){
                            case true:
                                ColorPicker.Object.favouriteButton.addClass('fav');
                                break;
                            case false:
                                ColorPicker.Object.favouriteButton.addClass('sesh');
                                break;
                        }
                        
                        //Also add a class that shows its in a custom palette
                        ColorPicker.Object.favouriteButton.addClass('custom');
                        
                        break;
                    case true:
                        //Remove all classes and delete it from the list
                        ColorPicker.RemoveColorFromList(ColorPicker.Object.favouriteSelect.val(), color);
                        ColorPicker.Object.favouriteButton.removeClass('fav');
                        ColorPicker.Object.favouriteButton.removeClass('sesh');
                        ColorPicker.Object.favouriteButton.removeClass('custom');
                        break;
                }
                break; 
        }
    }
    
    /*
    Saves the current color as either a session or favourite
    @param list : (session, favourite) Decides how and where its being saved to
    @param color    : The color that is being saved, MUST be web format
    @param prepend  : (optional) Add item to start of list, true or false? If not used will be added to end
    */
    static SaveColor(list, color, prepend){
        
        //Check to see if its already in the list
        if(!ColorPicker.IsColorInList(list, color)){
            
            if(arguments.length == 3){
                if(prepend){
                    //Add the color to the start of the array
                    ColorPicker.Object.userColors[list].unshift(color);
                    
                    //Create the element and prepend it to the palette
                    ColorPicker.CreateColorElement($('[palette='+ list +']'), color, true);
                }else{
                    //Add the color to the end of the array
                    ColorPicker.Object.userColors[list].push(color);
                    
                    //Create the element and append it to the palette
                    ColorPicker.CreateColorElement($('[palette='+ list +']'), color);
                }               
            }else{
                //Add the color to the end of the array
                ColorPicker.Object.userColors[list].push(color);
                
                //Create the element and append it to the palette
                ColorPicker.CreateColorElement($('[palette='+ list +']'), color);
            } 
            
            ColorPicker.StorePalette(list, ColorPicker.Object.userColors[list]);
        }
        
    }
    
    //Finds a matching color from a specific list, even if the HTML isn't exactly the same.
    //And finally it returns the index. If no color was found -1 will be returned.
    //Example, rgb(255,0,0) is the same as rgba(255, 0, 0, 1)
    static GetIndexOfColorInList(list, color){
        
        for(var i = 0; i < list.length; i++){
            if(ColorsAreEqual(color, list[i]))
                return i;
        }
        return -1;        
    }
    
    //Removes a color from a specified list, and the DOM element.
    static RemoveColorFromList(list, color){
        
        var index = ColorPicker.GetIndexOfColorInList(ColorPicker.Object.userColors[list], color);
        ColorPicker.Object.userColors[list].splice(index, 1); 
        //ColorPicker.Object.userColors[list].splice(ColorPicker.Object.userColors[list].indexOf(color), 1);     
        //$('[palette='+list+']').find('[style*="background-color: '+ color +';"]').remove();
        //$('#cp_palettes [value="'+color+'"]').remove();
        $('#cp_palettes [palette="'+list+'"]').children().eq(index).remove();
        //$('[palette='+list+']').find('[style*="box-shadow: '+ color +' '+ ColorPicker.Object.boxshadow_overlay +';"], [value="'+color+'"]').remove();
        ColorPicker.StorePalette(list, ColorPicker.Object.userColors[list]);
    }
    
    /*
    Checks to see if the color already exists in the list
    @param list     : (session, favourite) Decides how and where its being saved to
    @param color    : The color that is being checked
    */
    static IsColorInList(list, color){
        return ColorPicker.GetIndexOfColorInList(ColorPicker.Object.userColors[list], color) !== -1;
         //return ColorPicker.Object.userColors[list].indexOf(color) != -1;
    }
    
    //Create a new palette to add colors to.
    static CreatePalette(name){
        
        //Create the palette element
        var palette = document.createElement('div');
        
         //Create the palette attribute with the name of our palette
        $(palette).attr('palette', name.charAt(0).toLowerCase() + name.slice(1));
        
        
        //Append it so it is a sibling to the others
        ColorPicker.Object.palettes.append(palette);
        
        //Create the palette option in the select
        var option = document.createElement('option');
        
        //Set the option value and text, the text with an uppercase for the first letter
        $(option).val(name.charAt(0).toLowerCase() + name.slice(1));
        $(option).text(name.charAt(0).toUpperCase() + name.slice(1));
        
        
        //Append it to the optgroup of the favourite selector
        ColorPicker.Object.favouriteSelect.children().append(option);
        
        //Give it the temp attribute, this will allow us to delete it
        $(option).attr('temp', '');
        
        //Since we always want the Create New option at the bottom we will append it as well
        ColorPicker.Object.favouriteSelect.children().append(ColorPicker.Object.favouriteSelect.find('option[value=new]'));
        
        //Activate the new palette
        ColorPicker.ActivateFavourite(name.charAt(0).toLowerCase() + name.slice(1));
        
        
        ColorPicker.CheckFavouriteColor();
    }
    
    
    /*
    Creates the color element and appends it to the palette
    Returns the element
    @param palette  : The name of the palette the color is being added to
    @param color    : The color of the element
    @param prepend  : (Optional) Add item to start of list, true or false? If unused element will be appended
    */
    static CreateColorElement(palette, color, prepend){
        //Create the element and append it to the palette
        var colorElem = document.createElement('color');   
        
        //For some reason changing the background-color does not overlay over the background image anymore.
        //So a box-shadow is used instead.
        //$(colorElem).css('background-color', color);   
        $(colorElem).css('box-shadow', ColorPicker.Object.boxshadow_overlay + ' ' + color);
        $(colorElem).attr('value', color);
        
        if(arguments.length == 3){
            if(prepend){
                //Add the color to the start of the palette
                $(palette).prepend(colorElem);
            }else{
                //Add the color to the end of the palette
                $(palette).append(colorElem);
            }               
        }else{
            //Add the color to the end of the palette
            $(palette).append(colorElem);
        }
        
           
        
        //Setup the events or we won't be able to select it
        ColorPicker.SetupColorEvent($(colorElem));
        
        //Return it just incase we need to use the element later
        return $(colorElem);
    }
    
    
    static ActivateFavourite(palette){
        //Because there is 2 sub-menus with palettes we only want to remove the
        //active class from the one we are in. If we did all then the next time
        //we open the other sub-menu no palette will be open
        $('[cp-sub-menu=favourite]').find('[palette]').removeClass('active');
        //$('[palette]').removeClass('active');
        $('[palette='+ palette +']').addClass('active');
        
    
        //Check to see if the palette is temporary, if it is then show the delete button.
        if(ColorPicker.Object.favouriteSelect.find(':selected').attr('temp') != null || ColorPicker.Object.favouriteSelect.find(':selected').attr('temp') == "undefined"){
            ColorPicker.Object.favDelete.addClass('show');
        }else{
            ColorPicker.Object.favDelete.removeClass('show');
        }

        ColorPicker.Object.palettes.find('[palette='+ palette +']')
        
        //Simulate a click on our new option so Create New is no longer selected
        ColorPicker.Object.favouriteSelect.val(palette);
    }
    

    
    static CreateNewFavourite(){
        //Get the name from the input
        var name = ColorPicker.Object.favModalInput.val().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '');
        
        //Remove all spaces and special characters to make sure it isn't blank
        if(name == ""){
            alert('Input cannot be blank or contain special characters.');
        }else{
            
            //Create the array for colors so we are able to populate it
            ColorPicker.Object.userColors[name.charAt(0).toLowerCase() + name.slice(1)] = [];
            
            //Create the palette and remove all spaces and special characters
            ColorPicker.CreatePalette(name);
            
            //Remove the class to hide the modal again
            ColorPicker.Object.favModal.removeClass('show');
            
            //Remove all the text from the input                
            ColorPicker.Object.favModalInput.val('');
            
            //Unbind the enter key from the input
            ColorPicker.Object.favModalOk.unbind('keyup');
            
            //Display the delete button since the new one is considered temporary
            ColorPicker.Object.favDelete.addClass('show');
        }
    }
    
    static CheckFavouriteColor(){
        switch(ColorPicker.Object.favouriteSelect.val())
        {
            case "favourite":
            case "session":
            case "current":
                //If the color is in the favourites list we want the favourite
                //button to display if it is or not.
                //Button will display pink
                if(ColorPicker.IsColorInList('favourite', ColorPicker.Object.newColor.ToHTML())){
                    ColorPicker.Object.favouriteButton.addClass('fav');
                }else{
                    ColorPicker.Object.favouriteButton.removeClass('fav');
                }
                
                //If the color is in the session list we want the favourite
                //button to display if it is or not.
                //It will display yellow, but only if not a favourite as well.
                if(ColorPicker.IsColorInList('session', ColorPicker.Object.newColor.ToHTML())){
                    ColorPicker.Object.favouriteButton.addClass('sesh');
                }else{
                    ColorPicker.Object.favouriteButton.removeClass('sesh');
                }
                
                //If the color is in the current session list we want the favourite
                //button to display if it is or not.
                //It will display gray-blue, but only if not in the favourites or session.
                if(ColorPicker.IsColorInList('current', ColorPicker.Object.newColor.ToHTML())){
                    ColorPicker.Object.favouriteButton.addClass('current');
                }else{
                    ColorPicker.Object.favouriteButton.removeClass('current');
                }
                
                break;
                
            default:
                
                  
                //We need to see if its being stored in a database or not.
                var database = ColorPicker.Object.favouriteSelect.find(':selected').attr('database') != null && ColorPicker.Object.favouriteSelect.find(':selected').attr('database') != 'undefined';
                
                //If the color is in the current session list we want the favourite
                //button to display if it is or not.
                //It will display gray-blue, but only if not in the favourites or session.
                if(ColorPicker.IsColorInList(ColorPicker.Object.favouriteSelect.val() , ColorPicker.Object.newColor.ToHTML())){
                    ColorPicker.Object.favouriteButton.addClass('current');
                }else{
                    ColorPicker.Object.favouriteButton.removeClass('custom');
                    ColorPicker.Object.favouriteButton.removeClass('fav');
                    ColorPicker.Object.favouriteButton.removeClass('sesh');
                }
                
                break;
        }
    }
    

    static SetupColorEvent(colorElem){
        
        //When the mouse hovers over a color it will create a preview box
        $(colorElem).mouseenter(function(){
            
            //Reference the color because calling this in css will
            //actually use the element that is calling css
            var color = $(this);
            
            //Remove the event just incase the timeout is about to start
            //after we have moved to a new color
            EventMouseMove.delete(ColorPicker.IsMouseHoveringPalette);
            
            //Make sure the preview box is visible
            ColorPicker.Object.palettePreview.show();
    
            //Add the transition class so it will play the transition when shown
            ColorPicker.Object.palettePreview.addClass('transition');
            
            //This centers it on the color we are previewing
            ColorPicker.Object.palettePreview.css({
                //"background-color" : color.css('background-color'),
                "background-color" : color.css('box-shadow').replace(/^.*(rgba?\([^)]+\)).*$/,'$1'),
                left : (color.offset().left - ColorPicker.Object.bg.offset().left + (color.width() / 2)),
                top :  (color.offset().top - ColorPicker.Object.bg.offset().top + (color.height() / 2)),
                transform : ("translate(-50%, -50%)")
            });
            
           
            
            //We need to call this function late or else it 
            //will be activated instantly, which hides the preview box
            setTimeout(function(){
            //Becuase mouseleave is not always called,
            //especially if the mouse is moved at a fast rate,
            //We need to check if the mouse is still hovering
            //and if not hide the preview box.
            EventMouseMove.add(ColorPicker.IsMouseHoveringPalette);
            }, 500)
            
        });
        
        //This will revert to the color we started with when the window was opened
        ColorPicker.Object.eLastColor.on('click', function(){
            
            //Sets the color to the last color, which is a Color object
            //We need to tell it that its a Color object, and to do that
            //we just stick 'color' as the second arguement.
            ColorPicker.SetColor(ColorPicker.Object.lastColor, 'color');
            
        });
        
    }
    
    //Creates the click event for selecting the color,
    //as well as hiding as you leave the preview box
    //Actual color events are handled in SetupColorEvent
    static ColorEvents(){
        
        
        //This will hide the preview when it leaves the box.
        //This cannot be put on the color because when the preview
        //is shown it would activate right away, because it covers it
        ColorPicker.Object.palettePreview.mouseleave(function(){
                
            //Hide the preview box
            ColorPicker.Object.palettePreview.hide();
            
            //Remove the transition class so it will play next time
            ColorPicker.Object.palettePreview.removeClass('transition');
        });
        
        
        //Because the preview box covers the color we create the
        //event on the preview element, if we didn't we would
        //never be able to click the color and select it
        ColorPicker.Object.palettePreview.on('click', function(){
            
            //Set the new color to the background color of the preview box
            ColorPicker.SetColor(ColorPicker.Object.palettePreview.css('background-color'));
        });
        
    }
    
    
    //Setting up the mouse events for the color wall
    static ColorWallMouseEvent(){
    
        //:::: The regular wall ::::
        
        //When we click the mouse we expect the picking cursor to teleport to
        //the mouse's location on the wall.
        ColorPicker.Object.wall.on('click', function(){
            
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.pointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.wall), $(ColorPicker.Object.pointer));
            ColorPicker.Object.aPointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.aWall), $(ColorPicker.Object.aPointer));
            
            //Set the pointers so we know which ones to use
            //for the calculations
            ColorPicker.Object.movingPointer = "main";
            
            //Move the pointer quickly
            ColorPicker.MovePointer();       
        });
        
        //When we hold the mouse down we want the picking cursor to follow the mouse
        ColorPicker.Object.wall.mousedown(function(){        
            
            //If the mouse is down before we we enter the wall don't
            //move the pointer
            if(isMouseDown == true) return;        
            
            //Unbind the mousedown event so it isnt constantly being called
            //$(ColorPicker.Object.wall).unbind('mousedown');    
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.pointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.wall), $(ColorPicker.Object.pointer));
            ColorPicker.Object.aPointerBounds = ColorPicker.ClampingBounds($(ColorPicker.Object.bg), $(ColorPicker.Object.aWall), $(ColorPicker.Object.aPointer));
            
            //Set the pointers so we know which ones to use
            //for the calculations
            ColorPicker.Object.movingPointer = "main";
            
            //Add the functions to the MouseMove/Up delegates
            //This will handle dragging the pointer
            EventMouseMove.add(ColorPicker.MovePointer);
            EventMouseUp.add(ColorPicker.StopMovingPointer);      
            
        }); 
        
        
        //:::: The advanced wall ::::
        
        
        //When we click the mouse we expect the picking cursor to teleport to
        //the mouse's location on the wall.
        ColorPicker.Object.aWall.on('click', function(){   
            
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.aPointerBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.aWall, ColorPicker.Object.aPointer);
            ColorPicker.Object.pointerBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.wall, ColorPicker.Object.pointer);
            
            //Set the pointers so we know which ones to use
            //for the calculations
            ColorPicker.Object.movingPointer = "adv";
            
            //Move the pointer quickly
            ColorPicker.MovePointer();       
        });
        
        //When we hold the mouse down we want the picking cursor to follow the mouse
        ColorPicker.Object.aWall.mousedown(function(){        
            
            //If the mouse is down before we we enter the wall don't
            //move the pointer
            if(isMouseDown == true) return;        
            
            //Unbind the mousedown event so it isnt constantly being called
            //$(ColorPicker.Object.wall).unbind('mousedown');
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.aPointerBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.aWall, ColorPicker.Object.aPointer);
            ColorPicker.Object.pointerBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.wall, ColorPicker.Object.pointer);
            
            
            //Set the pointers so we know which ones to use
            //for the calculations
            ColorPicker.Object.movingPointer = "adv";
            
            //Add the functions to the MouseMove/Up delegates
            //This will handle dragging the pointer
            EventMouseMove.add(ColorPicker.MovePointer);
            EventMouseUp.add(ColorPicker.StopMovingPointer);      
            
        });  
    }
    
    
    //Setup the mouse events for the sliders.
    //This includes Hue, transparency
    //This does not include the R/H, G/S, B/L in the advancted tab
    static SliderMouseEvents(){
    
        //Start by unbinding the events
        //This is because when we start moving them we unbind the one we are moving,
        //and rebind them after moving. So this deters duplicate handlers.
        //$(".cp_cbar").find('.handle').unbind('mousedown');
        //$(".cp_cbar").find('.handle').unbind('click');
        
        $(".cp_cbar").on('click', function(){
            
            //Set the moving elements so we know which slider to move
            ColorPicker.Object.movingSlider = $(this).hasClass('.cp_bar') ? $(this) : $(this).closest('.cp_cbar');
            ColorPicker.Object.movingHandle = $(this).find('.handle');
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.sliderBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.movingSlider, ColorPicker.Object.movingHandle);
            
            //Instead of adding it to a delegate we will just call it once,
            //since we are only moving it once
            ColorPicker.MoveSliders();        
            
            //If the slider is the hue controller then recalculate the hue
            if(ColorPicker.Object.movingSlider.attr('id') == "cp_huebar"){
                ColorPicker.CalculateHue();
            }
            
            //If the slider is the hue controller then recalculate the hue
            if(ColorPicker.Object.movingSlider.attr('id') == "cp_transbar"){
                ColorPicker.CalculateTransparency();
            }
            
            //Stop referencing the slider/handle
            //Normally this is done in the mouse up delegate
            ColorPicker.Object.movingSlider = null;
            ColorPicker.Object.movingHandle = null;
            
        });
        
        $(".cp_cbar").find('.handle').mousedown(function(){
            
            //Unbind the mousedown event so it isnt constantly being called
            //$(this).unbind('mousedown');
            
            //If we are already moving a slider stop running the code.
            //If the mouse accidentally gets dragged over another 
            //slider while moving one, we don't want to cancel
            //and start moving a new one, untill mouse has been lifted.
            //if(ColorPicker.Object.movingSlider != null) return;
            
            //If the mouse is down before the handle don't bother moving it.
            if(isMouseDown == true) return;        
            
            //Set the moving elements so we know which slider to move
            ColorPicker.Object.movingSlider = $(this).closest('.cp_cbar');
            ColorPicker.Object.movingHandle = $(this);
            
            //Precalculate the bounds,
            //we need to do this atleast once every time we move the cursor 
            //just incase the window has moved, or something has been resized
            ColorPicker.Object.sliderBounds = ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.movingSlider, ColorPicker.Object.movingHandle);
            
            //Add the functions to the delegates.
            EventMouseMove.add(ColorPicker.MoveSliders);     //Handles moving
            EventMouseUp.add(ColorPicker.StopMovingSlider);  //Handles stopping
            
            //If the slider is the hue controller then recalculate the hue
            if($(ColorPicker.Object.movingSlider).attr('id') == "cp_huebar"){
                EventMouseMove.add(ColorPicker.CalculateHue);
            }
            
            //If the slider is the hue controller then recalculate the hue
            if($(ColorPicker.Object.movingSlider).attr('id') == "cp_transbar"){
                EventMouseMove.add(ColorPicker.CalculateTransparency);
            }
                
        });    
    }  
    









    static InputTextboxEvent(){
        
        //ExtractColorFromHtml
        
        ColorPicker.Object.valueinput.change(function(){
            
            //Try updating the color with the inputs value
            ColorPicker.SetColor(ColorPicker.Object.valueinput.val());
            
        });
        
    }
    
    
    //Handles toggling from RGB to HSV
    static AdvancedButtonEvents(){
        
        $('#cp_a_rgb').on('click', function(){
            //Change the mode
            ColorPicker.Object.advancedMode = "rgb";
            
            //Remove the class's which make the button appear pressed
            //We remove this object as well so when we add it there isn't double
            $('#cp_a_rgb').removeClass('active');
            $('#cp_a_hsv').removeClass('active');
            
            //Add the class which lets the user know which button is pressed
            $('#cp_a_rgb').addClass('active');
            
            //Apply the mode, this will change all the sliders to their correct value
            ColorPicker.ChangeAdvancedMode();
        });
        
         $('#cp_a_hsv').on('click', function(){
            //Change the mode
            ColorPicker.Object.advancedMode = "hsv";
            
            //Remove the class's which make the button appear pressed
            //We remove this object as well so when we add it there isn't double
            $('#cp_a_hsv').removeClass('active');
            $('#cp_a_rgb').removeClass('active');
            
            //Add the class which lets the user know which button is pressed
            $('#cp_a_hsv').addClass('active');
            
            //Apply the mode, this will change all the sliders to their correct value
            ColorPicker.ChangeAdvancedMode();
        });
        
        //The tiny color wall toggle
        $('#cp_a_walltoggle').on('click', function(){
            
            if($('#cp_a_walltoggle').hasClass('hidden')){
                $('#cp_a_walltoggle').removeClass('hidden');
                ColorPicker.Object.aWall.addClass('show');
            }else{
                $('#cp_a_walltoggle').addClass('hidden');
                ColorPicker.Object.aWall.removeClass('show');
            }
            
        });
        
    }
    
    //Handles some events related to the sliders in the advanced tab
    //Most of the sliders code is handled in SliderInput.js
    static AdvancedSliderEvents(){
        ColorPicker.Object.rHueSlider.on('changing',function(){
            switch(ColorPicker.Object.advancedMode){
                case "rgb":
                    ColorPicker.Object.newColor.r = Number(ColorPicker.Object.rHueSlider.attr('value'));   
                    ColorPicker.Object.newHSV = ColorPicker.Object.newColor.ToHsvClass();
                    break;
                case "hsv":
                    ColorPicker.Object.newHSV.h =  ColorPicker.Object.rHueSlider.attr('value').match(/\d+/g).map(Number);    
                    ColorPicker.Object.newColor = ColorPicker.Object.newHSV.ToColor();
                    break;
            }
            
            //Set the color wall color position relative to that of the proper values
            //Also changes the color walls's background color
            ColorPicker.SetCursorPositionRelativeToValue();
            
            //Update color preview
            ColorPicker.PreviewNewColor();
        });
            
        ColorPicker.Object.gSatSlider.on('changing',function(){
            switch(ColorPicker.Object.advancedMode){
                case "rgb":
                    ColorPicker.Object.newColor.g = Number(ColorPicker.Object.gSatSlider.attr('value'));
                    ColorPicker.Object.newHSV = ColorPicker.Object.newColor.ToHsvClass();
                    break;
                case "hsv":
                    ColorPicker.Object.newHSV.s = Number(ColorPicker.Object.gSatSlider.attr('value').replace('%', ''));
                    ColorPicker.Object.newColor = ColorPicker.Object.newHSV.ToColor();
                    break;
            }
            
            //Set the color wall color position relative to that of the proper values
            //Also changes the color walls's background color
            ColorPicker.SetCursorPositionRelativeToValue();
            
            //Update color preview
            ColorPicker.PreviewNewColor();
        });
            
        ColorPicker.Object.bBrightSlider.on('changing',function(){
            switch(ColorPicker.Object.advancedMode){
                case "rgb":
                    ColorPicker.Object.newColor.b =  Number(ColorPicker.Object.bBrightSlider.attr('value'));
                    ColorPicker.Object.newHSV = ColorPicker.Object.newColor.ToHsvClass();
                    break;
                case "hsv":
                    ColorPicker.Object.newHSV.v = Number(ColorPicker.Object.bBrightSlider.attr('value').replace('%', ''));
                    ColorPicker.Object.newColor = ColorPicker.Object.newHSV.ToColor();
                    break;
            }
            
            //Set the color wall color position relative to that of the proper values
            //Also changes the color walls's background color
            ColorPicker.SetCursorPositionRelativeToValue();
            
            //Update color preview
            ColorPicker.PreviewNewColor();
        });
            
        ColorPicker.Object.aTransSlider.on('changing',function(){
            ColorPicker.Object.transparency = Number(ColorPicker.Object.aTransSlider.attr('value').replace('%', '')) * 0.01;
            
            //If the transparency is non-existant then
            //we will set the alpha channel to null
            //so it will return us an RGB value
            //instead of RGBA
            if(ColorPicker.Object.transparency == 1){
                ColorPicker.Object.newColor.a = null;
            }else{
                ColorPicker.Object.newColor.a = ColorPicker.Object.transparency;
            }
            
            //Set the color wall color position relative to that of the proper values
            //Also changes the color walls's background color
            ColorPicker.SetCursorPositionRelativeToValue();
            
            //Update color preview
            ColorPicker.PreviewNewColor();
        });
    }
    
    
    //Creates events for moving the window
    static BackgroundMoveEvent(){
        
        ColorPicker.Object.bg.mousedown(function(){
            
    
            //We want to make sure that we don't have the mouse down
            //on one of the child elements.
            if($(event.target).attr('id') != "cp_bg") return;
            
            //Add the functions to the delegetes.
            //this will handle the moving, as well
            //as stopping the moving and re-creating 
            //the mouse down event
            EventMouseMove.add(ColorPicker.MoveWindow);
            EventMouseUp.add(ColorPicker.StopMovingWindow);
            
            //Calculate the offset for the mouse to the window
            ColorPicker.Object.windowOffset = {
                x : (mouseX - ColorPicker.Object.window.offset().left),
                y : (mouseY - ColorPicker.Object.window.offset().top)
            };
            
            
            //Unbind the mousedown event so it isn't called again
            ColorPicker.Object.bg.unbind('mousedown');
            
        });
        
    }
    
    //Becuase mouseleave is not always called,
    //especially if the mouse is moved at a fast rate,
    //We need to check if the mouse is still hovering
    //and if not hide the preview box.
    static IsMouseHoveringPalette(eb){
        
        //If its not even visible yet then don't run the code
        if(!ColorPicker.Object.palettePreview.is(":visible")) return;
        
        if(!ColorPicker.Object.palettePreview.is(':hover')){
            //Hide the preview box
            ColorPicker.Object.palettePreview.hide();
            
            //Stop this from being called every mouse move
            EventMouseMove.delete(ColorPicker.IsMouseHoveringPalette);
        }
    }
    
    static MoveWindow(){
        
        $('body').append(ColorPicker.Object.window);
        
        ColorPicker.Object.window.css({
            left: (mouseX - ColorPicker.Object.windowOffset.x),
            top: (mouseY - ColorPicker.Object.windowOffset.y)
        });
        
    }
    
    static StopMovingWindow(){
        
        //Stop calling the function each time the mouse
        //is moved, as well as when a click is released
        EventMouseMove.delete(ColorPicker.MoveWindow);
        EventMouseUp.delete(ColorPicker.StopMovingWindow);
        
        //Re-create the mousedown event so the user can
        //move the window more than once.
        ColorPicker.BackgroundMoveEvent();
    }
    
    
    
    //Changes all the sliders to their correct value
    //and units of measurement
    static ChangeAdvancedMode(){
        
        
        switch(ColorPicker.Object.advancedMode){
            case "rgb":
                //Set their max values to an RGB range, which is 255
                ColorPicker.Object.rHueSlider.attr('maxvalue', 255);
                ColorPicker.Object.gSatSlider.attr('maxvalue', 255);
                ColorPicker.Object.bBrightSlider.attr('maxvalue', 255);
                
                //We only want them to use real numbers so we set their type to int
                ColorPicker.Object.rHueSlider.attr('type', "int");
                ColorPicker.Object.gSatSlider.attr('type', "int");
                ColorPicker.Object.bBrightSlider.attr('type', "int");
                
                //Before we update the slider we need to update the value
                //of the slider and the input, the handle will be updated 
                //when the slider is.
                ColorPicker.Object.rHueSlider.attr('value', ColorPicker.Object.newColor.r);
                ColorPicker.Object.gSatSlider.attr('value', ColorPicker.Object.newColor.g);
                ColorPicker.Object.bBrightSlider.attr('value', ColorPicker.Object.newColor.b);
                
                //Now we neeed to update their objects so the calculations are correct
                UpdateSliderProperties( ColorPicker.Object.rHueSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.gSatSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.bBrightSlider);    //sliderinput.js
                
                //Change the labels to their appropriate text
                $('.cp_a_label.redhue').text("Red");
                $('.cp_a_label.greensaturation').text("Green");
                $('.cp_a_label.bluebrightness').text("Blue");
                
                break;
                
            case "hsv":
                //Set the top slider to a hue range, which is 360 degrees
                //Then set the other max values to 100
                ColorPicker.Object.rHueSlider.attr('maxvalue', 360);
                ColorPicker.Object.gSatSlider.attr('maxvalue', 100);
                ColorPicker.Object.bBrightSlider.attr('maxvalue', 100);
                
                //We want to see a custom unit so set the type to measurement
                //This will display a degree sign for hue, and percent sign for the others
                ColorPicker.Object.rHueSlider.attr('type', "units");
                ColorPicker.Object.gSatSlider.attr('type', "units");
                ColorPicker.Object.bBrightSlider.attr('type', "units");
                
                //Before we update the slider we need to update the value
                //of the slider and the input, the handle will be updated 
                //when the slider is.
                ColorPicker.Object.rHueSlider.attr('value', ColorPicker.Object.newHSV.h);
                ColorPicker.Object.gSatSlider.attr('value', ColorPicker.Object.newHSV.s.P_Round(1,0));
                ColorPicker.Object.bBrightSlider.attr('value', ColorPicker.Object.newHSV.v);
                
                //Now we neeed to update their objects so the calculations are correct
                UpdateSliderProperties( ColorPicker.Object.rHueSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.gSatSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.bBrightSlider);    //sliderinput.js
                
                //These should already be set.
                //Its which sign will be displayed
                //$(ColorPicker.Object.rHueSlider).attr('units', "°");
                //$(ColorPicker.Object.rHueSlider).attr('units', "%");
                //$(ColorPicker.Object.rHueSlider).attr('units', "%");
                
                //Change the labels to their appropriate text
                $('.cp_a_label.redhue').text("Hue");
                $('.cp_a_label.greensaturation').text("Saturation");
                $('.cp_a_label.bluebrightness').text("Lightness");
                break;
        }
    }
    
    static InputOutputTypeEvent(){
        
        //When the value type is changed we want to 
        //update the input/output value to the new type
        ColorPicker.Object.valuetype.change(function(){        
            ColorPicker.UpdateInputOutputValue();
        });
        
    }
    
    //The calculations for the wall bounds 
    static ClampingBounds(window, wall, pointer){
        
        //First we will get the bounds of the wall.
        //This will be used for clamping the cursor position
        var leftBounds      = wall.offset().left;
        var rightBounds     = wall.offset().left    + wall.width();
        var topBounds       = wall.offset().top;
        var bottomBounds    = wall.offset().top     + wall.height();
        
        //Since we need to set the position with an offset to the wall, as well as the window
        //we will calculate the offset needed now, so we arent doing it every mousemove.
        //We also need to consider the size of the cursor.
        var wallLeftOffset  = window.offset().left  + (wall.offset().left   - window.offset().left  + (pointer.width() / 2));
        var wallTopOffset   = window.offset().top   + (wall.offset().top    - window.offset().top   + (pointer.height() / 2));
        
        return {leftBounds      : leftBounds, 
                rightBounds     : rightBounds, 
                topBounds       : topBounds, 
                bottomBounds    : bottomBounds,
                leftOffset      : wallLeftOffset,
                topOffset       :   wallTopOffset
               }
        
    }
    
    static MovePointer(){    
        
        switch(ColorPicker.Object.movingPointer){
            case "main":
                //Move the main pointer into position
                $(ColorPicker.Object.pointer).css({
                    left:   (MathE.Clamp(mouseX, ColorPicker.Object.pointerBounds.leftBounds,    ColorPicker.Object.pointerBounds.rightBounds )   - ColorPicker.Object.pointerBounds.leftOffset),
                    top:    (MathE.Clamp(mouseY, ColorPicker.Object.pointerBounds.topBounds,     ColorPicker.Object.pointerBounds.bottomBounds)   -  ColorPicker.Object.pointerBounds.topOffset) 
                
                });
                
                //Move the Advanced pointer into a position relative to the main pointer
                $(ColorPicker.Object.aPointer).css({
                    left:   MathE.Map(ColorPicker.Object.pointer.offset().left   +   ColorPicker.Object.pointer.width(), 
                                    ColorPicker.Object.pointerBounds.leftBounds,     ColorPicker.Object.pointerBounds.rightBounds,
                                    ColorPicker.Object.aPointerBounds.leftBounds,    ColorPicker.Object.aPointerBounds.rightBounds)  - 
                            ColorPicker.Object.aPointerBounds.leftOffset,
                    
                    
                    top:    MathE.Map($(ColorPicker.Object.pointer).offset().top +   ColorPicker.Object.pointer.height(), 
                                    ColorPicker.Object.pointerBounds.topBounds,      ColorPicker.Object.pointerBounds.bottomBounds,
                                    ColorPicker.Object.aPointerBounds.topBounds,     ColorPicker.Object.aPointerBounds.bottomBounds)  - 
                            ColorPicker.Object.aPointerBounds.topOffset 
                
                });     
                
                //Calculate the color from the new positions
                ColorPicker.Object.newHex = ColorPicker.CalculateHsvFromWall(ColorPicker.Object.wall, ColorPicker.Object.pointer);
                break;
                
            default:
                //Move the Advanced pointer into position
                ColorPicker.Object.aPointer.css({
                    left:   (MathE.Clamp(mouseX,    ColorPicker.Object.aPointerBounds.leftBounds,    ColorPicker.Object.aPointerBounds.rightBounds )  - ColorPicker.Object.aPointerBounds.leftOffset),
                    top:    (MathE.Clamp(mouseY,    ColorPicker.Object.aPointerBounds.topBounds,     ColorPicker.Object.aPointerBounds.bottomBounds)  -  ColorPicker.Object.aPointerBounds.topOffset) 
                
                });
                
                //Move the main pointer into a position relative to the advanced pointer
                ColorPicker.Object.pointer.css({
                    left:   MathE.Map(ColorPicker.Object.aPointer.offset().left  +   ColorPicker.Object.aPointer.width(), 
                                    ColorPicker.Object.aPointerBounds.leftBounds,    ColorPicker.Object.aPointerBounds.rightBounds,
                                    ColorPicker.Object.pointerBounds.leftBounds,     ColorPicker.Object.pointerBounds.rightBounds)  - 
                            ColorPicker.Object.pointerBounds.leftOffset,
                    
                    
                    top:    MathE.Map(ColorPicker.Object.aPointer.offset().top   +   ColorPicker.Object.aPointer.height(), 
                                    ColorPicker.Object.aPointerBounds.topBounds,     ColorPicker.Object.aPointerBounds.bottomBounds,
                                    ColorPicker.Object.pointerBounds.topBounds,      ColorPicker.Object.pointerBounds.bottomBounds)  - 
                            ColorPicker.Object.pointerBounds.topOffset 
                
                });     
                
                //Calculate the color from the new positions
                ColorPicker.Object.newHex = ColorPicker.CalculateHsvFromWall(ColorPicker.Object.aWall, ColorPicker.Object.aPointer);
                break;
        }
        
        
        
        //Now set our newly calculated color to their respective variables
        var color = HexToColor(ColorPicker.Object.newHex);
        ColorPicker.Object.newColor.r = color.r; 
        ColorPicker.Object.newColor.g = color.g;
        ColorPicker.Object.newColor.b = color.b;
        
        //Set the advanced sliders to the new color value
        ColorPicker.UpdateAdvancedSliders();
        
        //Change the preview to our new color
        ColorPicker.PreviewNewColor();
    }
        
    static StopMovingPointer(){
        
        //Remove the functions to the MouseMove/Up delegates
        //so the cursor will stop being moved
        EventMouseMove.delete(ColorPicker.MovePointer);
        EventMouseUp.delete(ColorPicker.StopMovingPointer);
    }
    
    
    static CalculateHsvFromWall(wall, pointer){
        
        //Get the position of the pointer
        //We need this to calculate the color
        var pos = GetPosition(pointer);
        
        //For the saturation we take the pointers x and negate
        //the wall's left offset, this will "normalize" it to
        //be proprotionate to the wall's width
        //When its at 0, then its all the way to the left
        //We will remap it to a range used by HSV, this is
        //usually either 1, or 100
        var sat = MathE.Map( pos.x - wall.offset().left, 
                            0, wall.width(),
                            0, 100
                           );
        
        //Do the same thing but for the Y position.
        //This time we need to invert the output.
        //This is because browsers go from top to bottom
        //in a positive manner.
        var val = MathE.Map( pos.y - wall.offset().top, 
                            0, wall.height(),
                            100, 0
                           );
          
        
        //Calculate the HSV, value which we will convert to HEX for preview
        ColorPicker.Object.newHSV.h = ColorPicker.CalculateValueFromBar(ColorPicker.Object.hueBar, ColorPicker.Object.hueHandle).P_Round(1, 0);
        ColorPicker.Object.newHSV.s = sat.P_Round(1, 0);
        ColorPicker.Object.newHSV.v = val.P_Round(1, 0);
        
    
        return HsvToHex(ColorPicker.Object.newHSV.h, 
                        ColorPicker.Object.newHSV.s, 
                        ColorPicker.Object.newHSV.v);
        
    }
    
    static MoveSliders(){    
        //Move the handles X position to that of the mouse, but
        //make sure the handle does not leave the bounds of the bar
        ColorPicker.Object.movingHandle.css({left: (MathE.Clamp(mouseX, 
                                                       ColorPicker.Object.sliderBounds.leftBounds, 
                                                       ColorPicker.Object.sliderBounds.rightBounds)) - ColorPicker.Object.movingSlider.offset().left - (ColorPicker.Object.movingHandle.width() / 2) 
                                   });
    }
    
    static StopMovingSlider(){
        
        //Stop referencing the slider/handle
        ColorPicker.Object.movingSlider = null;
        ColorPicker.Object.movingHandle = null;
        
        //Remove the functions from the delegates.
        EventMouseMove.delete(ColorPicker.MoveSliders);              //Handles moving
        EventMouseUp.delete(ColorPicker.StopMovingSlider);           //Handles stopping
        EventMouseMove.delete(ColorPicker.CalculateHue);             //Calculates hue
        EventMouseMove.delete(ColorPicker.CalculateTransparency);    //Calculates transparency
            
    }
    
    
    static CalculateValueFromBar(bar, handle){
        
        //Get the position of the pointer
        //We need this to calculate the color
        var pos = GetPosition(handle);   
        
        return MathE.Map(pos.x, bar.offset().left, bar.offset().left + bar.width(), Number(bar.attr('minvalue')), Number(bar.attr('maxvalue')));
    }
    
    static CalculateHue(){
        
        //Calculate the hue value from the slider
        ColorPicker.Object.newHSV.h = ColorPicker.CalculateValueFromBar( ColorPicker.Object.hueBar, ColorPicker.Object.hueHandle).P_Round(1, 0);
        
        //Convert the new HSV values to hex
        ColorPicker.Object.newHex = HsvToHex(ColorPicker.Object.newHSV.h, ColorPicker.Object.newHSV.s , ColorPicker.Object.newHSV.v);
        
        //Convert the HEX value to an RGB Color
        ColorPicker.Object.newColor = HexToColor(ColorPicker.Object.newHex);
        
        //Change the wall back tint
        ColorPicker.SetCursorPositionRelativeToValue();
        
        //Update the advanced sliders to the new value
        ColorPicker.UpdateAdvancedSliders();
        
        //Set the preview!
        ColorPicker.PreviewNewColor();
    }
       
    
    static CalculateTransparency(){
        //Calculate the transparency value from the slider
        ColorPicker.Object.transparency = ColorPicker.CalculateValueFromBar( ColorPicker.Object.transBar, ColorPicker.Object.transHandle).P_Round(0.01,0);
        
        //If the transparency is non-existant then
        //we will set the alpha channel to null
        //so it will return us an RGB value
        //instead of RGBA
        if(ColorPicker.Object.transparency == 1){
            ColorPicker.Object.newColor.a = null;
        }else{
            ColorPicker.Object.newColor.a = ColorPicker.Object.transparency;
        }
        
        //Set the advanced transparency slider to the new value and update it
        //::Because updating the slider while it is not visible causes problems
        //::we will update it when the advanced tab is opened
        $(ColorPicker.Object.aTransSlider).attr('value', (ColorPicker.Object.transparency * 100).P_Round(1,0) );
        //UpdateSliderProperties( $(ColorPicker.Object.aTransSlider));
        
        //Preview our new color!
        ColorPicker.PreviewNewColor();
    }
    
    
    //Updates the advanced sliders to the new value
    static UpdateAdvancedSliders(){
        
        switch(ColorPicker.Object.advancedMode){
            case "rgb":        
                ColorPicker.Object.rHueSlider.attr('value',      ColorPicker.Object.newColor.r);
                ColorPicker.Object.gSatSlider.attr('value',      ColorPicker.Object.newColor.g);
                ColorPicker.Object.bBrightSlider.attr('value',   ColorPicker.Object.newColor.b);        
            break;
            
            case "hsv":        
                ColorPicker.Object.rHueSlider.attr('value',      ColorPicker.Object.newHSV.h);
                ColorPicker.Object.gSatSlider.attr('value',      ColorPicker.Object.newHSV.s);
                ColorPicker.Object.bBrightSlider.attr('value',   ColorPicker.Object.newHSV.v);        
            break;
        }
        
        if(ColorPicker.Object.openTab == "adv"){
            UpdateSliderProperties( ColorPicker.Object.rHueSlider);
            UpdateSliderProperties( ColorPicker.Object.gSatSlider);
            UpdateSliderProperties( ColorPicker.Object.bBrightSlider);
        }
    }
    
    
    /*
    Sets the picker cursors to its proper position,
    relative to HSV values.
    Also handles the background tint.
    */
    static SetCursorPositionRelativeToValue(){
    
        ColorPicker.SetColorWallBackgroundColor();
        
        switch(ColorPicker.Object.openTab){
            case "main":
                //Move the main pointer into a position relative to the HSV value
                ColorPicker.Object.pointer.css({
                    left:   MathE.Map(ColorPicker.Object.newHSV.s, 
                                    0, 100,
                                    ColorPicker.Object.pointerBounds.leftBounds, ColorPicker.Object.pointerBounds.rightBounds)  - 
                            ColorPicker.Object.pointerBounds.leftOffset,
                    
                    
                    top:     MathE.Map(ColorPicker.Object.newHSV.v, 
                                    100, 0,
                                    ColorPicker.Object.pointerBounds.topBounds, ColorPicker.Object.pointerBounds.bottomBounds)  - 
                            ColorPicker.Object.pointerBounds.topOffset
                
                });    
                break;
                
            case "advanced":
                 //Move the main pointer into a position relative to the HSV value
                ColorPicker.Object.aPointer.css({
                    left:   MathE.Map(ColorPicker.Object.newHSV.s, 
                                    0, 100,
                                    ColorPicker.Object.aPointerBounds.leftBounds, ColorPicker.Object.aPointerBounds.rightBounds)  - 
                            ColorPicker.Object.aPointerBounds.leftOffset,
                    
                    
                    top:     MathE.Map(ColorPicker.Object.newHSV.v, 
                                    100, 0,
                                    ColorPicker.Object.aPointerBounds.topBounds, ColorPicker.Object.aPointerBounds.bottomBounds)  - 
                            ColorPicker.Object.aPointerBounds.topOffset
                
                });   
                break;
        }       
        
    }
    
    //Set the color wall to our newly created color
    static SetColorWallBackgroundColor(){    
    
        ColorPicker.Object.wall.css("background-color", HsvToHex(ColorPicker.Object.newHSV.h, 100 , 100) ); 
        ColorPicker.Object.aWall.css("background-color", HsvToHex(ColorPicker.Object.newHSV.h, 100 , 100) ); 
    }
    
    /*
    Sets the slider handle to the proper position
    Only used for the main tab's sliders, not the advanced
    @param value    : The value that determines the position
    @param bar      : The sliders bar element
    @param handle   : The sliders handle element
    @param min      : The sliders minimum value
    @param max      : The sliders maximum value
    @param rel      : The element which the bar's position is relative to
    */
    static SetSliderRelativeToValue(value, bar, handle, min, max, rel){
        
         //Calculate the position from the value
        //Since we may be dealing with font sizes 
        //we will extract the number from the value
        var position = MathE.Map(value, min, max, bar.offset().left, bar.offset().left + bar.width() );
        
        //Set the handle's position
        handle.css({left:  (position - ($(handle).width() / 2)) - bar.offset().left });
        
    }
    
    
    //Sets the preview circle to our new color
    static PreviewNewColor(){
            
        //Preview circle
        ColorPicker.Object.eNewColor.children().css("background-color", ColorPicker.Object.newColor.ToHTML());
        
        //Transparency bar
        ColorPicker.Object.transBar.find('.bg').css("background-image",                                          
                                           "linear-gradient(to right, rgba(0,0,0,0), " + 
                                            HsvToHex(ColorPicker.Object.newHSV.h, 
                                            ColorPicker.Object.newHSV.s , 
                                            ColorPicker.Object.newHSV.v) + ")" );     
        
        
        //Update the input/output text to the color value
        ColorPicker.UpdateInputOutputValue();
        
        //Checks to see if the current color is in the current favourite list 
        ColorPicker.CheckFavouriteColor();
          
       
    }
    
    static UpdateInputOutputValue(){
        
        //Convert the HSV values to HEX for the input/output textbox
        ColorPicker.Object.newHex = HsvToHex(ColorPicker.Object.newHSV.h, ColorPicker.Object.newHSV.s , ColorPicker.Object.newHSV.v);
        
        //Set the input so we can retrive an RGB/A or Hex value
        switch(ColorPicker.Object.valuetype.val()){
            case "RGBA":
                ColorPicker.Object.valueinput.val(ColorPicker.Object.newColor.ToHTML());
                break;
            case "HEX":
                ColorPicker.Object.valueinput.val(ColorPicker.Object.newHex);
                break;
        }
    }
    
    
    //Creates all the colors that you can choose from.
    //Grabs colors from ColorData.js
    static PopulatePalettes(){
        
        
        for(var i = 0; i < Colors["basic"].length; i++){
            ColorPicker.CreateColorElement($('[palette=basic]'), Colors["basic"][i]);
        }
        
        for(var i = 0; i < Colors["w3"].length; i++){
            ColorPicker.CreateColorElement($('[palette=w3]'), Colors["w3"][i]);
        }
        
        for(var i = 0; i < Colors["extended"].length; i++){
            ColorPicker.CreateColorElement($('[palette=extended]'), Colors["extended"][i]);
        }
        
        
        //Because the basic and simple palette have so little colors
        //I decided to combine them into just the basic palette
         for(var i = 0; i < Colors["simple"].length; i++){
            ColorPicker.CreateColorElement($('[palette=basic]'), Colors["simple"][i]);
            //ColorPicker.CreateColorElement($('[palette=simple]'), Colors["simple"][i]);  
        }    
        
        //Load user palettes
        ColorPicker.LoadLocalPalettes();
        
        ColorPicker.ActivateFavourite('favourite');
        
    }
    
    
    
    
    //Somethings need to be called when certain tabs are active,
    //this dis-allows us to use the global sub-menu script for changing tabs
    static SetupTabControl(){
        //Setting up the tab events to swap sub-menus
        $('[cp-sub-menu-tab]').on('click', function(){
            
            
            //Create a blank variable to store which sub-menu
            var sm = [];
            
            //"unpresses" the tabs, visually
            $('[cp-sub-menu-tab]').removeClass('active');
            
            //If the sub-menu-tab attribute is null that means we
            //are looking at one of the child elements.
            //So lets grab the correct one
            if($(this).attr('cp-sub-menu-tab') == null){
                //The closest element with the sub-menu-tab attribute is the element we want
                //Grab the sub-menu from the attribute
                //The button might access 2 classes, first we remove any spaces, 
                //and then split by a ","
                sm = $(this).closest('[cp-sub-menu-tab]').attr('cp-sub-menu-tab').replace(' ', '').split(',');
                
                //Makes the tab look pressed
                $(this).closest('[cp-sub-menu-tab]').addClass('active');
                
            }else{
                //This is the correct element, grab the sub-menu
                //The button might access 2 classes, first we remove any spaces, 
                //and then split by a ","
                sm = $(this).attr('cp-sub-menu-tab').replace(' ', '').split(',');  
                
                //Makes the tab look pressed
                $(this).addClass('active');
            }
            
            
            
            //Now we need to toggle the sub-menu visibility.
            //To find them we will go up to the menu, and then go back down
            //looking for the sub-menus
            $.each($(this).closest('[menu]').find('[cp-sub-menu]'), function(index, value){
                
                //Each sub-menu we will begin by removing the show class
                //This is what makes the menu visible
                $(value).removeClass('show');
                
                //We will split up the sub-menus as well.
                //Currently is not in use, but may be handy in the future
                var csm = $(value).attr('cp-sub-menu').replace(' ', '').split(',');
                
                //If the sub-menu is matching the tab we clicked
                //then we will add the class.   
                //if(sm.indexOf($(value).attr('sub-menu')) != -1){
                //If anything from either sub-menu is matching.
                if(csm.MatchAny(sm)){
                    
                    //Make sure the sub-menu is visible
                    $(value).addClass('show');
                    
                    //Refreshes elements whos changes were made while hidden
                    ColorPicker.OpenSubMenu($(value).attr('cp-sub-menu'));
                }
                
            });
        });
    }
    
    
    
    //Sets up certain elements that can only be done when the tab is open.
    static OpenSubMenu(submenu){
        //Precalculate the bounds,
        //we need to do this atleast once every time we move the cursor 
        //just incase the window has moved, or something has been resized
        ColorPicker.Object.aPointerBounds    =   ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.aWall,    ColorPicker.Object.aPointer);
        ColorPicker.Object.pointerBounds     =   ColorPicker.ClampingBounds(ColorPicker.Object.bg, ColorPicker.Object.wall,     ColorPicker.Object.pointer);
        
        switch(submenu){
            case "advanced":   
                ColorPicker.Object.openTab = "advanced";
                UpdateSliderProperties( ColorPicker.Object.rHueSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.gSatSlider);       //sliderinput.js
                UpdateSliderProperties( ColorPicker.Object.bBrightSlider);    //sliderinput.js     
                UpdateSliderProperties( ColorPicker.Object.aTransSlider);     //sliderinput.js
                break;
                
            case "main":
                ColorPicker.Object.openTab = "main";
                ColorPicker.SetSliderRelativeToValue(ColorPicker.Object.newHSV.h, ColorPicker.Object.hueBar, ColorPicker.Object.hueHandle, 0, 360, ColorPicker.Object.bg);
                ColorPicker.SetSliderRelativeToValue(ColorPicker.Object.transparency, ColorPicker.Object.transBar, ColorPicker.Object.transHandle, 0, 1,  ColorPicker.Object.bg);
                break;
                
        }
        
        
        //Set the color wall color position relative to that of the proper values
        ColorPicker.SetCursorPositionRelativeToValue();
    }
    
    /* 
    The eye dropper has not been completed due to the fact its almost impossible.
    What was planned is to grab the closest element that isn't transparent, the user would
    set the mode, which would grab either background-color or color.
    There was another mode planned, which was the image mode which would copy the image to
    a canvas and get its pixel data from that. It is a very hacky approach and where I stopped.
    Feel free to finish it, if you do please submit the changes to the github for this code.

    static EyedropperButtonEvent(){
        
        $(ColorPicker.Object.eyeButton).on('click', function(){
            
            //Make the eyedropper visible
            ColorPicker.Object.eyedropper.addClass('show');
            
            //Hide the cursor
            $('body').addClass('hide-cursor');
            
            //Handles moving the eyedropper
            EventMouseMove.add(ColorPicker.MoveEyedropper);   
            
            //Handles changing color modes
            EventKeyUp.add(ColorPicker.ChangeEyedropMove);
            
            //Creates the event to stop the eye dropper and grab the color
            //Adding it straight to the on click will activate it instantly
            EventMouseUp.add(ColorPicker.CreateStopEyeDropEvent);    
            
            ColorPicker.CreateImageCanvas();
            
        });
        
    }
    
    static MoveEyedropper(e){
        
        console.log(ColorPicker.Object.eyeMode);
        
        ColorPicker.Object.eyedropper.css({left : mouseX - ColorPicker.Object.bg.offset().left + 2,
                      top   : mouseY - ColorPicker.Object.bg.offset().top - ColorPicker.Object.eyedropper.height() - 2
                      })
        
        var color = null; //The color we will grab from an element
        
        //We will grab the color from different parts of the element 
        //depending on the mode thats been set    
        switch(ColorPicker.Object.eyeMode){
            case "auto":
            
            brea;
        
            case "background-color":            
            case "color":
                color = GetNonTransParentColor(e.target, ColorPicker.Object.eyeMode);            
                ColorPicker.Object.eNewColor.children().css("background-color", color);
                break;
            case "gradient":
                break;
            case "image":
                
                ColorPicker.DisplayImageOnCanvas($('#meta_thumbnail'),  'url(News/thumbs/missing_thumbnail.svg)');
                
                rgb = ColorPicker.GetPixelDataFromImageCanvas();
                /*
                var canvas = document.createElement("canvas");
                canvas.width = e.target.width;
                canvas.height = e.target.height;
                canvas.getContext('2d').drawImage(e.target, 0, 0);            
                break;
                //
                
                //News/thumbs/missing_thumbnail.svg
        }
        
    }
    
    static CreateImageCanvas(){
        var ColorPicker.Object.eyecanvas = document.createElement('canvas');
        var ColorPicker.Object.canvasContext = ColorPicker.Object.eyecanvas.getContext('2d');
        var ColorPicker.Object.canvasImage = new Image();
        
        $('body').append(ColorPicker.Object.eyecanvas);
        
        $(ColorPicker.Object.eyecanvas).addClass('eyedropper-canvas');
        
    
    }
    
    /*
    Displays the canvas with an image on it, overlapping the
    element while in eyedropper mode.
    @param elem : The element which the canvas is overlaying
    @param src  : The image source
    //
    static DisplayImageOnCanvas(elem, src){    
        
        $(ColorPicker.Object.eyecanvas).css({
            width   :   $(elem).width(),
            height  :   $(elem).height(),
            left    :   $(elem).offset().left,
            top     :   $(elem).offset().top;
        });
        
        ColorPicker.Object.canvasImage.src = src;
        ColorPicker.Object.canvasContext.drawImage(ColorPicker.Object.canvasImage.src, 0, 0);
    }
    
    static GetPixelDataFromImageCanvas(){
            return ColorPicker.Object.eyecanvas.getImageData(mouseX, mouseY, 1, 1).data;
    }
    
    //Changes the mode in which the eyedropper gets its color from
    static ChangeEyedropMove(e){
        
        switch(e.keyCode  || e.which){              
            case 66: ColorPicker.Object.eyeMode = "background-color";    break; //B
            case 67: ColorPicker.Object.eyeMode = "color";               break; //C
            case 71: ColorPicker.Object.eyeMode = "gradient";            break; //G
            case 73: ColorPicker.Object.eyeMode = "image";               break; //I
        }
    }
    
    static CreateStopEyeDropEvent(){
        
        //If we add the StopMoving event on the initial click
        //it will be activated instantly.
        //This is activated from the mouse up event which is after the click
        EventMouseClick.add(ColorPicker.StopMovingEyeDropper);   
        
        //Remove this event, no need for it anymore 
        EventMouseUp.delete(ColorPicker.CreateStopEyeDropEvent);   
    }
    
    static StopMovingEyeDropper(){
        
        //Shows the cursor
        $('body').removeClass('hide-cursor');
        
        EventMouseMove.delete(ColorPicker.MoveEyedropper);           //Handles moving
        EventMouseClick.delete(ColorPicker.StopMovingEyeDropper);    //Handles stopping, and getting the color
        EventKeyUp.delete(ColorPicker.ChangeEyedropMove);        //Handles changing color modes
        
        $(ColorPicker.Object.eyedropper).removeClass('show');
        
        ColorPicker.Object.eNewColor.children().css('background', '');
    }
    
    */
            
}

//The ColorPicker object, so you are able to reference it easily.
ColorPicker.Object;

//If the window does not exist, create it.
ColorPicker.CreateWindow();         