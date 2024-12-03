/**
 * Memory Game
 * Author: Kathryn Bergen and Esther Seok
 * Date: April 26, 2024
 * 
 * Description:
 * This game is a captivating memory challenge where players strive to match pairs of cards to score points.
 * Each round, players click on two cards to reveal their images. 
 * If the cards match, the player earns 100 points; 
 * If they don't, the player loses 10 points. 
 * The objective is to remember the positions of previously revealed cards to make successful matches in subsequent attempts. 
 */

let difficulty = localStorage.getItem("difficulty"); //Integer to determine the size of the gameboard - can be 3, 5, or 7
let category = localStorage.getItem("category"); //File location of that card, for example "cards/"
let displayedImages = [];
let imagesSelectedCorrectly = [];
let selectionMade = false;
let index1 = null;
let id1 = null;
let points = 0;
let ready = true;
let gameOver = false;

function scrambleImages(){//Sets up game board
	let selectedImages = chooseImages(difficulty*3); //Chooses random images to be displayed
	let randomizedImages = swapImages(selectedImages, difficulty*3); //Shuffles the images
	
	let index = 0; 
	for(let i=0;i<3;i++)
	{
		for(let j=0;j<7;j++)
		{
			let tempIndex = i*7+j;
			if(j<difficulty) 
			{
				document.getElementById("image"+tempIndex).style.border = "3px solid white";
				document.getElementById("image"+tempIndex).src = category+"back.png"; 
				document.getElementById("image"+tempIndex).style.visibility = "visible";
				displayedImages[tempIndex] = randomizedImages[index];
				imagesSelectedCorrectly[tempIndex] = false;
				index++;
			}
			else
			{
				document.getElementById("image"+tempIndex).style.visibility = "hidden";
				document.getElementById("image"+tempIndex).style.width = "0px";
			}
		}
	}
	document.getElementById("title").innerHTML = "Find the matching "+category.substring(0,category.length-1)+"!";
	points = 0;
	gameOver = false;
	document.getElementById("points").innerHTML = "Points: "+points;
	document.getElementById("status").innerHTML="";
	document.getElementById("reveal").disabled=false;
	document.getElementById("reset").style.visibility="hidden";
	if(localStorage.getItem("highScore")!=null)
	{
		document.getElementById("high-score").innerHTML = "High Score: "+localStorage.getItem("highScore");
	}
}

function chooseImages(numImage) {//Chooses indexes for images on the game board
    let chosenNumbers = []; // Use an array to hold unique numbers

    while (chosenNumbers.length < numImage / 2) {
        let randomNumber = Math.floor(Math.random() * 52) + 1;
        if (!chosenNumbers.includes(randomNumber)) { // Check if the number is already in the array
			chosenNumbers[chosenNumbers.length] = randomNumber;
        }
    }
    
	// Duplicate each number to have pairs
	let imageNumbers = chooseImageNumbers(chosenNumbers);

    // Add one single number that doesn't have a pair
	if( numImage%2 != 0 ){ 
		let singleNumber;
		do {
			singleNumber = Math.floor(Math.random() * 52) + 1;
		} while (chosenNumbers.includes(singleNumber)); // Ensure the single number is unique
		imageNumbers[imageNumbers.length] = singleNumber;
	}
    return imageNumbers;
}

function chooseImageNumbers(numbers) //Duplicates each value in the array
{
	let finalNumbers = [];
	for (let i = 0; i < numbers.length; i++) {
		finalNumbers[finalNumbers.length] = numbers[i]; // Add the number to the end of the array
		finalNumbers[finalNumbers.length] = numbers[i]; // Add the number again to create a pair
	}
	return finalNumbers;
}

function swapImages(imageNumbers, numImage) {//Shuffles images randomly on the game board
    let swapCount = 100; // Number of times to swap elements
    for (let i = 0; i < swapCount; i++) {
        // Pick two random indices in the array
        let index1 = Math.floor(Math.random() * numImage);
        let index2 = Math.floor(Math.random() * numImage);

        // Swap the elements at these indices
		if( imageNumbers[index1] != imageNumbers[index2] ){ 
			// Swap the elements at these indices
			let temp = imageNumbers[index1];
			imageNumbers[index1] = imageNumbers[index2];
			imageNumbers[index2] = temp;
		}
    }
	
	return imageNumbers;
}

function cardClicked(id) //Updates game board when a card is clicked
{
	if( ready == false) return;
	
	index = parseInt(id.substring(5)); //Integer can be from 0-20, one for each card on the game board
	if(!selectionMade && !imagesSelectedCorrectly[index] && !gameOver) //First image selected
	{
		index1 = index;
		id1 = id;
		document.getElementById(id).style.border = "3px solid blue";
		document.getElementById(id).src = category + displayedImages[index] + ".png"; 
		selectionMade = !selectionMade;
	}
	else if(index1!=index && !imagesSelectedCorrectly[index] && !gameOver){ //2nd image selected
		
		document.getElementById(id).style.border = "3px solid blue";
		document.getElementById(id).src = category + displayedImages[index] + ".png";
		document.getElementById(id1).src = category + displayedImages[index1] + ".png";

		if(displayedImages[index1] == displayedImages[index]) //Player has matched a pair of cards correctly
		{
			points+=100; 
			
			ready = false;
			setTimeout(function() { 
				document.getElementById(id).style.border = "3px solid green";
				document.getElementById(id1).style.border = "3px solid green";
			 
				imagesSelectedCorrectly[index] = true;//Cards can no longer be selected once correctly selected
				imagesSelectedCorrectly[index1] = true;

				if(endGameCheck()) //Returns true when all pairs are found
				{
					gameOver=true;
					document.getElementById("status").innerHTML="You Win!";
					document.getElementById("reset").style.visibility="visible";
					if(localStorage.getItem("highScore")==null || localStorage.getItem("highScore")<points)
					{
						localStorage.setItem("highScore", points);
						document.getElementById("high-score").innerHTML = "High Score: "+points;
					}
				}

				index1=null; 
				id1 = null;
				ready = true;				 
			}, 1000); // Delay for 1 second before making next guess
		}
		else{ //Player has guessed incorrectly
			points-=10;

			ready = false;
			setTimeout(function() {
				document.getElementById(id).style.border = "3px solid white";
				document.getElementById(id1).style.border = "3px solid white";
				document.getElementById(id).src = category + "back.png";
				document.getElementById(id1).src = category + "back.png";
				
				index1=null; 
				id1 = null;
				ready = true;				 
			}, 1000); // Delay for 1 second before making next guess
		}
		if(points<0)
		{
			points=0;
		}
		document.getElementById("points").innerHTML = "Points: "+points;
		selectionMade = !selectionMade;
	}
}
function revealAllImages() //Reveals all cards for a small amount of time
{
	for(let i=0;i<3;i++)
	{
		for(let j=0;j<7;j++)
		{
			if(j<difficulty)
			{
				document.getElementById("image"+(i*7+j)).src = category + displayedImages[i*7+j] + ".png"; //Reveals fronts of all images
			}	
		}
	}
	setTimeout(function() { 
		for(let i=0;i<3;i++)
		{
			for(let j=0;j<7;j++)
			{
				if(j<difficulty && !imagesSelectedCorrectly[i*7+j] && (index1==null || index!=i*7+j)) 
				{
					//Image is part of game board and hasn't already been selected or guessed correctly
					document.getElementById("image"+(i*7+j)).src = category + "back.png"; //Flips back over cards
				}	
			}
		}
			}, difficulty*1000/3); //Cards are revealed longer with a higher difficulty (more cards on the screen)
	document.getElementById("reveal").disabled = true; //Can no longer select hint button
}
function endGameCheck() //Return true if all pairs have been found.
{
	count=0;
	for(let i=0;i<imagesSelectedCorrectly.length;i++)
	{
		if(imagesSelectedCorrectly[i])
		{
			count++;
		}
	}
	if(count>=difficulty*3-1){ //All cards that have pairs on the game board have correctly been paired by the player.
		return true;
	}
	return false;
}
function goToMenu() //Returns to homepage
{
	location.replace("index.html");
}
