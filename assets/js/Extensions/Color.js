
class Color{

    //If you want to convert Html to Color, just pass "r"
    constructor(r, g, b, a){   
        
        if(g === undefined && b === undefined && a === undefined){
            var c = Color.ExtractColorFromHtml(r);            
            
            this.r = c.r;
            this.g = c.g;
            this.b = c.b;
            this.a = c.a;
        }else{
        
        this.r = r;
        this.g = g;
        this.b = b;
        
        if(a !== undefined)
            this.a = a;   
        else
            this.a = null;
        }
    }  
    
    static ColorNameToHex(name){        

        if (typeof named_colors[name.toLowerCase()] != 'undefined')
            return named_colors[name.toLowerCase()];

        return false;
    }
    
    static ColorToHex(color){
        if(color.a != 1)
            return RgbaToHex(color.r, color.g, color.b, color.a);
        else
            return RgbToHex(color.r, color.g, color.b);
    }

    static ColorToHsl(color){
        return RgbToHsl(color.r, color.g, color.b);
    }
    
    
    static ExtractColorFromHtml(h){
        //If there is a number sign that means
        //that the H is a hex value
        switch(h.indexOf('#')){
                
                //RGB/A
            case -1:
                //Now we just need to find out if its an RGB or RGBA
                //rgba needs to be first because rgb will always be true if rgba
                //causing rgba to never be selected
                //::May add other RGB text formats later::                
                if(h.indexOf('rgba') != -1){
                    //rgba
                    h = h.replace(/[^\d,.]/g, '').split(',');
                    return new Color(h[0], h[1], h[2], h[3]);
                }else if(h.indexOf('rgb') != -1){
                    //rgb
                    h = h.replace(/[^\d,.]/g, '').split(',');
                    return new Color(h[0], h[1], h[2]);                    
                }else{
                    
                    var named = Color.ColorNameToHex(h);                    
                    if(named != false)
                         return new Color(named);
                    
                    //If we were unable to extract a color value then 
                    //that means it was an invalid color and we will return null
                    return null;
                }
                
                break;
                
                //HEX
            default:
                return HexToColor(h);
                break;
        }
    }
    
    //Checks if a string is a color.
    static IsColor(color){
        //Should change these to Regexs, this is a quick hack.
        var c;
        try{
        c = new Color(color);
        }
        catch{ //If error is caught, then constructor was not able to create a color from the data.
            return false; 
        }
        return typeof c === typeof new Color('#000000');
    }

}

Color.prototype.ToHex = function(){
     if(this.a != 1)
            return RgbaToHex(this.r, this.g, this.b, this.a);
        else
            return RgbToHex(this.r, this.g, this.b);
}
    
//Converts color to HSL
//::Warning:: Range is from 0 to 1 for all values
Color.prototype.ToHsl = function(){
    return RgbToHsl(this.r, this.g, this.b);
}

//Converts color to HSV
//::Warning:: Range is from 0 to 1 for all values
Color.prototype.ToHsv = function(){
    return RGBtoHSV(this.r, this.g, this.b);
}

//Converts color to HSV Class
//::Warning:: Range is from 0 to 360 for hue,
//            and 1 to 100 for saturation and value
Color.prototype.ToHsvClass = function(){
    var hsv =  RgbToHsv(this.r, this.g, this.b);
    return new HSV( (hsv[0] * 360).P_Round(1,0), (hsv[1] * 100).P_Round(1,0), (hsv[2] * 100).P_Round(1,0));
}
    
//Convets color to HSL class
//::Warning:: Range is from 0 to 360 for hue,
//            and 1 to 100 for saturation and lightness
Color.prototype.ToHslClass = function(){
    var hsl = RgbToHsl(this.r, this.g, this.b);
    return new HSL((hsl[0] * 360).P_Round(1,0), (hsl[1] * 100).P_Round(1,0), (hsl[2] * 100).P_Round(1,0));
}

Color.prototype.ToHTML = function(){
    
    if(this.a == null){
        return 'rgb(' + this.r + ", " + this.g + ", " + this.b + ")";
    }else{
        return 'rgba(' + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }
}

class HSV{
    constructor(h, s, v){
        this.h = h;
        this.s = s;
        this.v = v;   
    }   
}

HSV.prototype.ToRgb = function(){
    return HSVtoRGB(this.h == 0 ? 0 : this.h / 360, 
                       this.s * 0.01, 
                       this.v * 0.01);   
}

HSV.prototype.ToColor = function(){
    var rgb = HSVtoRGB(this.h == 0 ? 0 : this.h / 360, 
                       this.s * 0.01, 
                       this.v * 0.01);   
    return new Color(rgb[0], rgb[1], rgb[2]);
}

HSV.prototype.ToHex = function(){
    var rgb = HSVtoRGB(this.h == 0 ? 0 : this.h / 360, 
                       this.s * 0.01, 
                       this.v * 0.01);    
    return RgbToHex(rgb[0], rgb[1], rgb[2]);
}

HSV.prototype.ToHsl = function(){
    return HSVtoHSL(this.h == 0 ? 0 : this.h / 360, 
                       this.s * 0.01, 
                       this.v * 0.01);   
}

HSV.prototype.ToHslClass = function(){
    var hsl = HSVtoHSL(this.h == 0 ? 0 : this.h / 360, 
                       this.s * 0.01, 
                       this.v * 0.01);   
    return new HSL(hsl[0] * 360, hsl[1] * 100, hsl[2] * 100);
}

function HsvToHex(h, s, v){
    var hsv = new HSV(h, s, v);
    return hsv.ToHex();
}


class HSL{
    constructor(h, s, l){
        this.h = h;
        this.s = s;
        this.l = l;   
    }   
}

HSL.prototype.ToRgb = function(){
    return HslToRgb(this.h, this.s, this.l);
}

HSL.prototype.ToColor = function(){
    var hex = HslToHex(this.h, this.s, this.l);
    return HexToColor(hex);
}

HSL.prototype.ToHex = function(){
    return HslToHex(this.h, this.s, this.l);
}

HSL.prototype.ToHsv = function(){
    return HSLtoHSV(this.h == 0 ? 0 : this.h / 360, 
                    this.s * 0.01, 
                    this.l * 0.01);
}

HSL.prototype.ToHsvClass = function(){
    var hsv = HSLtoHSV(this.h, this.s, this.l);
    return new HSV((hsv[0] * 360).P_Round(1,0), (hsv[1] * 100).P_Round(1,0), (hsv[2] * 100).P_Round(1,0));
}

function HslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 2.55), Math.round(g * 2.55), Math.round(b * 2.55)];
}

function HslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function HslToColor(h, s, l){
     var rgb = HslToRgb(h, s, l); 
    return new Color(rgb[0], rgb[1], rgb[2]);
}





function RgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

function RgbToHex(r, g, b) {
     return "#" +
  ("0" + parseInt(r,10).toString(16)).slice(-2) +
  ("0" + parseInt(g,10).toString(16)).slice(-2) +
  ("0" + parseInt(b,10).toString(16)).slice(-2);
}

function RgbaToHex(r, g, b, a) {
     return "#" +
  ("0" + parseInt(r,10).toString(16)).slice(-2) +
  ("0" + parseInt(g,10).toString(16)).slice(-2) +
  ("0" + parseInt(b,10).toString(16)).slice(-2) +
  ("0" + parseInt(a,10).toString(16)).slice(-2);
}


//Converts a HEX string to a Color Object.
function HexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result != null)
        return new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    else{
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), parseInt(result[4], 16))
        : null;
    }
         
}

//Converts a HEX string to
function HexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
     if(result != null)
        return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
    else{
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), parseInt(result[4], 16)]
        : null;
    }
}



function HSVtoHSL(h, s, v) {
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    var _h = h,
        _s = s * v,
        _l = (2 - s) * v;
    _s /= (_l <= 1) ? _l : 2 - _l;
    _l /= 2;

    return[h,s,l];
}

function HSLtoHSV(h, s, l) {
    if (arguments.length === 1) {
        s = h.s, l = h.l, h = h.h;
    }
    var _h = h,
        _s,
        _v;

    l *= 2;
    s *= (l <= 1) ? l : 2 - l;
    _v = (l + s) / 2;
    _s = (2 * s) / (l + s);

   return [h, s, v];
}


/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function RgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function ColorsAreEqual(a, b){
        
        //Check if a and b are a Color object, or html.
        //If neither return null.
        
        if(typeof a !== 'Color'){
            if(a.startsWith("rgb") || a.startsWith("#"))
                a = new Color(a);
            else
                return null;
        }
        
        if(typeof b !== 'Color'){
            if(b.startsWith("rgb") || b.startsWith("#"))
                b = new Color(b);
            else
                return null;
        }
    
        if(a.r !== b.r)
            return false;
        
        if(a.g !== b.g)
            return false;
        
        if(a.b !== b.b)
            return false;
        
        if(a.a !== b.a){            
            switch(a.a){
                case null:
                    if(b.a != 1)
                        return false;
                    break;
                case 1:
                    if(b.a != null)
                        return false;
                    break;
            }                
        }
        
        return true;
        
}
