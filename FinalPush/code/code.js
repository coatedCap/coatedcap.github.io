var cards = new Array;
var map = new Array;
var enemy = new Array;
var chank = "";
const maxBranch = 2;

var gameMap1 = [[0],[],[],[],[],[],[],[],[],[8]];

$.getJSON("https://coatedcap.github.io/FinalPush/card.json",function(d){
    d['card'].forEach(function (F){
        cards.push(F["id"]);
    });
    for (let i = 0; i < cards.length; i++){
        if (chank==""){
            chank = cards[i];
        }
        else{
            chank = chank + ","+cards[i];
        }
    }
    console.log(chank);
});
$.getJSON("https://coatedcap.github.io/FinalPush/map.json", function(da){
    da['room'].forEach(function (d){
        map.push([d['roomID'],d['weight'],d['connect']]);
        console.log(d['weight']);
        console.log(map.length);
    });
    /*
    map.forEach(function (f){
        console.log(f);
    });*/
    let numBranch = 0;
    let rate =[];
    let roomSet =false;
    for (let i = 1; i < 9; i++){
        //BEGIN ROLLING FOR ROOM TYPES
        let j = 0;
        while (!roomSet){
            let chance = Math.random();
            rate.push(chance);
            // If the rolled chance is BELOW the map weight, then select that map
            if (map[j][1] >= chance){
                // Determines if the room splits, maximum of 2 splits per map
                // Skip if exceeding branches
                // change to next room to attempt weighted rolling.
                if(map[j][2] > 1){
                    if (numBranch < maxBranch){
                        gameMap1[i]=[map[j][0],-1];
                        roomSet=true;
                        numBranch++;
                    }
                    continue;
                }
                // Then the room is not a splitter.
                // Exit this room.
                else{
                    gameMap1[i]=([map[j][0]]);
                    roomSet=true;
                    break;
                }
            }
            else{
                j++
                if(j>=map.length){
                    j=0;
                }
                continue;
            }
        }
        roomSet=false;
    }
    console.log(gameMap1);
    console.log(rate);
});
//$.getJSON("https://coatedcap.github.io/FinalPush/enemy.json",function(data){});
