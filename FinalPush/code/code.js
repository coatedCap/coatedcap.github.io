var cards = new Array;
var map = new Array;
var enemy = new Array;
var boss = new Array;
var demoMap = [[0],[2],[7],[2],[4],[7],[4],[7],[2],[8],[-1]];
var startATK = [0,2,3,4,6];
var startDEF = [0,1,5,7,11];
var startBAL = [0,1,3,4,5];
var playerSet;
var pMAXHP = 15;
var pGUARD = 0;
var pATKU = 0;
var pATKPERM = 0;
var BossPick = [];
var currEnemy = [];
var grabE=false;
var cardTurn;

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
        5 - DEATH FLAG
        6 - GAME DONE FLAG
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
    //console.log(rng);
    BossPick.push(boss[rng]);
    BossPick.push(boss[rng][1]+0)
    BossPick.push(0);
    //console.log(BossPick);
});

function calculateBoon(){
    if(states[1] / pMAXHP >= 0.7){
        pMAXHP+=5;
        states[1]= pMAXHP+0;
    }
    else{
        states[1] = pMAXHP+0;
    }
}
function newCard(){
    let rat = Math.round(Math.random()*cards.length-1);
    if(rat > 11){
        rat = 11;
    }
    playerSet.push(rat);
}

function gamePage(){
    var f = document.forms.cTerm;
    var userinput = f.startGame.value;
    userinput=userinput.toLowerCase();
    if (userinput.search("start") != -1){
        window.open("https://coatedcap.github.io/FinalPush/game.html", '_blank');
    }
}
function drawCards(){
    var setTemp = [];
    do{
        let rng = Math.round(Math.random()*playerSet.length-1);
        if (rng >= playerSet.length){
            rng = playerSet.length-1;
        }
        setTemp.push(rng);
    }
    while(setTemp.length < 3);
    console.log(setTemp);
    return setTemp;
}
function generateCombatScene(){
    cardTurn = drawCards();
    let textarea = document.getElementById("displayTerminal");
    textarea.value += "\r\n\t\tThe C.U. Network has chosen the following cards for you:\r\n";
    cardTurn.forEach(index => {
        textarea.value += "\t\t"+cards[index][1]+"\r\n";
    });
    textarea.value += "\t\tUse a Card by executing the USE [Card ID] command.\r\n";

}

function parseEnemyCard(cardID){
/*
STRUCTURED BY:
ID 0, NAME 1, TYPE 2, POWER 3, SPECIAL 4 (0,5,6), TARGET 5, EFFECT 6 [], RARITY 7
ID is minorly redundant as they are in order in JSON and are 0 structured
*/
    let textarea = document.getElementById("displayTerminal");
    let cardInfo = cards[cardID];
    let effects = cardInfo[6];
    let damageSum = 0;
    textarea.value += "\t\tThrough the card "+cardInfo[1]+", you ";
    // No specials
    if (cardInfo[4] == 0){
        if(cardInfo[5]=="enemy"){
            damageSum = cardInfo[3] + pATKPERM + pATKU;
            shieldDown = currEnemy[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+currEnemy[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                currEnemy[1] = currEnemy[1] + shieldDown; 
                currEnemy[2] = 0;
            }
            else{
                currEnemy[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
        }     
        // self presume
        else{
            switch(effects){
                case "pwr":
                    pATKU += cardInfo[3];
                    break;
                case "def":
                    pGUARD+=cardInfo[3];
                    break;
                case "heal":
                    states[1]+=cardInfo[3];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                default:
                    break;
            }
        } 
    }
    // Dual Effect Specials
    else if (cardInfo[4]== 5){
        if(cardInfo[5]=="enemy"){
            damageSum = cardInfo[3] + pATKPERM + pATKU;
            shieldDown = currEnemy[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+currEnemy[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                currEnemy[1] = currEnemy[1] + shieldDown; 
                currEnemy[2] = 0;
            }
            else{
                currEnemy[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
            switch(effects[1]){
                case "def":
                    pGUARD+=effects[2];
                    break;
                default:
                case "heal":
                    states[1]+=effects[2];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                    break;
            }
        }
        // self presume and is card 11
        else{
            pGUARD+=cardInfo[3];
            switch(effects[1]){
                case "def":
                    pGUARD+=cardInfo[3];
                    break;
                default:
                case "heal":
                    states[1]+=effects[2];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                    break;
                case "pwr":
                    pATKU+=2;
                    break;
            }
        }
    }
    // Repeated Strike Special
    else if (cardInfo[4]==6){
        if(cardInfo[5]=="enemy"){
            damageSum = (cardInfo[3] + pATKPERM + pATKU)*effects[1];
            shieldDown = currEnemy[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+currEnemy[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                currEnemy[1] = currEnemy[1] + shieldDown; 
                currEnemy[2] = 0;
            }
            else{
                currEnemy[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
        }
    }
    textarea.scrollTop = textarea.scrollHeight;
}

function enemyRetaliate(e_type){
    /*
        STRUCTURED BY:
        name, hp, style, set
        ID is implicit through order, but should be considered later
        SET may end up being redundant data as for this project, they will be limited to healing, guarding and attacking.
    */
   var textarea = document.getElementById("displayTerminal");
    if(e_type == 0){
        if (currEnemy[0][2] == "defensive"){
            let decision = Math.round(Math.random()*10);
            // defend
            if (decision >= 4){
                textarea.value += "\t\tThe " +currEnemy[0][0]+" guards itself and gains 3 shielding\r\n.";
                currEnemy[2] += 3;
            }
            // heal
            else if (decision < 4 || decision >= 2){
                textarea.value += "\t\tThe " +BossPick[0][0]+" heals itself for 2 HP.\r\n";
                currEnemy[1] += 2;
            }
            // attack
            else if (decision < 2){
                textarea.value += "\t\tThe " +currEnemy[0][0]+" attacks and deals ";
                outgoing = (2 + Math.round(Math.random()*2)+1);
                guarded = pGUARD - outgoing;
                if(guarded < 0){
                    textarea.value += outgoing+"shield damage and "+(guarded*-1)+" health damage.\r\n";
                    states[1] = states[1] + guarded;
                    pGUARD=0;
                }
                else{
                    textarea.value += outgoing+" shield damage.\r\n";
                    pGUARD = guarded;
                }

            }
        }
        else if (currEnemy[0][2] =="normal"){
            let decision = Math.round(Math.random()*10);
            // attack 
            if (decision >= 6){
                textarea.value += "\t\tThe " +currEnemy[0][0]+" attacks and deals ";
                outgoing = (2 + Math.round(Math.random()*2)+1);
                guarded = pGUARD - outgoing;
                if(guarded < 0){
                    textarea.value += outgoing+"shield damage and "+(guarded*-1)+" health damage.\r\n";
                    states[1] = states[1] + guarded;
                    pGUARD=0;
                }
                else{
                    textarea.value += outgoing+" shield damage.\r\n";
                    pGUARD = guarded;
                }
            }
            // heal
            else if (decision < 6 || decision >= 3){
                textarea.value += "\t\tThe " +currEnemy[0][0]+" heals itself for 2 HP.\r\n";
                currEnemy[1] += 2;

            }
            // defend
            else if (decision < 3){
                textarea.value += "\t\tThe " +currEnemy[0][0]+" guards itself and gains 3 shielding\r\n.";
                currEnemy[2] += 3;

            }
        }
    }
    else if(e_type == 1){
        if (BossPick[0][2] == "defensive"){
            let decision = Math.round(Math.random()*10);
            // defend
            if (decision >= 4){
                textarea.value += "\t\tThe " +BossPick[0][0]+" guards itself and gains 3 shielding\r\n.";
                BossPick[2]+=3;
            }
            // heal
            else if (decision < 4 || decision >= 2){
                textarea.value += "\t\tThe " +BossPick[0][0]+" heals itself for 3 HP.\r\n";
                BossPick[1]+=3;

            }
            // attack
            else if (decision < 2){
                textarea.value += "\t\tThe " +BossPick[0][0]+" attacks and deals ";
                outgoing = (3 + Math.round(Math.random()*2)+1);
                guarded = pGUARD - outgoing;
                if(guarded < 0){
                    textarea.value += outgoing+" shield damage and "+(guarded*-1)+" health damage.";
                    states[1] = states[1] + guarded;
                    pGUARD=0;
                }
                else{
                    textarea.value += outgoing+" shield damage.\r\n";
                    pGUARD = guarded;
                }

            }
            
        }
        else if (BossPick[0][2] =="normal"){
            let decision = Math.round(Math.random()*10);
            // attack
            if (decision >= 5){
                textarea.value += "\t\tThe " +BossPick[0][0]+" attacks and deals ";
                outgoing = (3 + Math.round(Math.random()*2)+1);
                guarded = pGUARD - outgoing;
                if(guarded < 0){
                    textarea.value += outgoing+" shield damage and "+(guarded*-1)+" health damage.";
                    states[1] = states[1] + guarded;
                    pGUARD=0;
                }
                else{
                    pGUARD = guarded;
                    textarea.value += outgoing+" shield damage.\r\n";
                }
            }
            // heal
            else if (decision < 5 || decision >= 3){
                textarea.value += "\t\tThe " +BossPick[0][0]+" heals itself for 2 HP.\r\n";
                BossPick[1]+=3;

            }
            // defend
            else if (decision < 3){
                textarea.value += "\t\tThe " +BossPick[0][0]+" guards itself and gains 3 shielding\r\n.";
                BossPick[2] += 3;

            }

        }

    }

}

function parseBossCard(cardID){
/*
STRUCTURED BY:
ID 0, NAME 1, TYPE 2, POWER 3, SPECIAL 4 (0,5,6), TARGET 5, EFFECT 6 [], RARITY 7
ID is minorly redundant as they are in order in JSON and are 0 structured
*/
    let textarea = document.getElementById("displayTerminal");
    let cardInfo = cards[cardID];
    let effects = cardInfo[6];
    let damageSum = 0;
    textarea.value += "\t\tThrough the card "+cardInfo[1]+", you ";
    // No specials
    if (cardInfo[4] == 0){
        if(cardInfo[5]=="enemy"){
            damageSum = cardInfo[3] + pATKPERM + pATKU;
            shieldDown = BossPick[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+BossPick[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                BossPick[1] = BossPick[1] + shieldDown; 
                BossPick[2] = 0;
            }
            else{
                BossPick[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
        }     
        // self presume
        else{
            switch(effects){
                case "pwr":
                    pATKU += cardInfo[3];
                    break;
                case "def":
                    pGUARD+=cardInfo[3];
                    break;
                case "heal":
                    states[1]+=cardInfo[3];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                default:
                    break;
            }
        } 
    }
    // Dual Effect Specials
    else if (cardInfo[4]== 5){
        if(cardInfo[5]=="enemy"){
            damageSum = cardInfo[3] + pATKPERM + pATKU;
            shieldDown = BossPick[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+BossPick[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                BossPick[1] = BossPick[1] + shieldDown; 
                BossPick[2] = 0;
            }
            else{
                BossPick[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
            switch(effects[1]){
                case "def":
                    pGUARD+=effects[2];
                    break;
                default:
                case "heal":
                    states[1]+=effects[2];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                    break;
            }
        }
        // self presume and is card 11
        else{
            pGUARD+=cardInfo[3];
            switch(effects[1]){
                case "def":
                    pGUARD+=cardInfo[3];
                    break;
                default:
                case "heal":
                    states[1]+=effects[2];
                    if(states[1] > pMAXHP){
                        states[1] = pMAXHP+0;
                    }
                    break;
                case "pwr":
                    pATKU+=2;
                    break;
            }
        }
    }
    // Repeated Strike Special
    else if (cardInfo[4]==6){
        if(cardInfo[5]=="enemy"){
            damageSum = (cardInfo[3] + pATKPERM + pATKU)*effects[1];
            shieldDown = BossPick[2] - damageSum;
            if(shieldDown < 0){
                //shield down is added as it will always be negative
                textarea.value += "dealt "+BossPick[2]+" guard damage and "+ (shieldDown*-1)+" health damage";
                BossPick[1] = BossPick[1] + shieldDown;
                BossPick[2] = 0;
            }
            else{
                BossPick[2] = shieldDown;
                textarea.value += "dealt "+damageSum+" guard damage.\r\n";
            }
        }
    }
    textarea.scrollTop = textarea.scrollHeight;
}

function getRoomEvent(){
    console.log("MapPos: "+states[0]);
    var obj = demoMap[states[0]];
    console.log("MapID: " + obj[0]);
    return obj[0];
}
function sendMSG(){
    console.log("Init Message Handler");
    let mapID = getRoomEvent();
    console.log("MapPos: "+states[0]+"\tMapID: "+mapID+ "\tFlag: "+states[3]);
    let f = document.forms.c_term;
    let userinput = f.c_input.value;
    let modinput=userinput.toLowerCase();
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
                textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tMoving to Kilometer "+states[0]+".\r\n";
                mapID=getRoomEvent();
                console.log("New MapID: "+mapID);
                switch(mapID){
                    case 2:
                        console.log("moved to reward room");
                        textarea.value+="\t\tYou come across an Organization Checkpoint. You can see other patrollers resting or re-arming themselves.\r\n\t\tYou can use this opportunity to rest up and increase your vitality (increase MAX HP) or add a new random card to your deck.\r\n\t\tMake a selection:\r\n\t\t\tRecover Health, Increase MAX HP if current HP > 70% of MAX HP [1]\r\n\t\t\tAdd new card to deck [2]\r\n\t\t\tMove on to the next Kilometer [3]\r\n";
                        states[3]=2;
                        console.log("Flag set: 2");
                        break;
                    case 4:
                        console.log("moved to HP trade room");
                        textarea.value+="\t\tYou come across one of many Sacrifice Altars within the Tunnel. These show up randomly even on the same route.\r\n\t\tIt is said that through a sacrifice of flesh, one can become stronger than they were.\r\n\t\tMake a selection:\r\n\t\t\tApproach Altar [1]\r\n\t\t\tMove onto the next Kilometer [2]\r\n";
                        states[3]=2;
                        console.log("Flag set: 2");
                        break;
                    case 7:
                        console.log("moved to an encounter room");
                        textarea.value+="\t\tYour target radar begins to ping rapidly as a perceived hostile is rapidly approaching.\r\n\t\tHostiles are relentless and will chase you forever. You have no other choice but to fight.\r\n\t\tPrepare for Combat!\r\n";
                        let rand = Math.random()*4;
                        console.log("Enemy: "+Math.round(rand)+"\tRoll: "+rand);
                        currEnemy.push(enemy[Math.round(rand)]);
                        currEnemy.push(enemy[Math.round(rand)][1]+0);
                        currEnemy.push(0);
                        textarea.value += "\r\n\t\tYou have encountered a << "+currEnemy[0][0]+" >>. It has "+currEnemy[1]+" HP.\r\n\r\n";
                        generateCombatScene();
                        states[3]=3
                        console.log("Flag set: 3");
                        break;
                    case 8:
                        console.log("moved to boss room");
                        textarea.value+="\t\tYou approach a Great Door that leads into the next patrol depths. However, every Great Door is defended by a Powerful Guardian.\r\n\t\tYou hear and feel a great impact from behind...\r\n\t\tPrepare for Combat!\r\n";
                        textarea.value += "\r\n\t\tYou have encountered the << "+BossPick[0][0]+" >>. It has "+BossPick[1]+" HP.\r\n\r\n";
                        generateCombatScene();
                        states[3]=3;
                        console.log("Flag set: 3");
                        break;
                    default:
                        console.log("YOU DIDN'T UPDATE THE MAPID");
                        textarea.value = "\tcoder didn't do his job";
                        break;
                }
            }
        }
        else if (modinput.search("use") != -1 && states[3]== 3){
            console.log("encounter type check");
            let modID = parseInt(modinput.slice(4).trim());
            if(modID <= 11 || modID >=0 ){
                if(mapID == 7){
                    parseEnemyCard(modID);
                    enemyRetaliate(0);
                    if (states[1] <= 0){
                        states[3]=5;
                        textarea.value += "\r\n\r\n\t\tYou have perished in the line of duty. Your flesh will be requisitioned to the Organization.\r\n\t\t[RELOAD PAGE URL to RESTART]\r\n";
                    }
                    else if(currEnemy[1] >= 0){
                        generateCombatScene();
                    }
                    else{
                        states[3]=1;
                        textarea.value += "\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                    }
                }
                else if(mapID==8){
                    parseBossCard(modID);
                    enemyRetaliate(1);
                    if (states[1] <= 0){
                        states[3]=5;
                        textarea.value += "\r\n\r\n\t\tYou have perished in the line of duty. Your flesh will be requisitioned to the Organization.\r\n\t\t[RELOAD PAGE URL to RESTART]\r\n";
                    }
                    else if(currEnemy[1] >= 0){
                        generateCombatScene();
                    }
                    else{
                        states[3]=6;
                        textarea.value += "\r\n\t\tKilometer Event completed. You completed the DEMO!\r\n\t\tThanks for playing.\r\n";
                    }
                }
            }
            else if (modID > 11 || modID < 0){

            }
        }
        else if (modinput.search("choose") != -1 && (states[3]==2 || states[3]==4)){
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
                        console.log("health restore + boon pick");
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou rest for a while... After a few hours, you continue down your scheduled route.\r\n";
                        calculateBoon();
                        textarea.value+="\t\tYour new Max HP is "+pMAXHP+".\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                        states[3]=1;
                        console.log("Flag set: 1");
                    }
                    // Accept Option 2 - Add a new card to deck at random.
                    else if (splits == "2"){
                        console.log("get card event chosen");
                        newCard();
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou decide to grab a weapon off one of the shelves. You make your way back onto the path and contine your patrol.\r\n\t\tYour new card is: "+playerSet[playerSet.length-1]+"\r\n\t\tCurrent Deck: "+playerSet+"\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                        states[3]=1;
                        console.log("Flag set: 1");

                    }
                    // Reject Options
                    else if (splits == "3"){
                        console.log("reward event rejected");
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou decide to skip the checkpoint and continue your patrol.\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
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
                        textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tYou approach the altar and place your hand on the offering bed. \r\n\t\tYour feet feel like lead and you fail to move them. You feel your hand fusing with the table. Suddenly, you hear it:\r\n\r\n\t\t\t\"Exchange a portion of full life for greater strength or a portion of your blood for the potential of greater ability\"\r\n\r\n\t\tMake a selection:\r\n\t\t\tGreater Strength (Increase Permanent Attack Bonus by 2, but lose 20% of MAX HP) [1]\r\n\t\t\tPotential Ability (add random card to deck, but lose 20% of current HP) [2]\r\n";
                        states[3]=4;
                        console.log("Flag set: 4");

                    }
                    // Reject Exchange
                    else if (splits == "2" && states[3]==2){
                        console.log("risk event rejected");
                        textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou ignore the altar and move on with your patrol.\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
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
                            pATKPERM+=2;
                            textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou can make sense of your hand as it removes itself from the altar.\r\n\t\tYou can feel your legs again and you quickly step away from the ritual site.\r\n\t\tYou feel stronger, but all the more fragile as well... (Permanent ATK bonus increased by 2).\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
                            states[3]=1;
                            console.log("Flag set: 1");
                        }
                        else if (splits == "2"){
                            console.log("add card");
                            textarea.value+="\t> "+userinput.toUpperCase()+"\r\n\t\tYou can make sense of your hand as it removes itself from the altar.\r\n\t\tYou can feel your legs again and you quickly step away from the ritual site.\r\n\t\tYou flip your hand over and find a new card in your palm. Was it worth it?\r\n";
                            newCard();
                            textarea.value +="\t\tYou make your way back onto the path and contine your patrol.\r\n\t\tYour new card is: "+playerSet[playerSet.length-1]+"\r\n\t\tCurrent Deck: "+playerSet+"\r\n\t\tKilometer Event completed. You may proceed by executing: MOVE\r\n";
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
            textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tUNRECOGNIZED COMMAND.\r\n";
        }
        textarea.scrollTop = textarea.scrollHeight;
    }
}

$(document).ready(function(){

})
        /*
        if (modinput.search("skip") != -1){
            textarea.value += "\t\tSkip enforced. This is a reality testing feature.";
            console.log("Good Move Flag");
            states[0]+=1;
            textarea.value += "\t>  "+userinput.toUpperCase()+"\r\n\t\tMoving to Kilometer "+states[0]+".\r\n";
            mapID=getRoomEvent();
            console.log("New MapID: "+mapID);
            switch(mapID){
                case 2:
                    console.log("moved to reward room");
                    textarea.value+="\t\tYou come across an Organization Checkpoint. You can see other patrollers resting or re-arming themselves.\r\n\t\tYou can use this opportunity to rest up and increase your vitality (increase MAX HP) or add a new random card to your deck.\r\n\t\tMake a selection:\r\n\t\t\tRecover Health, Increase MAX HP if current HP > 70% of MAX HP [1]\r\n\t\t\tAdd new card to deck [2]\r\n\t\t\tMove on to the next Kilometer [3]\r\n";
                    states[3]=2;
                    console.log("Flag set: 2");
                    break;
                case 4:
                    console.log("moved to HP trade room");
                    textarea.value+="\t\tYou come across one of many Sacrifice Altars within the Tunnel. These show up randomly even on the same route.\r\n\t\tIt is said that through a sacrifice of flesh, one can become stronger than they were.\r\n\t\tMake a selection:\r\n\t\t\tApproach Altar [1]\r\n\t\t\tMove onto the next Kilometer [2]\r\n";
                    states[3]=2;
                    console.log("Flag set: 2");
                    break;
                case 7:
                    console.log("moved to an encounter room");
                    textarea.value+="\t\tYour target radar begins to ping rapidly as a perceived hostile is rapidly approaching.\r\n\t\tHostiles are relentless and will chase you forever. You have no other choice but to fight.\r\n\t\tPrepare for Combat!\r\n";
                    let rand = Math.round(Math.random()*4);
                    currEnemy.push(enemy[rand]);
                    currEnemy.push(enemy[rand][1]+0)
                    textarea.value += "\r\n\t\tYou have encountered a "+currEnemy[0][0]+". It has "+currEnemy[1]+" HP.";
                    //generateCombatScene();
                    states[3]=3
                    console.log("Flag set: 3");
                    break;
                case 8:
                    console.log("moved to boss room");
                    textarea.value+="\t\tYou approach a Great Door that leads into the next patrol depths. However, every Great Door is defended by a Powerful Guardian.\r\n\t\tYou hear and feel a great impact from behind...\r\n\t\tPrepare for Combat!\r\n";
                    textarea.value += "\r\n\t\tYou have encountered a "+BossPick[0][0]+". It has "+BossPick[1]+" HP.";
                    //generateCombatScene();
                    states[3]=3;
                    console.log("Flag set: 3");
                    break;
                default:
                    console.log("YOU DIDN'T UPDATE THE MAPID");
                    textarea.value = "\tcoder didn't do his job";
                    break;
            }
            textarea.scrollTop = textarea.scrollHeight;
            return false;
        }*/