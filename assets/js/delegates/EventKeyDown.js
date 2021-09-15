var EventKeyDown = new Set();

//Create the event to call our functions.
$(document).keydown(CallEventKeyDown);

function CallEventKeyDown(e){  
    EventKeyDown.Invoke(e);  
}

