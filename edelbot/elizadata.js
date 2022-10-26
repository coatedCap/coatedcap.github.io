// data for elizabot.js
// entries prestructured as layed out in Weizenbaum's description 
// [cf: Communications of the ACM, Vol. 9, #1 (January 1966): p 36-45.]

var elizaInitials = [
"Greetings.  I'm Edelwriez.  I will be your presiding interviewer on behalf of Shironome Incorporated.  This is an open-ended forum.  Speak about yourself.",
"The interview begins.  I am Edelwriez.  Feel free to ask questions.  Talk about yourself first."
//"How do you do.  Please tell me your problem.",
// additions (not original)
//"Please tell me what's been bothering you.",
//"Is something troubling you ?"
];

var elizaFinals = [
"Goodbye.  The recruiter will be in contact if you are chosen.",
"You're done?  Hm.",
"You'll know when Shironome enlists you."
// additions (not original)
/*
"Goodbye.  This was really a nice talk.",
"Goodbye.  I'm looking forward to our next session.",
"This was a good session, wasn't it -- but time is over now.   Goodbye.",
"Maybe we could discuss this moreover in our next session ?   Goodbye."*/
];

var elizaQuits = [
"bye",
"goodbye",
"done",
"exit",
"quit"
];

var elizaPres = [
"dont", "don't",
"cant", "can't",
"wont", "won't",
"recollect", "remember",
"recall", "remember",
"dreamt", "dreamed",
"dreams", "dream",
"maybe", "perhaps",
"certainly", "yes",
"machine", "computer",
"machines", "computer",
"computers", "computer",
"were", "was",
"you're", "you are",
"i'm", "i am",
"same", "alike",
"identical", "alike",
"equivalent", "alike"
];

var elizaPosts = [
"am", "are",
"your", "my",
"me", "you",
"myself", "yourself",
"yourself", "myself",
"i", "you",
"you", "I",
"my", "your",
"i'm", "you are"
];

var elizaSynons = {
"be": ["am", "is", "are", "was"],
"belief": ["feel", "think", "believe", "wish"],
"cannot": ["can't"],
"desire": ["want", "need"],
"everyone": ["everybody", "nobody", "noone"],
"family": ["mother", "mom", "father", "dad", "sister", "brother", "wife", "children", "child"],
"happy": ["elated", "glad", "better"],
"sad": ["unhappy", "depressed", "sick"]
};

var elizaKeywords = [

/*
  Array of
  ["<key>", <rank>, [
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]],
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]]
  ]]
*/

["xnone", 0, [
 ["*", [
     "I'm not sure I understand you fully.",
     "Please go on.",
     "What does that suggest to you ?",
     "Do you feel strongly about discussing such things ?",
     "That is interesting.  Please continue.",
     "Tell me more about that.",
     "Does talking about this bother you ?"
  ]]
]],
["sorry", 0, [
 ["*", [
     "Move on.",
     "Apologies are not necessary.",
     "Apologies are not required.",
     "It doesn't matter to me.  Continue."
  ]]
]],
["apologise", 0, [
 ["*", [
     "goto sorry"
  ]]
]],
["remember", 5, [
 ["* i remember *", [
     "Do you often think of (2) ?",
     "Does thinking of (2) bring anything else to mind ?",
     "What else do you recollect ?",
     "Why do you remember (2) just now ?",
     "What in the present situation reminds you of (2) ?",
     "What is the connection between me and (2) ?",
     "What else does (2) remind you of ?"
  ]],
 ["* do you remember *", [
     "Did you think I would forget (2) ?",
     "Why do you think I should recall (2) now ?",
     "What about (2) ?",
     "goto what",
     "You mentioned (2) ?"
  ]],
 ["* you remember *", [
     "How could I forget (2) ?",
     "What about (2) should I remember ?",
     "goto you"
  ]]
]],
["forget", 5, [
 ["* i forget *", [
     "Can you think of why you might forget (2) ?",
     "Why can't you remember (2) ?",
     "How often do you think of (2) ?",
     "Does it bother you to forget that ?",
     "Could it be a mental block ?",
     "Are you generally forgetful ?",
     "Do you think you are suppressing (2) ?"
  ]],
 ["* did you forget *", [
     "Why do you ask ?",
     "Are you sure you told me ?",
     "Would it bother you if I forgot (2) ?",
     "Why should I recall (2) just now ?",
     "goto what",
     "Tell me more about (2)."
  ]]
]],
["if", 3, [
 ["* if *", [
     "Do you think it's likely that (2) ?",
     "Do you wish that (2) ?",
     "What do you know about (2) ?",
     "Really, if (2) ?",
     "What would you do if (2) ?",
     "But what are the chances that (2) ?",
     "What does this speculation lead to ?"
  ]]
]],
["dreamed", 4, [
 ["* i dreamed *", [
     "Really, (2) ?",
     "Have you ever fantasized (2) while you were awake ?",
     "Have you ever dreamed (2) before ?",
     "goto dream"
  ]]
]],
["dream", 3, [
 ["*", [
     "What does that dream suggest to you ?",
     "Do you dream often ?",
     "What persons appear in your dreams ?",
     "Do you believe that dreams have something to do with your problem ?"
  ]]
]],
["perhaps", 0, [
 ["*", [
     "You don't seem quite certain.",
     "Why the uncertain tone ?",
     "Can't you be more positive ?",
     "You aren't sure ?",
     "Don't you know ?",
     "How likely, would you estimate ?"
  ]]
]],
["name", 15, [
 ["*", [
     "That isn't necessary.",
     "Pick up the pace."
  ]]
]],
["deutsch", 0, [
 ["*", [
     "goto xforeign",
     "I understand you speak German.  Speak English for this session."
  ]]
]],
["francais", 0, [
 ["*", [
     "goto xforeign",
     "I understand you speak French.  Speak English for this session."
  ]]
]],
["italiano", 0, [
 ["*", [
     "goto xforeign",
     "I understand you speak Italian.  Speak English for this session."
  ]]
]],
["espanol", 0, [
 ["*", [
     "goto xforeign",
     "I understand you speak Spanish.  Speak English for this session."
  ]]
]],
["xforeign", 0, [
 ["*", [
     "This session is only in English and responses will only be provided in English."
  ]]
]],
["hello", 0, [
 ["*", [
     "Greetings.  Get on with your story.",
     "Formalities noted."
  ]]
]],
["computer", 50, [
 ["*", [
     //"Do computers worry you ?",
     "Why do you mention computers ?",
     "What do you think machines have to do with your problem ?",
     "What about them?  How is this relevant?"
     //"Don't you think computers can help people ?",
     //"What about machines worries you ?",
     //"What do you think about machines ?",
     //"You don't think I am a computer program, do you ?"
  ]]
]],
["am", 0, [
 ["* am i *", [
     "Are you now?",
     "Only you can figure out what you are.",
     "Asking me is not going to change who you are.",
     "goto what"
  ]],
 ["* i am *", [
     "goto i"
  ]],
 ["*", [
     "What are you on about?",
     "Rephrase if you can."
  ]]
]],
["are", 0, [
 ["* are you *", [
     "What do you think?",
     "Yeah. Sure, I am (2). Now, get on with it.",
     "goto what",
     "Is this really important to focus on?"
  ]],
 ["* you are *", [
     "goto you"
  ]],
 ["* are *", [
     "Mhm.",
     "Right...",
    /*
     "What if they were not (2) ?",
     "Are they always (2) ?",
     "Possibly they are (2).",
     "Are you positive they are (2) ?"
    */
    ]]
]],
["your", 0, [
 ["* your *", [
     "Why are you concerned over my (2) ?",
     "What about your own (2) , huh?",
     "Are you worried about someone else's (2) ?",
     "Really, my (2) ?",
  ]]
]],
["was", 2, [
 ["* was i *", [
     "And if you are... ?",
     "Do you think you were (2) ?",
     "Were you?",
     "goto what"
  ]],
 ["* i was *", [
     "Really now?",
     "Uh-huh."
  ]],
 ["* was you *", [
     "Does it matter?",
     "Sure. Whatever you want to think.",
     "Mhm, sure."
  ]]
]],
["i", 0, [
 ["* i @desire *", [
     "Why do you want (3) ?",
     "What would getting (3) mean to you ?",
     "What does wanting (3) have to do with this discussion ?"
  ]],
 ["* i am* @sad *", [
     "Unfortunate.",
     "Right.",
     "I cannot extend my sympathies.",
     "You should solve whatever is making you... like that."
  ]],
 ["* i am* @happy *", [
     "Good for you.",
     "What makes you (3) just now ?"
  ]],
 ["* i was *", [
     "goto was"
  ]],
 ["* i @belief i *", [
     "Do you really think so?",
     "Believe what you want."
  ]],
 ["* i* @belief *you *", [
     "goto you"
  ]],
 ["* i am *", [
     "Sure.",
     "If you think so.",
     "Mhm.",
     "What else are you besides (2) ?"
  ]],
 ["* i @cannot *", [
     "Have you tried something else?",
     "You should try harder.",
     "Take a different approach.",
     "And... you've exhausted all your options?",
     "Hm. If you were able to?"
  ]],
 ["* i don't *", [
     "You are allowed to dislike.",
     "As long as you didn't give up on it.",
     "Does that trouble you ?"
  ]],
 ["* i feel *", [
     "I see.",
     "Is that common?",
     "Uh-huh."
  ]],
 ["* i * you *", [
     "Flattering. Get a move on.",
     "You should worry about yourself.",
     "Do you (2) anyone else ?"
  ]],
 ["*", [
     "Sure.",
     "Care to elaborate?",
     "Do you say (1) for some special reason ?",
     "Uh-huh..."
  ]]
]],
["you", 0, [
 ["* you remind me of *", [
     "goto alike"
  ]],
 ["* you are *", [
     "What makes you think I am (2) ?",
     "I am who I am.",
     "Worry about yourself."
  ]],
 ["* you* me *", [
     "Why do you think I (2) you ?",
     "What makes you think I (2) you ?",
     "I couldn't care any more.",
     "Is that thought worthy anything to you?"
  ]],
 ["* you *", [
     "This is mostly about you -- not me.",
     "Oh, I (2) ?",
     "Sure. You know what you say goes into the report, correct?"

  ]]
]],
["yes", 0, [
 ["*", [
     "Alright then.",
     "If you're so sure.",
     "I see.",
     "I understand."
  ]]
]],
["no", 0, [
 ["* no one *", [
    "No one, eh?",
     "You have a particular person in mind, don't you ?",
     "Who do you think you are talking about ?"
  ]],
 ["*", [
     "Mhm.",
     "If you're sure.",
     "I see.",
     "Understandable."
  ]]
]],
["my", 2, [
 ["$ * my *", [
     "Discuss further about your (2).",
     "EElaborate more about (2)."
  ]],
 ["* my* @family *", [
     "Tell me more about your family.",
     "Who else in your family (4) ?",
     "Your (3) ?",
     "What else comes to your mind when you think of your (3) ?"
  ]],
 ["* my *", [
     "Your (2) ?",
     "Why do you say your (2) ?",
     "Is it important to you that your (2) ?"
  ]]
]],
["can", 0, [
 ["* can you *", [
     "I'm not here to prove me. You are here to prove yourself.",
     "goto what",
     "I can do many things, but it doesn't matter.",
     "Can you?"
  ]],
 ["* can i *", [
     "Whether or not you can (2) depends on you more than on me.",
     "Do you want to be able to (2) ?",
     "If think you can, you probably can do it.",
     "goto what"
  ]]
]],
["what", 0, [
 ["*", [
     "Your point in asking...?",
     "Does that question interest you ?",
     "What is it you really want to know ?",
     "What do you think ?",
     "What comes to mind when you ask that ?",
  ]]
]],
["who", 0, [
 ["who *", [
     "goto what"
  ]]
]],
["when", 0, [
 ["when *", [
     "goto what"
  ]]
]],
["where", 0, [
 ["where *", [
     "goto what"
  ]]
]],
["how", 0, [
 ["how *", [
     "goto what"
  ]]
]],
["because", 0, [
 ["*", [
     "Is that the real reason ?",
     "Don't any other reasons come to mind ?",
     "Any other possible factors?",
     "What other reasons might there be ?"
  ]]
]],
["why", 0, [
 ["* why don't you *", [
     "Why don't I (2) ? What would be the point?",
     "You want me to (2) ? For what purpose?",
     "People do many things, why would what I do matter?",
     "goto what"
  ]],
 ["* why can't i *", [
     "That's your problem, not mine.",
     "Do you want to be able to (2) ?",
     "Do you believe this will help you to (2) ?",
     "Would it make you feel any better if you could do (2) ?",
     "goto what"
  ]],
 ["*", [
     "goto what"
  ]]
]],
["everyone", 2, [
 ["* @everyone *", [
     " (2) , huh?",
     "Surely not (2).",
     "You have a particular person in mind, don't you ?",
     "Who are you talking about?",
     "That's your problem, not theirs."
  ]]
]],
["everybody", 2, [
 ["*", [
     "goto everyone"
  ]]
]],
["nobody", 2, [
 ["*", [
     "goto everyone"
  ]]
]],
["noone", 2, [
 ["*", [
     "goto everyone"
  ]]
]],
["always", 1, [
 ["*", [
     "Can you think of a specific example ?",
     "When ?",
     "What incident are you thinking of ?",
     "Get more specific."
  ]]
]],
["alike", 10, [
 ["*", [
     "In what way ?",
     "What do you see ?",
     "How ?",
     "Really now ?"
  ]]
]],
["like", 10, [
 ["* @be *like *", [
     "goto alike"
  ]]
]],
["different", 0, [
 ["*", [
     "How is it different ?",
     "What does that mean ?",
     "How ?",
     "Really ?",
     "The world is different for everyone."
  ]]
]]

];

// regexp/replacement pairs to be performed as final cleanings
// here: cleanings for multiple bots talking to each other
var elizaPostTransforms = [
	/ old old/g, " old",
	/\bthey were( not)? me\b/g, "it was$1 me",
	/\bthey are( not)? me\b/g, "it is$1 me",
	/Are they( always)? me\b/, "it is$1 me",
	/\bthat your( own)? (\w+)( now)? \?/, "that you have your$1 $2 ?",
	/\bI to have (\w+)/, "I have $1",
	/Earlier you said your( own)? (\w+)( now)?\./, "Earlier you talked about your $2."
];

// eof