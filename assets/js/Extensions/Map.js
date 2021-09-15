

class MapExt extends Map{
    
    static Merge(a, b, merge){
        Debug.Log("MapExt.Merge() :: {a.Count="+ (a != null ? a.Count() : "null") + ", b.Count="+ (b != null ? b.Count() : "null") +"}", "Set", 1);
        
        var m = new Map();   
        
        if((a == null && b == null) || (a.constructor != m.constructor || b.constructor != m.constructor)){
            Debug.Error("MapExt.Merge() :: Cannot merge maps, either "+a+" or "+b+" are either null, or not a Map.");
            return null;
        }
        
        if(a != null){
            if(a.Count() > 0){
                $.each(a, function(key, value){
                    m.set(key, value);
                });
            }
        }
        
        if(b != null){
            if(b.Count() > 0){
                 $.each(b, function(key, value){
                     if(m.has(key)){
                         if(arguments.length > 2 && merge && m[key].constructor === value.constructor){
                             if(Array.isArray(m[key])){
                                m[key] = ArrayExt.Merge(m[key], value);                         
                             }else if(typeof(m[key]) == typeof(new Set())){
                                 m.set(key, SetExt.Merge(obj[key], value));                                 
                             }else if(typeof(m[key]) == typeof(new Map())){
                                 m.set(key, MapExt.Merge(m[key], value, true));  
                             }else if(m[key].isObject() && value.isObject()){
                                 m.set(key, ObjectExt.Merge(m[key], value, true));
                             }else{
                                 m.set(key, value);
                             }
                         }else{
                             m.set(key, value);
                         }                        
                     }else{
                        m.set(key, value);
                     }
                });
            }
        }
    
        return m;
    }
}
