var cards = new Array;
var map = new Array;
var enemy = new Array;
var boss = new Array;
var demoMap = [[0],[2],[7],[2],[4],[7],[4],[7],[2],[8]];
var startATK = [0,2,3,4,6];
var startDEF = [0,1,5,7,11];
var startBAL = [0,1,3,4,5];
var playerSet;
var pMAXHP = 15;
var pGUARD = 0;
var pATKU = 0;
var pATKPERM = 0;
var BossPick = [];
var Enemy;

/*
    0 - Room Position
    1 - Player Health
    2 - Event Condition
        Get Room Position value at Index
    3 - Action Flag
        0 - SET PLAYER DECK FLAG
        1 - NORMAL CONTINUE FLAG
        2 - PLAYER SELECTION FLAG
        3 - PLAYER IN COMBAT FLAG
        4 - DEEP CHOICE FLAG
*/
var states = [0,15,0,0];

$.getJSON("https://coatedcap.github.io/FinalPush/code/card.json",function(d){
    d['card'].forEach(function (F){
        /*
            STRUCTURED BY:
            ID, NAME, TYPE, POWER, SPECIAL, TARGET, EFFECT, RARITY
            ID is minorly redundant as they are in order in JSON and are 0 structured
        */
        cards.push([F["id"],F["name"],F["type"],F["power"],F["special"],F["target"],F["effect"],F["rarity"]]);
    });
});
$.getJSON("https://coatedcap.github.io/FinalPush/code/map.json", function(da){
    da['room'].forEach(function (d){
        /*
            STRUCTURED BY:
            roomID, event
        */
        map.push([d["roomID"],d["event"]]);
    });
});
$.getJSON("https://coatedcap.github.io/FinalPush/code/enemy.json",function(dat){
    dat['enemy'].forEach(function(E){
        /*
            STRUCTURED BY:
            name, hp, style, set
            ID is implicit through order, but should be considered later
            SET may end up being redundant data as for this project, they will be limited to healing, guarding and attacking.
        */
        enemy.push([E["name"],E["hp"],E["style"],E["set"]]);
    });
    dat['boss'].forEach(function(B){
        boss.push([B["name"],B["hp"],B["style"],B["set"]])
    });
    let rng = Math.round(Math.random());
    let iCho = boss[rng];
    console.log(rng);
    BossPick.push(boss[rng]);
    BossPick.push(boss[rng][1]+0);
    console.log(BossPick);

    
});

function calculateBoon(){
    if(states[1] / pMAXHP >= 0.7){
        pMAXHP+=5;
        let curHP = pMAXHP;
        states[1]= curHP;
    }
    else{
        let curHP = pMAXHP;
        states[1] = curHP;
    }
}
function newCard(){

}

function gamePage(){
    var f = document.forms.cTerm;
    var userinput = f.startGame.value;
    userinput=userinput.toLowerCase();
    if (userinput.search("start") != -1){
        window.open("https://coatedcap.github.io/FinalPush/game.html", '_blank');
    }
}

function getRoomEvent(){
    //console.log("GRE function call");
    var obj = map[states[0]];
    //console.log("Mapping at " + obj[0]);
    return obj[0];
}
function sendMSG(){
    console.log("Init Message Handler");
    let mapID = getRoomEvent();
    console.log("MapPos: "+states[0]+"\tMapID: "+mapID+ "\tFlag: "+states[3]);
    let f = document.forms.c_term;
    let userinput = f.c_input.value;
    let modinput=userinput.toLowerCase();
    console.log(mapID);
    let textarea = document.getElementById('displayTerminal');
    f.c_input.value='';
    if (modinput != ''){
        if (modinput.search("start") != -1 && states[0]==0){
            console.log("Running Start Sequence");
            textarea.value = "\t>  "+userinput.toUpperCase()+"\r\n";
            textarea.value += "\tChoose your deck:\r\n"+"\t\tAttacker [1]      Defender [2]      Balanced [3]\r\n";
            states[3]=2;
            console.log("Flag set: 2");
        }
        else if (modinput.search("move") != -1){
            console.log("Processing Move Command");
            if (states[3] != 1){
                console.log("Produce Move Flag error");
                textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tYou cannot move to the next Kilometer until the current event is resolved.\r\n";
            }
            else{
                console.log("Good Move Flag");
                states[0]+=1;
                textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tMoving to next Kilometer ["+states[0]+"].\r\n";
                switch(mapID){
                    case 2:
                        textarea.value+="\t\tYou come across an Organization Checkpoint. You can see other patrollers resting or re-arming themselves.\r\n\t\tYou can use this opportunity to rest up and increase your vitality (increase MAX HP) or add a new random card to your deck.\r\n\t\tMake a selection:\tRecover Health, Increase MAX HP if current HP > 70% of MAX HP [1]\tAdd new card to deck [2]\r\n";
                        states[3]=2;
                        console.log("Flag set: 2");
                        break;
                    case 4:
                        textarea.value+="\t\tYou come across one of many Sacrifice Altars within the Tunnel. These show up randomly even on the same route.\r\n\t\tIt is said that through a sacrifice of flesh, one can become stronger than they were.\r\n\t\tMake a selection:\tApproach Altar [1]\tMove onto the next Kilometer [2]\r\n";
                        states[3]=2;
                        console.log("Flag set: 2");
                        break;
                    /*
                    case 5:
                        break;
                    */
                    case 7:
                        textarea.value+="\t\tYour target radar begins to ping rapidly as a perceived hostile is rapidly approaching.\r\n\t\tHostiles are relentless and will chase you forever. You have no other choice but to fight.\r\n\t\tPrepare for Combat!\r\n";
                        states[3]=3
                        console.log("Flag set: 3");
                        break;
                    case 8:
                        textarea.value+="\t\tYou approach a Great Door that leads into the next patrol depths. However, every Great Door is defended by a Powerful Guardian.\r\n\t\tYou hear and feel a great impact from behind...\r\n\t\tPrepare for Combat!\r\n";
                        states[3]=3;
                        console.log("Flag set: 3");
                        break;
                    default:
                        break;
                }
            }
        }
        else if (modinput.search("use") != -1 && states[3]== 3){
            console.log("encounter type check");
            if(mapID == 7){

            }
            else if(mapID==8){

            }
        }
        else if (modinput.search("choose") != -1 && states[3]==2){
            // Primarily for selecting room event options
            let splits = modinput.slice(7).trim();
            switch(mapID){
                case 0:
                    console.log("Handle DECK selection")
                    if(splits == "1"){
                        console.log("Select Attack");
                        textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tAttacker Deck Chosen\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                        playerSet=startATK;
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    else if (splits == "2"){
                        console.log("Select Defend");
                        textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tDefender Deck Chosen\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                        playerSet=startDEF;
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    else if (splits = "3"){
                        console.log("Select Balance");
                        textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tBalanced Deck Chosen\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                        playerSet=startBAL;
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    else{
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tSelected option not recognized or not available.\r\n";
                    }
                    break;
                // This is a reward
                case 2:
                    // Accept Option 1 - Restore Health and if health is or greater than 70% of MXHP, increase MXHP by 5.
                    if(splits == "1"){
                        console.log("health restore + boon pick")
                        calculateBoon();
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    // Accept Option 2 - Add a new card to deck at random.
                    else if (splits == "2"){
                        console.log("get card event chosen");
                        newCard();
                        states[3]=1;
                        console.log("Flag set: 1");

                    }
                    // Reject Options
                    else if (splits == "3"){
                        console.log("reward event rejected")
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    else{
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tSelected option not recognized or not available.\r\n";
                    }
                    break;
                // This is a HP to reward trade
                case 4:
                    // Accept Exchange
                    if(splits == "1" && states[3]==2){
                        console.log("HP event chosen");
                        textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tYou approach the altar and place your hand on the offering bed. \r\n\t\tYour feet feel like lead and you fail to move them. You feel your hand fusing with the table. Suddenly, you hear it:\r\n\t\t\t\"Exchange a portion of full life for greater strength or a portion of your blood for the potential of greater ability\"\r\n\t\tMake a selection:\tGreater Strength (Increase Permanent Attack Bonus, but lose 20% of MAX HP) [1]\tPotential Ability (add random card to deck, but lose 20% of current HP) [2]\r\n";
                        states[3]=4;
                        console.log("Flag set: 4");

                    }
                    // Reject Exchange
                    else if (splits == "2"){
                        console.log("risk event rejected");
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou ignore the altar and move on with your patrol.\r\n";
                        states[3]=1;
                        console.log("Flag set: 1");

                    }
                    else if (states[3] == 4){
                        if (splits == "1"){
                            console.log("deep STRENGTH selected");
                            pMAXHP = pMAXHP*0.8;
                            if (states[1] >= pMAXHP){
                                states[1]=pMAXHP-0;
                            }
                            states[3]=1;
                            console.log("Flag set: 1");
                        }
                        else if (splits == "2"){
                            states[3]=1;
                            console.log("Flag set: 1");

                        }
                        else{
                            textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tSelected option not recognized or not available.\r\n";
                        }

                    }
                    else{
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tSelected option not recognized or not available.\r\n";
                    }
                    break;
                // This is a card to card exchange BUT I'M LAZY AND IT'S 9PM ON THE PENULTIMATE DAY
                /*case 5:
                    // Accept Exchange
                    if(splits == "1"){
                        console.log("");

                    }
                    // Reject Exchange
                    else if (splits == "2"){
                        states[3]=1;
                        console.log("set move flag 1");
                        
                    }
                    break;*/
                default:
                    break;
            }
        }
        else{
            textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tUNRECOGNIZED COMMAND.";
        }
    }
}

$(document).ready(function(){

})