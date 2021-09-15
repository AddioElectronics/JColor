//Will return true if there is a matching
//value in either array
Array.prototype.MatchAny = function(b){
            
        if(!Array.isArray(b))
            b = [b];
    
    //Some will run the function with each value
    //until it returns true or exhausts all its resources
    return this.some(function(value){
        //If there is a match it will return true
        return b.indexOf(value) != -1;
    });
}

//Will return true if there is a matching
//value in either array
function MatchAny(a, b){
    
      if(!Array.isArray(a))
            a = [a];
        
        if(!Array.isArray(b))
            b = [b];
    
    //Some will run the function with each value
    //until it returns true or exhausts all its resources
    return a.some(function(value){
        //If there is a match it will return true
        return b.indexOf(value) != -1;
    });
}

//Makes sure there is no duplicate items in the array.
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

//Makes sure there is no duplicate items in the array.
Array.prototype.Merge = function(b) {
    var r = this;    
        for(const c in b){
            r.push(c);
        }   
        return r;
};

class ArrayExt extends Array{
    
    static Merge(a, b){
        var r = a;
        for(const c in b){
            r.push(c);
        }   
        return r;
    }
    
    static CreatePopulate(length, value){
        
        var a = new Array(length);
        
        for(var i = 0; i < a.length; i++){
            a[i] = value;
        }
        return a;
    }
    
    static MatchAny(a, b){
        
        if(!Array.isArray(a))
            a = [a];
        
        if(!Array.isArray(b))
            b = [b];
        
        //Some will run the function with each value
        //until it returns true or exhausts all its resources
        return a.some(function(value){
            //If there is a match it will return true
            return b.indexOf(value) != -1;
        });
    }
}