// constants //
const cards = document.querySelectorAll('.card');
const winMsg = $('.popout, .win-message');
const restartMsg = $('.popout, .restart-message');
const gamePage = $('.game-page');

// on load - start page
$( document ).ready(function() {
    loadSplash();
});

function loadSplash(){
    animateBackground(40, $(".start-page"));
    animateBackground(10, $("main"));
    $('.start-page-text').show();
}

// animate mousemove on bg -> https://codepen.io/Mojer/pen/VrqrbN
function animateBackground(movementStrength, bg){
    let height = movementStrength / $(window).height();
    let width = movementStrength / $(window).width();
    $(bg).mousemove(function(e){
        let pageX = e.pageX - ($(window).width() / 2);
        let pageY = e.pageY - ($(window).height() / 2);
        let newvalueX = width * pageX * -1 - 25;
        let newvalueY = height * pageY * -1 - 50;
        $(bg).css("background-position", newvalueX+"px     "+newvalueY+"px");
        $(bg).css("background-size", "cover");
        $(bg).css("background-repeat", "no-repeat");
    });
}

//shuffle cards
function shuffleCards(){
    cards.forEach(card => {
        let shuffle = Math.floor(Math.random() * 12);
        card.style.order = shuffle;
    });
    $('.card img').attr('draggable', 'false');
}

// flip two cards 
let openCards = [];
function flipCard() {
    $(this).addClass('flipped');
    openCards.push($(this));
    if (openCards.length == 2){
        matchCards(openCards[0], openCards[1]);
    }
}
cards.forEach(card => card.addEventListener('click', flipCard));

// check if card matches
function matchCards(card1, card2){
    $(cards).each(function(){
        $(this).css("pointer-events", "none");
    });
    if (card1.attr('id') === card2.attr('id')){
        console.log('matched')
        isMatched();   
    } else {
        console.log('not matched');
        isNotMatched(card1, card2);
    }
};


// tracks # of matches and moves
let numOfTurns = 00;
let numOfMatches = 00;
// add '0' if moves < 10, empty array, enable click
function numOfCount(){
    numOfTurns++;
    if (numOfTurns<10){
        $("#moves").html('0'+numOfTurns);
      } else {
        $("#moves").html(numOfTurns);
      }  
    $("#score").html('0'+numOfMatches);

    openCards.length = 0;
    $(cards).not('.flipped').each(function(){
        $(this).css("pointer-events", "auto");
    })
}

// if card matches
function isMatched(){
    numOfMatches++;
    if(numOfMatches === 06){
        wonGame();
    }
    numOfCount();
};

// if card is not matched
function isNotMatched(card1, card2){
    setTimeout(() => {
        $(card1).removeClass('flipped');
        $(card2).removeClass('flipped');
        numOfCount();
      }, 1000);
}

// won game
function wonGame(){
    $(".total-score").html(numOfTurns + 1);
    $(winMsg).fadeIn();
    clearTimeout(time);

    $('.btn-play-again').click(function(){
        resetGame();
        $(winMsg).hide();
    })

    $('.btn-quit').click(function(){
        resetGame();
        clearInterval(time);
        $(winMsg).hide();
        $(gamePage).hide();
        loadSplash();
    })
}

// reset game
function resetGame(){
    resetTimer();
    startTimer();
    $(cards).removeClass('flipped');
    $(cards).each(function(){
        $(this).css("pointer-events", "auto");
    })
    openCards.length = 0
    numOfMatches=00;
    numOfTurns=00;
    $(".moves").html('0'+numOfTurns);
    $("#score").html('0'+numOfMatches);
    setTimeout(() =>{
        shuffleCards();
    }, 500)
}


// timer
let sec = 0;
let time;
function pad ( val ) { return val > 9 ? val : "0" + val; };

function timer(){
    sec = 0;
    time = setInterval(setTime, 1000);
}

function setTime(){
    $(".seconds").html(pad(++sec%60));
    $(".minutes").html(pad(parseInt(sec/60,10)));
}
// execute timer on first click
function startTimer(){
    $('.gameboard').one("click", function() {
        resetTimer();
        timer();
    });
}

function resetTimer(){
    sec = 0;
    clearInterval(time);
    $(".seconds").html('00');
    $(".minutes").html('00');
}


// CLICK EVENTS //
// start game
$('.btn-start').click(function(){
    $('.start-page-text').hide();
    $(gamePage).fadeIn();
    $(gamePage).css("display", "flex");
    shuffleCards();
    startTimer();
    $('main, .start-page').unbind();
});

// reset game
$('.btn-restart').click(function(){
    $(restartMsg).fadeIn();
    clearInterval(time);

    $('.btn-restart-yes').click(function(){
        resetGame();
        $(restartMsg).hide();
    });
    
    $('.btn-restart-no').click(function(){
        timer();
        $(restartMsg).hide();
    });
});