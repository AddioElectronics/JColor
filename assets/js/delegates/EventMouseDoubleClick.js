var EventMouseDoubleClick = new Set();

//Create the event to call our functions.
$(document).on('dblclick',CallEventMouseDoubleClick);

function CallEventMouseDoubleClick(e){  
    EventMouseDoubleClick.Invoke(e);    
}

