var EventMouseClick = new Set();

//Create the event to call our functions.
$(document).on('click',CallEventMouseClick);

function CallEventMouseClick(e){  
    EventMouseClick.Invoke(e);    
}

