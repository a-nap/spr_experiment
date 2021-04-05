PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

const voucher = b64_md5((Date.now() + Math.random()).toString()) // Voucher code generator

// Optionally Inject a question into a trial
const askQuestion = (successCallback, failureCallback, waitTime) => (row) => (row.QUESTION=="1" ? [
  newText( "answer_correct" , row.CORRECT ),
  newText( "answer_wrong" , row.WRONG ),

  newCanvas("Canvas", 600, 100)
    .center()
    .add(   0 ,  0,  newText("Wer oder was wurde im Satz erwähnt?"))
    .add(   0 , 50 , newText("1 =") )
    .add( 300 , 50 , newText("2 =") )
    .add(  40 , 50 , getText("answer_correct") )
    .add( 340 , 50 , getText("answer_wrong") )
    .print()
  ,
  // Shuffle the position of the answers. Answer keys are 1 for left and 2 for right
  newSelector("answer")
    .add( getText("answer_correct") , getText("answer_wrong") )
    .shuffle()
    .keys("1","2")
    .log()
    .print()
    .once()
    .wait()
    .test.selected( "answer_correct" )
    .success(successCallback())
    .failure(failureCallback()),

  // Wait for feedback and to display which option was selected
  newTimer("wait", waitTime)
    .start()
    .wait()
] : []);

const askExerciseQuestion = askQuestion(
  () => newText("<b>Richtig!</b>")
    .color("LightGreen")
    .center()
    .print(),
  () => newText("<b>Leider falsch!</b>")
    .color("Crimson")
    .center()
    .print(),
  1000
);

const askTrialQuestion = askQuestion(
  () => getVar("ACCURACY").set(v=>[...v,true]),
  () => [
    getVar("ACCURACY").set(v=>[...v,false]),
    newText("<b>Leider falsch!</b>")
      .color("Crimson")
      .center()
      .print(),
    // Penalty for the wrong answer is waiting 1000 ms before continuing
    newTimer("wait", 1000)
      .start()
      .wait()
  ],
  300
);

Header(
    // Declare global variables to store the participant's ID and demographic information
    newVar("ID").global(),
    newVar("GERMAN").global(),
    newVar("LAND").global(),
    newVar("NATIVE").global(),
    newVar("AGE").global(),
    newVar("GENDER").global(),
    newVar("HAND").global(),
    newVar("ACCURACY", []).global() 
)
 // Add the particimant info to all trials' results lines
.log( "id"     , getVar("ID") )
.log( "german" , getVar("GERMAN") )
.log( "land"   , getVar("LAND") )
.log( "native" , getVar("NATIVE") )
.log( "age"    , getVar("AGE") )
.log( "gender" , getVar("GENDER") )
.log( "hand"   , getVar("HAND") )
.log( "code"   , voucher )

// Sequence of events: consent to ethics statement required to start the experiment, participant information, instructions, exercise, transition screen, main experiment, result logging, and end screen.
Sequence("ethics", "setcounter", "participants", "instructions", randomize("exercise"), "start_experiment", rshuffle("experiment-filler", "experiment-item"), SendResults(), "end")

// Ethics agreement: participants must agree before continuing
newTrial("ethics",
    newHtml("ethics_explanation", "ethics.html")
        .cssContainer({"margin":"1em"})
        .print()
    ,
    newHtml("form", `<div class='fancy'><input name='consent' id='consent' type='checkbox'><label for='consent'>Ich bin mindestens 18 Jahre alt und erkläre mich damit einverstanden, an der Studie teilzunehmen. Ich habe die <em>Information für Probanden</em> gelesen und verstanden. Meine Teilnahme ist freiwillig. Ich weiß, dass ich die Möglichkeit habe, meine Teilnahme an dieser Studie jederzeit und ohne Angabe von Gründen abzubrechen, ohne dass mir daraus Nachteile entstehen. Ich erkläre, dass ich mir der im Rahmen der Studie erfolgten Auszeichnung von Studiendaten und ihrer Verwendung in pseudo- bzw. anonymisierter Form einverstanden bin.</label></div>`)
        .cssContainer({"margin":"1em"})
        .print()
    ,
    newFunction( () => $("#consent").change( e=>{
        if (e.target.checked) getButton("go_to_info").enable()._runPromises();
        else getButton("go_to_info").disable()._runPromises();
    }) ).call()
    ,
    newButton("go_to_info", "Experiment starten")
        .cssContainer({"margin":"1em"})
        .disable()
        .print()
        .wait()
)

// Start the next list as soon as the participant agrees to the ethics statement
// This is different from PCIbex's normal behavior, which is to move to the next list once 
// the experiment is completed. In my experiment, multiple participants are likely to start 
// the experiment at the same time, leading to a disproportionate assignment of participants
// to lists.
SetCounter("setcounter")

// Participant information: questions appear as soon as information is input
newTrial("participants",
    defaultText
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,
    newText("participant_info_header", "<div class='fancy'><h2>Zur Auswertung der Ergebnisse benötigen wir folgende Informationen.</h2><p>Sie werden streng anonym behandelt und eine spätere Zuordnung zu Ihnen wird nicht möglich sein.</p></div>")
    ,
    // Participant ID (6-place)
    newText("participantID", "<b>Bitte tragen Sie Ihre Teilnehmer-ID ein.</b><br>(bitte Eintrag durch Eingabetaste bestätigen)")
    ,
    newTextInput("input_ID")
        .length(6)
        .log()
        .print()
        .wait()
    ,
    // German native speaker question
    newText("<b>Ist Deutsch Ihre Muttersprache?</b>")
    ,
    newScale("input_german",   "ja", "nein")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
        .wait()
    ,
    // Federal state of origin
    newText("<b>In welchem Bundesland wird Ihre Variante des Deutschen (bzw. Ihr Dialekt) hauptsächlich gesprochen?</b>")
    ,
    newDropDown("land", "(bitte auswählen)")
        .add("Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfal", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen", "nicht Deutschland, sondern Österreich", "nicht Deutschland, sondern Schweiz", "keines davon")
        .log()
        .print()
        .wait()
    ,
    // Other native languages
    newText("<b>Haben Sie andere Muttersprachen?</b><br>(bitte Eintrag durch Eingabetaste bestätigen)")
    ,
    newTextInput("input_native")
        .log()
        .print()
        .wait()
    ,
    // Age
    newText("<b>Alter in Jahren</b><br>(bitte Eintrag durch Eingabetaste bestätigen)")
    ,
    newTextInput("input_age")
        .length(2)
        .log()
        .print()
        .wait()
    ,
    // Gender
    newText("<b>Geschlecht</b>")
    ,
    newScale("input_gender",   "weiblich", "männlich", "divers")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
        .wait()
    ,
    // Handedness
    newText("<b>Händigkeit</b>")
    ,
    newScale("input_hand",   "rechts", "links", "beide")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
        .wait()
    ,
    // Clear error messages if the participant changes the input
    newKey("just for callback", "") 
        .callback( getText("errorage").remove() , getText("errorID").remove() )
    ,
    // Formatting text for error messages
    defaultText.color("Crimson").print()
    ,
    // Continue. Only validate a click when ID and age information is input properly
    newButton("weiter", "Weiter zur Instruktion")
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
        // Check for participant ID and age input
        .wait(
             newFunction('dummy', ()=>true).test.is(true)
            // ID
            .and( getTextInput("input_ID").testNot.text("")
                .failure( newText('errorID', "Bitte tragen Sie Ihre Teilnehmer-ID ein. Diese haben Sie in einer E-Mail bekommen.") )
            // Age
            ).and( getTextInput("input_age").test.text(/^\d+$/)
                .failure( newText('errorage', "Bitte tragen Sie Ihr Alter ein."), 
                          getTextInput("input_age").text("")))  
        )
    ,
    // Store the texts from inputs into the Var elements
    getVar("ID")     .set( getTextInput("input_ID") ),
    getVar("GERMAN") .set( getScale("input_german") ),
    getVar("LAND")   .set( getDropDown("land") ),
    getVar("NATIVE") .set( getTextInput("input_native") ),
    getVar("AGE")    .set( getTextInput("input_age") ),
    getVar("GENDER") .set( getScale("input_gender") ),
    getVar("HAND")   .set( getScale("input_hand") )
)

// Instructions
newTrial("instructions",
    newHtml("instructions_text", "instructions.html")
        .cssContainer({"margin":"1em"})
        .print()
        ,
    newButton("go_to_exercise", "Übung starten")
        .cssContainer({"margin":"1em"})
        .print()
        .wait()
)

// Exercise
Template("exercise.csv", row =>
  newTrial("exercise",
           // Dashed sentence
           newController("DashedSentence", {s : row.SENTENCE})
           .center()
           .print()
           .log()
           .wait()
           .remove(),
           askExerciseQuestion(row))
    .log( "item"      , row.ITEM)
    .log( "condition" , row.CONDITION)
)

// Start experiment
newTrial( "start_experiment" ,
    newText("<h2>Jetzt beginnt der Hauptteil der Studie.</h2><p>Sie kriegen Feedback nur bei falscher Antwort.</p>")
        .print()
    ,
    newButton("go_to_experiment", "Experiment starten")
        .print()
        .wait()
)

// Experimental trial
Template("experiment.csv", row =>
  newTrial("experiment-"+row.TYPE,
           // Dashed sentence
           newController("DashedSentence", {s : row.SENTENCE})
           .center()
           .print()
           .log()
           .wait()
           .remove(),
           askTrialQuestion(row))
    .log( "list"      , row.LIST)
    .log( "item"      , row.ITEM)
    .log( "condition" , row.CONDITION)
)

// Final screen: explanation of the goal
newTrial("end",
    newText("<div class='fancy'><h2>Vielen Dank für die Teilnahme an unserer Studie!</h2></div><p>Um Ihre Vergütung zu bekommen, schicken Sie bitte diesen persönlichen Code an die Versuchsleiterin: <div class='fancy'><em>".concat(voucher, "</em></div></p>"))
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,

    newVar("computedAccuracy").set(getVar("ACCURACY")).set(v=>Math.round(v.filter(a=>a===true).length/v.length*100)),
    newText("accuracy").text(getVar("computedAccuracy"))
    ,
    newText("So viel Prozent der Fragen haben Sie richtig beantwortet: ")
        .after(getText("accuracy"))
        .print()
    ,
    newHtml("explain", "end.html")
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false);
