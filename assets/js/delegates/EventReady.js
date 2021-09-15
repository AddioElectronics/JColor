var EventReady = new Set();

//Create the event to call our functions.
$(document).ready(CallEventReady);

function CallEventReady(e){  
    EventReady.Invoke(e);    
}

