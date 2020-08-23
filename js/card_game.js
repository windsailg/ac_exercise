const Symbols = [
    'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
    'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
    'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
    'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
];

const view = {
    getCardContent(index){
        const number = this.transformNumber((index%13)+1);
        const symbol = Symbols[Math.floor(index / 13)];
        console.log(symbol)
        return `
            <span>${number}</span>
            <img src="${symbol}">
            <span>${number}</span>
        `
    },
    getCardElement(index){
        return `
            <div data-index="${index}" class="card back">
            </div>
        `
    },
    transformNumber(number){
        switch (number){
            case 1:
              return 'A'
            case 11:
              return 'J'
            case 12:
              return 'Q'
            case 13:
              return 'K'
            default:
              return number;
          }
    },
    displayCard(indexes){
        const cards = document.querySelector('#cards')
        cards.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
    },
    flipCards(... cards){
        cards.map(card=>{
            if(card.classList.contains('back')){
                card.classList.remove('back')
                card.innerHTML = this.getCardContent(Number(card.dataset.index))
                return
            }
            card.classList.add('back')
            card.innerHTML = null
        })
    },
    pairCards(... cards){
        cards.map(card=>{
            card.classList.add('paired')
        })
    },
    renderScore(score){
        document.querySelector('.score').textContent = `Score : ${score}`
    },
    renderTriedTimes(times){
        document.querySelector('.tried').textContent = `You've tried: ${times} times`
    },
    appendWrongAnimation(... cards){
        cards.map(card=>{
            card.classList.add('wrong')
            card.addEventListener(
                'animationend',
                e=>{card.classList.remove('wrong')},
                {once:true}
            )
        })
    },
    showGameFinished () {
        const div = document.createElement('div')
        div.classList.add('completed')
        div.innerHTML = `
          <h2>Complete!</h2>
          <p>Score: ${model.score}</p>
          <p>You've tried: ${model.tryTimes} times</p>
        `
        const header = document.querySelector('#header')
        cards.appendChild(div)
    }
};

const utility = {
    getRandomNumberArray(count){
        const number = Array.from(Array(count).keys())
        for(let index = number.length-1;index > 0; index--){
            // let randomIndex = Math.floor(Math.random()*(index+1))
            let randomIndex = Math.floor(Math.random()*(index+1))
            ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]];
        }
        return number
    }
}

const model = {
    revealedCards:[],
    isRevealedCardsMatched(){
        return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
    },
    score:0,
    tryTimes:0,
}

const gameState = {
    FirstCardAwaits:'FirstCardAwaits',
    SecondCardAwaits:'SecondCardAwaits',
    CardsMatchFailed:'CardsMatchFailed',
    CardsMatched:'CardsMatched',
    GameFinished:'GameFinished',
}

const Controller = {
    currentState: gameState.FirstCardAwaits,
    generateCards(){
        view.displayCard(utility.getRandomNumberArray(52))
    },
    displayCardAction(card){
        if(!card.classList.contains('back')) return
        switch(this.currentState){
            case gameState.FirstCardAwaits:
                this.currentState = gameState.SecondCardAwaits
                model.revealedCards.push(card)
                view.flipCards(card)
                // return this.currentState
            break
            case gameState.SecondCardAwaits:
                view.renderTriedTimes(++model.tryTimes)
                view.flipCards(card)
                model.revealedCards.push(card)
                if(model.isRevealedCardsMatched()){
                    this.currentState = gameState.CardsMatched
                    view.pairCards(... model.revealedCards)
                    view.renderScore(model.score +=130)
                    model.revealedCards = []
                    if (model.score === 260) {
                        this.currentState = gameState.GameFinished
                        view.showGameFinished()
                        return
                      }
                    this.currentState = gameState.FirstCardAwaits
                }else{
                    this.currentState = gameState.CardsMatchFailed
                    view.appendWrongAnimation(... model.revealedCards)
                    setTimeout(this.resetCards, 1000);
                }
                // return this.currentState
            break
        }
    },
    resetCards(){
        view.flipCards(... model.revealedCards)
        model.revealedCards = []
        Controller.currentState = gameState.FirstCardAwaits
    }
}

Controller.generateCards()
document.querySelectorAll('.card').forEach(card =>{
    card.addEventListener('click',()=>{
        Controller.displayCardAction(card)
    })
})



function newMethod(){
    toLowerCase()//將string轉小寫
    includes()//比對陣列中的key有無相符
    matches()//偵測點擊的元素是否為...
    push(... data)
    function fnName(... element){}//可以傳入多個參數
    find();
    slice(5,15);//5是起點 15是終點
    Array.from(Array(52),keys())
    Math.ceil(5.15);//將傳入的值無條件進位 5.15 > 6
    localStorage.setItem('key','value')//存入資料 
    localStorage.getItem('key')//取出資料
    localStorage.removeItem('key')//移除資料

    // week3
    Array.from(Array(52),keys())
}
