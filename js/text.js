var pause = false;
var buzzed = false;
var curNum =  1;
var finish = true;
var correct = false;
var qu = readQues(curNum);
var an = readAns(curNum);
var len = getLen();
var score = 0;

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
getScore(player);
score = score + 5;
var scoreRef = firebase.database().ref("scores/p" + player + "/");
scoreRef.update({val: score});
}

function removeScore(player) {
getScore(player);
score = score - 5;
var scoreRef = firebase.database().ref("scores/p" + player + "/");
scoreRef.update({val: score});
}

function write2() {
alert("I am an alert box!");
}

function getScore(num) {
firebase.database().ref("scores/p1/").once("value", function(snapshot) {
		score = snapshot.val().val;
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
    $('.quesType').html(text.substring(0, n+1));
    n++;
    setTimeout(function() {
      typeWriter(text, n)
    }, 10);
  }
  if (n == text.length) {
  	finish = true;
  }
}

function startText() {
	if (finish && !buzzed)
	{
		setQues();
		correct = false;
		var text = $('.quesType').data('text');
		typeWriter(text, 0);
		finish = false;
	}

}

function buzz() {
	pause = true;
	buzzed = true;
	$('div').removeClass('has-success');
	$('div').removeClass('has-error');
	$('div').addClass('has-warning');
}

function answer() {
	if (buzzed)
	{
		pause = false;
		var text = $('.quesType').data('text');
		typeWriter(text, $('.quesType').text().trim().length);
		var response = $('input').val();
		$('div').removeClass('has-warning');
		$('div').removeClass('has-success');
		$('div').removeClass('has-error');
		if (response === an)
		{
			updateScore(1);
			$('div').addClass('has-success');
			correct = true;
			$('.quesType').html(text.substring(0, text.length));
			finish = true;
		}
		else
		{
			removeScore(1);
			$('div').addClass('has-error');
		}
	}
	buzzed = false;

}

