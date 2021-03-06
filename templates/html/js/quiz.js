/*
This file contains all the custom code for ConnectMe and will be used for ajax calls
*/

var QsetTable1;
var QsetId;
var QuizTable1; 
var title;
var    choice1;
var    choice2;
var    choice3;
var    choice4;
var    choice5;
var    correct_answer;
var     corect_answer;
var quiz_questions = [];

$(document).ready(function() {


/* ############### Following Section Contains a code for Question Set and Quiz Generation ###################### */
$("#questionsetform1").hide();
$("#listquizreport1").hide();
$("#quizform1").hide();
$("#showqsetrptbtn1").hide();
$("#createquizfrmbtn1").hide();
$("#showquizrptbtn1").hide();
$("#showquizfrmbtn1").hide();
$("#surveyElement").hide();
$("#surveyResult").hide();


populateQsetData();

$("#popqsetfrmbtn1").click(function() {
   $("#listqsetreport1").hide();
   $("#questionsetform1").show();
   $("#quizform1").hide();
   $("#showqsetrptbtn1").show();
   $("#popqsetfrmbtn1").hide();
   $("#listquizreport1").hide();
   $("#showquizrptbtn1").hide();
   $("#showquizfrmbtn1").hide();
   $("#surveyElement").hide();
   $("#surveyResult").hide();

});

$("#showqsetrptbtn1").click(function() {
   $("#listqsetreport1").show();
   $("#questionsetform1").hide();
   $("#quizform1").hide();
   $("#showqsetrptbtn1").hide();
   $("#popqsetfrmbtn1").show();
   $("#listquizreport1").hide();
   $("#showquizrptbtn1").hide();
   $("#showquizfrmbtn1").hide();
   $("#surveyElement").hide();
   $("#surveyResult").hide();
    populateQsetData();
});


$("#questionsetform1").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    var data = $('#questionsetform1').serializeArray();
    console.log(data);
    var tenancy_id = $.cookie('tenancy_id');
    var created_by = $.cookie('username');
    var updated_by = $.cookie('username');
    data.push({name: "updated_by", value: updated_by})
    data.push({name: "created_by", value: created_by})
    data.push({name: "tenancy_id", value: tenancy_id})
    data.push({name: "poll_or_quiz", value: "Q"})
    data.push({name: "showprogbar", value: "Y"})
    data.push({name: "qset_status", value:"open"})
    data.push({name: "showtimepanel", value:"Y"})

    console.log(data);
    var req=$.ajax({
      type: "POST",
      url: "/api/qset",
      data: $.param(data),
    });
    req.done();
    req.fail();
    req.complete(resetQuestionSetForm1);
 });


$("#quizform1").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    var data = $('#quizform1').serializeArray();
    console.log(data);
    var tenancy_id = $.cookie('tenancy_id');
    var created_by = $.cookie('username');
    var updated_by = $.cookie('username');
    data.push({name: "qset_id", value: QsetId})
    data.push({name: "created_by", value: created_by})
    data.push({name: "tenancy_id", value: tenancy_id})
    data.push({name: "question_type", value: "checkbox"})
    data.push({name: "publish_yn", value: "Y"})
    data.push({name: "updated_by", value: updated_by})
   
    console.log(data);
    var req=$.ajax({
      type: "POST",
      url: "/api/quiz",
      data: $.param(data),
    });
    req.done();
    req.fail();
    req.complete(resetQuizForm1);
 });


$('#listqsetreport1').on( 'click', '#viewquizbtn1', function () {
        var data=QsetTable1.row( $(this).parents('tr') ).data();
        console.log(data);
        QsetId=data[7];
        console.log(QsetId);
        $("#listqsetreport1").hide();
        $("#questionsetform1").hide();
        $("#quizform1").hide();
        $("#showqsetrptbtn1").show();
        $("#popqsetfrmbtn1").hide();
        $("#listquizreport1").hide();
        $("#showquizrptbtn1").hide();
        $("#showquizfrmbtn1").hide();
        $("#listquizreport1").hide(); 
        $("#surveyElement").show();
        $("#surveyResult").show();
        preViewQuiz();
});

$('#listqsetreport1').on( 'click', '#createquestbtn1', function () {
        var data=QsetTable1.row( $(this).parents('tr') ).data();
        console.log(data);
        QsetId=data[7];
        console.log(QsetId);
        $("#listqsetreport1").hide();
        $("#questionsetform1").hide();
        $("#quizform1").hide();
        $("#showqsetrptbtn1").show();
        $("#popqsetfrmbtn1").hide();
        $("#listquizreport1").hide();
        $("#showquizrptbtn1").hide();
        $("#showquizfrmbtn1").show();
        $("#listquizreport1").show();
        $("#surveyElement").hide();
        $("#surveyResult").hide();
        populateQuizData();
});


$("#showquizrptbtn1").click(function() {
   $("#listqsetreport1").hide();
   $("#questionsetform1").hide();
   $("#quizform1").hide();
   $("#showqsetrptbtn1").show();
   $("#popqsetfrmbtn1").hide();
   $("#listquizreport1").show();
   $("#showquizrptbtn1").hide();
   $("#showquizfrmbtn1").show();
   $("#surveyElement").hide();
   $("#surveyResult").hide();
});

$("#showquizfrmbtn1").click(function() {
   $("#listqsetreport1").hide();
   $("#questionsetform1").hide();
   $("#quizform1").show();
   $("#showqsetrptbtn1").hide();
   $("#popqsetfrmbtn1").hide();
   $("#listquizreport1").hide();
   $("#showquizrptbtn1").show();
   $("#showquizfrmbtn1").hide();
   $("#surveyElement").hide();
   $("#surveyResult").hide();
    populateQsetData();
});


/* ################################################################################################################ */

});



/* ########### Token Auth block begins here  #################### */

function chkResponse(response)
{
console.log(response);
if (response['status']==200 && response['statusText']=='OK')
 {
	  return 0;
 }
 else
  {
	redirectLogin();
  }
redirectLogin();
}

/* ########### Token Auth block end here  #################### */


/* ##################### Code for Qustion Set and Quiz generation Starts here ############### */
function populateQuizData() {
 var tenancy_id = $.cookie('tenancy_id');
 var created_by = $.cookie('username');
 var querytype = $.cookie('role');
 console.log('tenancy_id');
 console.log('username');

 var req = $.ajax({
    type: "GET",
    url: "/api/quiz",
    dataType: "json",
    data:
    {
      "tenancy_id": tenancy_id,
      "created_by": created_by,
      "querytype": querytype,
      "qset_id": QsetId
    }
 });
 req.done(buildQuizTable);
 req.fail(checkError);
}

function buildQuizTable(response)
{
  console.log(response);
  obj = JSON.parse(response);
  var rowdata;
  console.log(obj);

var resultarr= [];

obj.forEach(function(Object){
    resultarr.push([Object.question,Object.corect_answer,Object.answer01,Object.answer02,Object.answer03,Object.answer04,Object.answer05,Object.answer06,Object.created_by,Object.question_id]);
});

console.log(resultarr);

QuizTable1= $('#quizreport1').DataTable( {
        destroy: true,
        data: resultarr,
        columns: [
            { title: "Question" },
            { title: "Correct Answer" },
            { title: "Option1" },
            { title: "Option2" },
            { title: "Option3" },
            { title: "Option4" },
            { title: "Option5" },
            { title: "Option6" },
            { title: "Edit/Delete" },
           ],
            "columnDefs": [ {
                "targets": -1,
                "data": null,
                "defaultContent": "<button id='editqsbtn'>Edit!</button>" + "<button id='deleteqsbtn'>Delete!</button>" 
                       } ],
    } );

}


function populateQsetData()
{
 var tenancy_id = $.cookie('tenancy_id');
 var created_by = $.cookie('username'); 
 var querytype = $.cookie('role');
 console.log('tenancy_id');
 console.log('username');

 var req = $.ajax({
    type: "GET",
    url: "/api/qset",
    dataType: "json",
    data:
    {
      "tenancy_id": tenancy_id,
      "created_by": created_by,
      "querytype": querytype
    }
 });
 req.done(buildQsetTable);
 req.fail(checkError);
}

function buildQsetTable(response)
{
  console.log(response);
  obj = JSON.parse(response);
  var rowdata;
  console.log(obj);

var resultarr= [];

obj.forEach(function(Object){
    resultarr.push([Object.qset_name,Object.qset_title,Object.timeonperpage,Object.maxtimetofinish,Object.qset_intro_text,Object.qset_thankyou_text,Object.created_by,Object.qset_id]);
});

console.log(resultarr);

QsetTable1= $('#qsetreport1').DataTable( {
        destroy: true,
        data: resultarr,
        columns: [
            { title: "Name" },
            { title: "Title" },
            { title: "TimerOnPage" },
            { title: "MaxTimeToFinish" },
            { title: "Intro Text" },
            { title: "ThankYou Text" },
            { title: "Created By" },
            { title: "Edit/Delete" },
           ],
            "columnDefs": [ {
                "targets": [7],
                "data": null,
                "defaultContent": "<button id='createquestbtn1'>Create Quiz Questions</button>" + "<button id='viewquizbtn1'>Preview Quiz</button>"
                       } ],
    } );

}

function preViewQuiz()
{
Survey
    .StylesManager
    .applyTheme("default");

var    quiz_type="radiogroup";
var    quiz_name="quiz";
var tenancy_id = $.cookie('tenancy_id');
var quiz_question1 = {};
var choice_arr = [];
console.log('tenancy_id');

 var req = $.ajax({
    type: "GET",
    url: "/api/qset",
    dataType: "json",
    data:
    {
      "tenancy_id": tenancy_id,
      "querytype": "surveyquiz",
      "qset_id": QsetId
    },
    async: false
 });
req.done(questionSetTitle);
req.fail(checkError);

console.log(title);

 var req = $.ajax({
    type: "GET",
    url: "/api/quiz",
    dataType: "json",
    data:
    {
      "tenancy_id": tenancy_id,
      "querytype": "surveyquiz",
      "qset_id": QsetId
    },
    async: false
 });
req.done(quizQuestions);
req.fail(checkError);

console.log(quiz_questions);

var json1 = {
    title: title,
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    firstPageIsStarted: true,
    startSurveyText: "Start Quiz",
    pages: [],
    completedHtml: "<h4>You have answered correctly <b>{correctedAnswers}</b> questions from <b>{questionCount}</b>.</h4>"
 };

var quiz_question =  {
            questions: [
                {
                    type: "html",
                    html: "You are about to start a quiz. <br/>You have 20 seconds for every page and 120 seconds for the whole survey questions.<br/>Please click on <b>'Start Quiz'</b> button when you are ready."
                }
            ]
        };

json1.pages.push(quiz_question);
console.log(quiz_question);
console.log(json1);


var questions = {};
console.log(json1);

for (index = 0; index < quiz_questions.length; ++index) {
    console.log(quiz_questions[index]);
    if (quiz_questions[index].answer01)
    {
     choice1=quiz_questions[index].answer01;
     console.log(choice1); 
    choice_arr.push(choice1);
    }     
    if (quiz_questions[index].answer02)
    {
     choice2=quiz_questions[index].answer02;
     console.log(choice2);
    choice_arr.push(choice2);
    }
    if (quiz_questions[index].answer03)
    {
     choice3=quiz_questions[index].answer03;
     console.log(choice3);
    choice_arr.push(choice3);
    }
    if (quiz_questions[index].answer04)
    {
    choice4=quiz_questions[index].answer04;
    console.log(choice4);
    choice_arr.push(choice4);
    }
    if (quiz_questions[index].answer05)
    {
    choice5=quiz_questions[index].answer05;
    console.log(choice5);
    choice_arr.push(choice5);
    }
    if (quiz_questions[index].answer06)
    {
     choice6=quiz_questions[index].answer06;
     console.log(choice6);
     choice_arr.push(choice6);
    }

    quiz_title=quiz_questions[index].answer;
    console.log(choice_arr);
   if (quiz_questions[corect_answer] == 'answer01') {
       corect_answer=choice1;
   }
     else if (quiz_questions[corect_answer] == 'answer02') {
       corect_answer=choice2;
   }
     else if (quiz_questions[corect_answer] == 'answer03') {
       corect_answer=choice3;
   }
     else if (quiz_questions[corect_answer] == 'answer04') {
       corect_answer=choice4;
   }
     else if (quiz_questions[corect_answer] == 'answer05') {
       corect_answer=choice5;
   }
     else if (quiz_questions[corect_answer] == 'answer06') {
       corect_answer=choice6;
   }
  else {
     corect_answer="none";
 }
  console.log(corect_answer);
  quiz_name= "quiz"+(index+1);
  
quiz_question1 = {
    questions: [
      {
            type: quiz_type,
            name: quiz_name,
            title: quiz_title,
            choices: choice_arr,
            correctAnswer: corect_answer
      }
     ]
};
json1.pages.push(quiz_question1);
console.log(quiz_question1);
console.log(json1);
choice_arr = [];
}


var json = {
    title: "American History",
    showProgressBar: "bottom",
    showTimerPanel: "top",
    maxTimeToFinishPage: 10,
    maxTimeToFinish: 25,
    firstPageIsStarted: true,
    startSurveyText: "Start Quiz",
    pages: [
        {
            questions: [
                {
                    type: "html",
                    html: "You are about to start quiz by history. <br/>You have 10 seconds for every page and 25 seconds for the whole survey of 3 questions.<br/>Please click on <b>'Start Quiz'</b> button when you are ready."
                }
            ]
        }, {
            questions: [
                {
                    type: "radiogroup",
                    name: "civilwar",
                    title: "When was the Civil War?",
                    choices: ["1750-1800", "1800-1850", "1850-1900", "1900-1950", "after 1950"],
                    correctAnswer: "1850-1900"
                }
            ]
        }, {
            questions: [
                {
                    type: "radiogroup",
                    name: "libertyordeath",
                    title: "Who said 'Give me liberty or give me death?'",
                    choicesOrder: "random",
                    choices: [
                        "John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"
                    ],
                    correctAnswer: "Patrick Henry"
                }
            ]
        }, {
            maxTimeToFinish: 15,
            questions: [
                {
                    type: "radiogroup",
                    name: "magnacarta",
                    title: "What is the Magna Carta?",
                    choicesOrder: "random",
                    choices: [
                        "The foundation of the British parliamentary system", "The Great Seal of the monarchs of England", "The French Declaration of the Rights of Man", "The charter signed by the Pilgrims on the Mayflower"
                    ],
                    correctAnswer: "The foundation of the British parliamentary system"
                }
            ]
        }
    ],
    completedHtml: "<h4>You have answered correctly <b>{correctedAnswers}</b> questions from <b>{questionCount}</b>.</h4>"
};

window.survey = new Survey.Model(json1);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .innerHTML = "result: " + JSON.stringify(result.data);
    });

$("#surveyElement").Survey({model: survey});
}

function resetQuestionSetForm1()
{
$("#questionsetform1").trigger("reset");
}

function resetQuizForm1()
{
$("#quizform1").trigger("reset");
}

function quizQuestions(response) {
console.log(response);
quiz_questions = JSON.parse(response);
console.log(quiz_questions);
}

function questionSetTitle(response) {
console.log(JSON.parse(response));
obj = JSON.parse(response);
$.each(obj,function(i,item){
  title=item.qset_title;
  console.log(title);
});
}
/* ##################### Code for Question Set and Quiz generation ends here ############### */
