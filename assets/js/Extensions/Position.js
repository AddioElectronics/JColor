
GetPosition = function(e){
    return {x: $(e).offset().left + ($(e).width() / 2), y: $(e).offset().top + ($(e).height() / 2)}
}