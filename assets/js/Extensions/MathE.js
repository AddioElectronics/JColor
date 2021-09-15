Number.prototype.Clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

/*
Number.prototype.P_Round = function(precision) {
    var factor = Math.pow(10, precision);
    return Math.round(this * factor) / factor;
}
*/

Number.prototype.P_Round = function(increment, offset) {
    return Math.ceil((this - offset) / increment ) * increment + offset;
}

class MathE{
    
    static Clamp  (num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
    
    static Map  (num, in_min, in_max, out_min, out_max) {
        return    (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    
    /*
    static P_Round(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }
    */
    
    static P_Round(number, increment, offset) {
        return Math.ceil((number - offset) / increment ) * increment + offset;
    }
}

/*
function Math()
    
    Math.prototype.Clamp = function (num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
    
     Math.prototype.Map = function (num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
}
*/


