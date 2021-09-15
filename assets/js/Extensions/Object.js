//Jquery interferes while creating Object prototypes as seen commented below.
//To get around this we must define it this way.

/*
Inserts a key and property from an object into the calling object,
but only if the key is non existant.
If the key does exist, if merge is true then it will merge the keys together,
depending on the object type.
Merge can also be an array, so you can choose which keys you would like to merge.
If merge is an array, make sure it is the same length as key.
*/
Object.defineProperty(Object.prototype, "InsertValues", {
    value : function(fromObj, key, merge, tree){
    
            //We may not be able to pass the actual object we want (mainly in loops),
            //but if we can pass the key to the object we really want,
            //we can check to see if the object exists below.
            //If it does we will grab it, and if not then we will just return the initial object.
            if(arguments.length > 2){
                fromObj = fromObj.FindChild(tree);
                if(fromObj == null)
                    return this;
            }

            var m = false;
        
            if(arguments.length > 2){
                if(merge === true){
                    m = true;
                }else if(Array.isArray(merge)){
                    m = merge;
                }
            }
        
            if(!Array.isArray(key)){
                if(!(key in this) && key in fromObj){
                    this[key] = fromObj[key];
                }else if(key in this && key in fromObj){
                    if(Array.isArray(m)){
                        if(m[0])
                            ObjectExt.Merge(this[key], fromObj[key], true);
                    }else{
                        if(m)
                            ObjectExt.Merge(this[key], fromObj[key], true);
                    }
                }
            }else{
                for(var i = 0; i < key.length; i++){
                    if(!(key[i] in this) && key[i] in fromObj){
                        this[key[i]] = fromObj[key[i]];
                    }else if(key[i] in this && key[i] in fromObj){
                        if(Array.isArray(m)){
                            if(m[i])
                                ObjectExt.Merge(this[key[i]], fromObj[key[i]], true);
                    }else{
                            if(m)
                                ObjectExt.Merge(this[key[i]], fromObj[key[i]], true);
                        }
                    }
                }
            }
            return this;
        },
    enumerable : false
});

/*
Object.prototype.InsertValueIfAbsent = function(fromObj, key){
    
    if(!Array.isArray(key)){
        if(!(key in this) && key in this){
            this[key] = fromObj[key];
        }
    }else{
        for(var i = 0; i < keys.length; i++){
            if(!(key[i] in this) && key[i] in this){
                this[key[i]] = fromObj[key[i]];
            }
        }
    }
    return this;
}
*/

Object.defineProperty(Object.prototype, "FindChild", {
    value : function(key){
            //this = content
            //key = "inputData.color.color"
            //
            //If we need to search a couple objects down (this.obj1.obj2)
            //We can search each level to see if they all exist,
            //by passing an array of strings to key.
            
            key = Array.isArray(key) ? key : [key];
            var o = this;
            
            
            //Every time the key(k) is in the object(o)
            //We can set the o to the object with the key
            //If we don't find a key that means it doesn't exist,
            //so we will return null.
            //When the loop is over, we will be left with the object we were looking for,
            //which was set to o, so we can return it.
            //Yes, its a bit confusing, especially to describe.
            for(var i = 0; i < key.length; i++){
                if(key[i] in o){
                    o = o[key[i]];
                }else{
                    return null;
                }
            }
            return o;
        },
    enumerable : false
});

Object.defineProperty(Object.prototype, "Count", {
    value : function(key){
            return Object.keys(this).length;
        },
    enumerable : false
});

Object.defineProperty(Object.prototype, "isObject", {
    value : function(){
            return (!!this) && (this.constructor === Object);
        },
    enumerable : false
});

/*
Object.defineProperty(Object.prototype, "FindChild", {
    value : function(tree){
            var obj = this;
            var i = 0;
            var foundObject = false;
        
            if(!Array.isArray(tree))
                tree = [tree];
        
            while(i < tree.length && tree[i] in obj){
                obj = obj[tree[i]];
                
                if(i == tree.length - 1){
                    foundObject = true;
                    break;
                }else{
                    i++;
                }
            }
        
            if(foundObject)
                return obj;
            else
                return null;
        },
    enumerable : false
});
*/

class ObjectExt extends Object{
    
    static InsertValueIfAbsent(toObj, fromObj, key, tree){

        
        //We may not be able to pass the actual object we want (mainly in loops),
        //but if we can pass the key to the object we really want,
        //we can check to see if the object exists below.
        //If it does we will grab it, and if not then we will just return the initial object.
        if(arguments.length > 3){
            fromObj = fromObj.FindChild(tree);
            if(fromObj == null)
                return toObj;
        }
    
        if(!Array.isArray(key)){
            if(!(key in toObj) && key in toObj){
                toObj[key] = fromObj[key];
            }
        }else{
            for(var i = 0; i < keys.length; i++){
                if(!(key[i] in toObj) && key[i] in toObj){
                    toObj[key[i]] = fromObj[key[i]];
                }
            }
        }
        return toObj;
    }
    
    /*
    Merges 2 objects keys and values together.
    Note: If they both have the same keys, b will overwrite a, unless merge is true.
    @param merge : [Boolean] When true, if "a" and "b" have matching keys, if the type of the value is an Array, Object, Set or Map, they will be merged as well.
    */
    static Merge(a, b, merge){
         
        Debug.Log("ObjectExt.Merge() :: {a.Count="+ (a != null ? a.Count() : "null") + ", b.Count="+ (b != null ? b.Count() : "null") +"}", "Set", 1);
        
        if(a == null && b == null)
            return null;
        
        var obj = {};   
        
        if(a != null){
            if(a.Count() > 0){
                $.each(a, function(key, value){
                    obj[key] = value;
                });
            }
        }
        
        if(b != null){
            if(b.Count() > 0){
                 $.each(b, function(key, value){
                     if(key in obj){
                         if(arguments.length > 2 && merge && obj[key].constructor === value.constructor){
                             if(Array.isArray(obj[key])){
                                 obj[key] = ArrayExt.Merge(obj[key], value);                          
                             }else if(typeof(obj[key]) == typeof(new Set())){
                                 obj[key] = SetExt.Merge(obj[key], value);                                 
                             }else if(typeof(obj[key]) == typeof(new Map())){
                                 obj[key] = MapExt.Merge(obj[key], value, true);  
                             }else if(obj[key].isObject() && value.isObject()){
                                 obj[key] = ObjectExt.Merge(obj[key], value, true);
                             }else{
                                 obj[key] = value;
                             }
                         }else{
                             obj[key] = value;
                         }                        
                     }else{
                        obj[key] = value;
                     }
                });
            }
        }
    
        return obj;
    }
    
    static InsertValues(toObj, fromObj, key, merge, tree){
    
            //We may not be able to pass the actual object we want (mainly in loops),
            //but if we can pass the key to the object we really want,
            //we can check to see if the object exists below.
            //If it does we will grab it, and if not then we will just return the initial object.
            if(arguments.length > 2){
                fromObj = fromObj.FindChild(tree);
                if(fromObj == null)
                    return toObj;
            }
        
            var m = false;
        
            if(arguments.length > 3){
                if(merge === true){
                    m = true;
                }else if(Array.isArray(merge)){
                    m = merge;
                }
            }
        
            if(!Array.isArray(key)){
                if(!(key in toObj) && key in fromObj){
                    toObj[key] = fromObj[key];
                }else if(key in toObj && key in fromObj){
                    if(Array.isArray(m)){
                        if(m[0])
                            ObjectExt.Merge(toObj[key], fromObj[key], true);
                    }else{
                        if(m)
                            ObjectExt.Merge(toObj[key], fromObj[key], true);
                    }
                }
            }else{
                for(var i = 0; i < keys.length; i++){
                    if(!(key[i] in toObj) && key[i] in fromObj){
                        toObj[key[i]] = fromObj[key[i]];
                    }else if(key[i] in toObj && key[i] in fromObj){
                        if(Array.isArray(m)){
                            if(m[i])
                                ObjectExt.Merge(toObj[key[i]], fromObj[key[i]], true);
                    }else{
                            if(m)
                                ObjectExt.Merge(toObj[key[i]], fromObj[key[i]], true);
                        }
                    }
                }
            }
            return toObj;
        }
}