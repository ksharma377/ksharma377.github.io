var qwerty = "-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?";
var dvorak = "[]',.pyfgcrl/=\\aoeuidhtns-;qjkxbmwvz{}\"<>PYFGCRL?+|AOEUIDHTNS_:QJKXBMWVZ";

function translateToDvorak() {
	var text = document.getElementById('input').value;
	var newText = "";
	for (var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
		if (char == "\n" || char == " ") {
			newText += char;
			continue;
		}
		var index = qwerty.indexOf(char);
		if (index == -1) {
			newText += char;
			continue;
		}
		newText += dvorak.charAt(index);
	}
	document.getElementById('input').value = newText;
}

function translateToQwerty() {
	var text = document.getElementById('input').value;
	var newText = "";
	for (var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
		if (char == "\n" || char == " ") {
			newText += char;
			continue;
		}
		var index = dvorak.indexOf(char);
		if (index == -1) {
			newText += char;
			continue;
		}
		newText += qwerty.charAt(index);
	}
	document.getElementById('input').value = newText;
}

window.onload = function() {
	document.getElementById('input').focus();
	document.getElementById('input').value = "";
	document.getElementById('to-dvorak').addEventListener('click', translateToDvorak, false);
	document.getElementById('to-qwerty').addEventListener('click', translateToQwerty, false);
}
