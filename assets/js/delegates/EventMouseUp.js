var EventMouseUp = new Set();

//Create the event to call our functions.
$(document).mouseup(CallEventMouseUp);

function CallEventMouseUp(e){      
    isMouseDown = false;
    EventMouseUp.Invoke(e); 
}

