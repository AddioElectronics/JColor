//Replaces the elements tag with a new one.
//CREDIT : Sorry cant remember, someone on stackoverflow, although heavily edited by me.
$.extend({
    replaceTag: function (currentElem, newTagObj, keepProps, removeClass) {
        
        if(newTagObj.indexOf("<") != 0) 
            newTagObj = "<" + newTagObj;
        
        if(!newTagObj.endsWith(">")) 
            newTagObj += ">";
        
        //For some reason if the tag was already the new tag,
        //it would just wrap the old one around the new one, creating 2 elements.
        //It should probably be checked anyways.
        if(currentElem.tagName.toLowerCase() == newTagObj.replace(/\<(.*?)\>/g,"$1").toLowerCase()) return currentElem;
        
        var $currentElem = $(currentElem);
        var i, $newTag = $(newTagObj).clone();
        if (keepProps) {
            newTag = $newTag[0];
            newTag.className = currentElem.className;
            //newTag.classList = currentElem.classList;
            $.each(currentElem.attributes, function() {
            newTag.setAttribute(this.name, this.value);
            });

        }
        
        if(removeClass){
            $newTag.removeClass(newTag.tagName.toLowerCase());
        }
        
        $currentElem.wrapAll($newTag);        
        $currentElem.contents().unwrap();
        $currentElem.remove();
        
        return $newTag;
    }
});

//Replaces elements tag with a new one.
//CREDIT : Sorry cant remember, someone on stackoverflow.
$.fn.extend({
    replaceTag: function (newTagObj, keepProps, removeClass) {
        return this.each(function() {
            jQuery.replaceTag(this, newTagObj, keepProps, removeClass);
        });
    }
});


//Append, prepend, insert before, or insert after based on the position parameter.
$.extend({
    insertAtPosition: function(element, target, position){
        var elem = $(element);
        switch(position){
            default:
            case 0:
            case "append":
            case "bottom":
                $(target).append(elem);
                break;
            case 1:
            case "prepend":
            case "top":
                $(target).prepend(elem);
                break;                
            case 2:
            case "before":
                elem.insertBefore($(target));
                break;                
            case 3:
            case "after":
                elem.insertAfter($(target));
                break;
        }
        return elem;
                
    }
});

//Append, prepend, insert before, or insert after based on the position parameter.
$.fn.extend({
    insertAtPosition: function(target, position){
         return this.each(function() {
            jQuery.insertAtPosition(this, target, position);    
         });
    }
});

//Returns an array of all the keys in an object.
$.extend({
    keys:    function(obj){
        var a = [];
        $.each(obj, function(k){ a.push(k) });
        return a;
    }
})

//Converts the object into an array
$.extend({
    ToArray:    function(obj){
        var values = [];
        $.each(Object.keys(obj), function(index, value){
            values.push(obj[value]);
        });  
        return values;
    }
})


