
$(document).ready(function(){
    $('#confirm').click(function(){
        $('#cancel').fadeOut();
        $('.intro').fadeOut();
        setTimeout(function(){
            document.getElementById('yep').innerHTML="Connecting...";
            setTimeout(function(){
                document.getElementById('yep').innerHTML="Connecting..";
                setTimeout(function(){
                    document.getElementById('yep').innerHTML="Connecting.";
                    setTimeout(function(){
                        document.getElementById('yep').innerHTML="Connecting";
                        setTimeout(function(){
                            document.getElementById('yep').innerHTML=">> ESTABLISH CONNECTION <<";
                        },750);
                    },1250);
                },1250);
            },1250);
        },1250);
        $('#confirm').fadeOut();
    });
    $('#cancel').click(function(){
        close();
    });
    $('#yep').click(function(){
        $('#status').fadeOut();
        $('.intro').fadeOut();
        setTimeout(function(){
            $('#infoScreen').fadeIn();
        },750);

    });
});
//free HTTP RQ
//let json_link = 'http://api.open-notify.org/astros.json?callback=?';
let json_link = 'https://coatedcap.github.io/astros.json';
$.getJSON(json_link, function(data) {
    var crafts = [];
    var cnums = [];
    var belongsto = [];
    data['people'].forEach(function (d){
        if (!crafts.includes(d['craft'])){
            crafts.push(d['craft']);
            cnums.push(0);
            belongsto.push([]);
        }
        if(crafts.includes(d['craft'])){
            cnums[crafts.indexOf(d['craft'])]+=1;
            belongsto[crafts.indexOf(d['craft'])].push(d['name']);
        }
    });
    // This is only suitable when two ships are involved
    // It can be generalized to creating more row divs and more breaks for mod2 columns.
    for (let i =0 ;i < crafts.length;i++){
        $("#crafts").append('<div class="ship '+crafts[i]+'"><h2>'+crafts[i]+' ('+cnums[i]+' members)</h2><br><ul class="list '+crafts[i]+'"></ul></div>');
        var listID= '.list.'+crafts[i];
        for (let k = 0; k < belongsto[i].length;k++){
            $(listID).append('<li>'+belongsto[i][k]+'</li>');
        }
    }
});

// message: "success"
/* people:
    Index{
        name:
        craft:
    }
*/
// member: Int