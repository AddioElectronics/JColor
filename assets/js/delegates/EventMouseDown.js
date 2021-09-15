var EventMouseDown = new Set();

var isMouseDown = false;

//Create the event to call our functions.
$(document).mousedown(CallEventMouseDown);

function CallEventMouseDown(e){      
    isMouseDown = true;
    EventMouseDown.Invoke(e); 
}

