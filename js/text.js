var pause = false;
var buzzed = false;
var curNum = 1;
var finish = true;
var correct = false;
var len = 1;
getLen();
var qu = "";
var an = "";
readQues(curNum);
readAns(curNum);
var score = 0;
getScore();

function runFirst() {
    document.getElementById("inputAnswer").value = "";
    document.body.onkeyup = function(e) {
        if (e.keyCode == 32) {
            if (this === document.activeElement) {
                buzz();
            }
        }
        if (e.keyCode == 78) {
            if (this === document.activeElement) {
                startText();
            }
        }

        if (e.keyCode == 13) {
            if (this != document.activeElement) {
                answer();
                document.activeElement.blur();
            }
        }
        
        if (e.keyCode == 83) {
            if (this === document.activeElement) {
            	giveup();
            }
        }
        
        if (e.keyCode === 27) {
            document.activeElement.blur();
        }
    }
}

window.onload = runFirst;

function parseText() {
	var str = document.getElementById("uploadQues").value;
	var res = str.split("^^^");
	for (var i = 1; i <= res.length; i++) {
		var parts = res[i-1].split("$$");
		var qRef = firebase.database().ref("q" + i + "/");
		qRef.set({
			q: parts[0],
			a: parts[1]
			});
	}
	
	firebase.database().ref().update({leng: res.length});
}
function write4() {
    var playersRef = firebase.database().ref("players/");

    playersRef.set({
        John: {
            number: 1,
            age: 30
        },

        Amanda: {
            number: 2,
            age: 20
        }
    });
}

function updateScore(player) {
    getScore();
    score = score + 5;
    var scoreRef = firebase.database().ref("scores/p" + player + "/");
    scoreRef.update({
        val: score
    });
}

function removeScore(player) {
    getScore();
    score = score - 5;
    var scoreRef = firebase.database().ref("scores/p" + player + "/");
    scoreRef.update({
        val: score
    });
}

function write2() {
    alert("I am an alert box!");
}

function getScore() {
    firebase.database().ref("scores/p1/").once("value", function(snapshot) {
        score = snapshot.val().val;
        document.getElementById("displayScore").innerHTML = "Score: " + score;
    });
}

function getLen() {
    firebase.database().ref().once("value", function(snapshot) {
        len = snapshot.val().leng;
    });
}

function readQues(num) {
    firebase.database().ref("q" + num + "/").once("value", function(snapshot) {
        qu = snapshot.val().q;
    });
}

function readAns(num) {
    firebase.database().ref("q" + num + "/").once("value", function(snapshot) {
        an = snapshot.val().a;
    });
}

function setQues() {
		readAns(curNum);
    curNum = Math.floor((Math.random() * len)) + 1;
    readQues(curNum);
    $('.quesType').data('text', qu);
}

function typeWriter(text, n) {
    if ((n < (text.length)) && !pause) {
        if (correct) {
            return;
        }
        $('.quesType').html(text.substring(0, n + 1));
        n++;
        setTimeout(function() {
            typeWriter(text, n)
        }, 30);
    }
    if (n == text.length) {
        finish = true;
    }
}

function startText() {
    if (finish && !buzzed) {
        setQues();
        $('.quesType').data('text', qu);
        correct = false;
        var text = $('.quesType').data('text');
        typeWriter(text, 0);
        finish = false;
        $('div').removeClass('has-success');
        $('div').removeClass('has-error');
        $('div').removeClass('has-warning');
        document.getElementById("inputAnswer").value = "";
    }

}

function buzz() {
	if (!correct)
	{
    document.getElementById("inputAnswer").focus();
    pause = true;
    buzzed = true;
    $('div').removeClass('has-success');
    $('div').removeClass('has-error');
    $('div').addClass('has-warning');
    document.getElementById("inputAnswer").value = "";
   }
}

function answer() {
    if (buzzed) {
        pause = false;
        var text = $('.quesType').data('text');
        typeWriter(text, $('.quesType').text().trim().length);
        var response = $('input').val();
        $('div').removeClass('has-warning');
        $('div').removeClass('has-success');
        $('div').removeClass('has-error');
				f = FuzzySet([an]);
        var close = f.get(response);
 
        if (close[0][0] > 0.6) {	
            updateScore(1);
            $('div').addClass('has-success');
            correct = true;
            $('.quesType').html(text.substring(0, text.length));
            finish = true;
            document.getElementById("correctAns").innerHTML = "Correct Answer: " + an;
        } else {
            removeScore(1);
            $('div').addClass('has-error');
        }
        getScore();
    }
    buzzed = false;
}

function giveup()
{
	var text = $('.quesType').data('text');
  typeWriter(text, $('.quesType').text().trim().length);
	removeScore(1);
	correct = true;
	$('.quesType').html(text.substring(0, text.length));
	finish = true;
	document.getElementById("correctAns").innerHTML = "Correct Answer: " + an;
}