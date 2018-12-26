/*
 * Create a list that holds all of your cards
 */
let cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o','fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb',
            ];

function createCard(card){
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

//Globals
let time = 0;
let count = 0;
let openCards = [];
let clockId;
let check = 0;
let timeDisplay;

//adding clock to the score Panel
$('.score-panel').append('<span class="clock"></span>');
$('.clock').css({"padding-left": "10px"});


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function generateBoard(){
  let deckOfcards = shuffle(cards).map(function(card){
    return createCard(card);
  });
  $('.deck').html(deckOfcards);
}
 // function generateBoard(){
 //   $('.deck').html( shuffle(cards).map(function(card){
 //     return createCard(card);
 //   }));
 //  }
 generateBoard();


// clikced card open and match check
$('body').on("click", ".card", function(e) {
  let $this = $(this)//save $(this) as a varible
  if (!$this.is(".open.show")) {
    movesCounter();
    openCards.push($this);
    if (openCards.length < 3) {
      $this.addClass("open show");
    }
    if(openCards.length === 2){
      firstCard = openCards[0];
      secondCard = openCards[1];
// compare cards if they match according to their data
      if(firstCard.data('card') === secondCard.data('card')){
        firstCard.addClass("open show match");
        secondCard.addClass("open show match");
        openCards = [];
        check++;
        console.log("check is", check);
      }
      else {
        setTimeout(function() {
          removeClasses();
        }, 1000);
      }
    }
  }
  //if moves where equal to 8 as 16 cards divided by 2 matched call the function wonGame
  if (check === 8){wonGame();}
});

//remove show and open class function
function removeClasses() {
  //loop over the array of open cards
  openCards.forEach(function(card) {
    //remove the open and show class from open cards only
    card.removeClass('open show');
  })
  openCards = []; //open crds is empty
}

// restrt the game
$(".restart").on("click", function(e){
    console.log("clicked");
    generateBoard();
    reSet();
  });

// function counts how many cards were clicked
function movesCounter(){
  count = count + 1;// count moves
  if(count ===1){startclockTime();}//once first card clicked times function invoked
  $('.moves').html(count);
  if(count === 16 || count === 24 || count === 30){
    starDrop(count)
  }
}

// function that changes the star awarded
function starDrop(numb){
  $('.stars li').each( function(i){
    if(this.style.display !== 'none'){
      this.style.display = 'none';
      return false;
    }
  });
}

// function that resets the game
function reSet(){
  count = 0;
  $('.moves').html('');
  $('.stars li').each( function(i){
    this.style.display = '';
  });
  stopClock();
  time = 0;
  check = 0;
}

// function that starts the clock
function startclockTime(){
   clockId = setInterval(() => {
    time++;
    displayTime();
  },1000);
}

// function that displays the time
function displayTime(){
  let seconds = time % 60;
  let minutes = Math.floor(time/60);
  timeDisplay = (seconds < 10)? `${minutes}:0${seconds}`: `${minutes}:${seconds}`;
  $('.clock').html(timeDisplay);
}

// function that stops the clock once the game is reset
function stopClock(){
  clearInterval(clockId);
  $('.clock').html('');
}
//function to determine that the game is done
function wonGame(){
    stopClock();
    modalData();
    $('.modal_background').removeClass('hide');
}
// modal function displays to the user his score, time and moves
function modalData(){
  $('.modal_time').html(function(){
    return "Time = " + timeDisplay +"";
  });
  $('.modal_moves').html(function(){
    return "Moves = "+ count +"";
  });
  $('.modal_stars').html( function(){
    let starC = 0;
    $('.stars li').each( function(i){
      if(this.style.display !== 'none'){
        starC++;
      }
    });
    return "Stars = "+ starC+"";
  });
}
// eventlistener for cancel button
$('.modal_cancel').on('click', function(e){
  $('.modal_background').addClass('hide');
});
// eventlistener for replay button
$('.modal_replay').on('click', function(e){
  reSet();
  generateBoard();
  $('.modal_background').addClass('hide');
});
