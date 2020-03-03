var button = document.getElementById("mainClick");

button.addEventListener('click', function() { 
    var id = setInterval(frame, 10);
    var x = 1;
    var popIn = true;

    function frame() {
        if(x > 1) {
            clearInterval(id);
        } else {
            if(popIn) {
                x -= .1;
                if(x <= .8) { 
                    popIn = false;
                }
            } else {
                x += .05;
            }
            
            button.style.transform = "scale(" + x + "," + x + ")";
        }
    }
});

$(function() {
    $('#mainClick').click(function() {
        $('#dolsTextContainer span').stop().animate( {
            left: (-100 + progressoClickBonus*10) + "%"
        }, 100);
        
        if(progressoClickBonus == 0) {
            $('#dolsBonus').stop().css("top", "150px").css("opacity", "1");

            $('#dolsBonus').text(multiplicadorClickBonus * dolsPorClick);
            
            $('#dolsBonus').css("display", "initial");
            $('#dolsBonus').animate({
                top: "-=150px",
                opacity: .5
            }, 800, function() {
                $('#dolsBonus').css("opacity", "0");
            });

            
        }
    });
});