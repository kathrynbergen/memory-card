//Changes page to game & stores game mode preference inputs
function playGame(){	
	localStorage.setItem("difficulty", document.getElementById("difficulty-list").value);
	localStorage.setItem("category", document.getElementById("category-list").value);
	location.replace("game.html");
}

