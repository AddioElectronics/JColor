var EventKeyPress = new Set();

//Create the event to call our functions.
$(document).keypress(CallEventKeyPress);

function CallEventKeyPress(e){  
    EventKeyPress.Invoke(e);  
}

