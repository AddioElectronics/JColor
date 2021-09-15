class ErrorExt extends Error{
    
    //Credit : ELLIOTTCABLE
    static Line(){
        return (new Error).stack.split("\n")[4]
    }
    
    static LineShort(){
        var s = (new Error).stack.split("\n")[4].split("/");
        return s[s.length - 1];
    }
}