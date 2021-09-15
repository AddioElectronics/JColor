Number.prototype.ToHex = function(){
    var hex = this.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

function ConvertToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
