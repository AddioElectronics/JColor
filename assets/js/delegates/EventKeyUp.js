var EventKeyUp = new Set();

//Create the event to call our functions.
$(document).keyup(CallEventKeyUp);

function CallEventKeyUp(e){  
    EventKeyUp.Invoke(e);  
}

