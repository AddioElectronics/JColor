var EventWindowResize = new Set();

//Create the event to call our functions.
$(window).resize(CallEventWindowResize);

function CallEventWindowResize(e){  
    EventWindowResize.Invoke(e); 
}

