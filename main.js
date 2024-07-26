const $ = document.querySelector.bind(document);
const selectors={
    boardContainer : document.querySelector('.board-container'),
    start: document.querySelector('button'),
    moves: document.querySelector('.move'),
    timer: document.querySelector('.timer'),
    board: document.querySelector('.board'),
    win: document.querySelector('.win'),
    audio:document.querySelector('#audio'),
    music: document.querySelector('.btnMusic')
}

const state={
    gameStarted : false,
    flippeddCards:0,
    totalFlips:0,
    totalTime:0,
    loop:null,
    isPlaying:false
}
    //xáo trộn các phần tử trong mảng 
 const shuffle= array =>{
    //tạo bản sao của mảng
    const clonedArray= [...array];

    for(let i=clonedArray.length-1; i>0;i--){
        // Tạo một chỉ số ngẫu nhiên từ 0 đến i (bao gồm i)
        const randomIndex= Math.floor(Math.random()* (i+1));
        //swap
        const original=clonedArray[i];
        clonedArray[i]=clonedArray[randomIndex];
        clonedArray[randomIndex]=original;
    }
    return clonedArray;
 }
        //chọn các phần tử nhẫu nhiên 
 const pickRandom= (array,items) =>{
    const clonedArray=[...array];
    const randomPicks=[];

    for(let i=0;i<items;i++){
         // Tạo chỉ số ngẫu nhiên từ 0 đến độ dài hiện tại của clonedArray
        const randomIndex= Math.floor(Math.random() * clonedArray.length);
//Trong mỗi lần lặp, tạo chỉ số ngẫu nhiên, thêm phần tử tương ứng vào mảng kết quả và loại bỏ phần tử này khỏi bản sao của mảng đầu vào.
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex,1);
    }
    return randomPicks;
 }

 const generateGame= ()=>{
    const dimensions = selectors.board.getAttribute('data-dimension');

    if(dimensions % 2 !== 0){
        throw new Error("The dimensions of the board must be an event number");
    }
    const emojis=['🍇','🍈','🍉','🍍','🍌','🍋‍','🍐','🍎','🫐','🍒','🥑','🌻','☘️','🍑','🥬','🍀','🍁'];
    // Chọn ngẫu nhiên các biểu tượng từ mảng emojis
    const picks = pickRandom(emojis,(dimensions * dimensions)/2);
    //Gộp đôi mảng picks (để có hai thẻ cho mỗi biểu tượng) và trộn ngẫu nhiên các biểu tượng bằng hàm shuffle.
    const items= shuffle([...picks,...picks]);
    const cards=`
        <div class="board" style="grid-template-columns: repeat(${dimensions},auto)"> 
            ${items.map(item =>`
                <div class="card">
                <div class="card-front"></div>
                <div class="card-back">${item}</div>
                </div>
                `).join('')}
        </div>
    `
    //  const parser= new DOMParser().parseFromString(cards,'text/html');
    //  selectors.board.replaceWith(parser.querySelector('.board'))
    selectors.board.innerHTML =cards;
    // selectors.boardContainer.classList.add('flipped');
    // selectors.win.innerHTML=`
    // <span class="win-text">
    //     You Won! <br />
    //     with <span class="highlight">${state.totalFlips}</span>
    //     moves<br />
    //     under <span class="highlight">${state.totalTime}</span>
    //     seconds
    // </span>
    // `
 }

 const startGame= ()=>{
    state.gameStarted= true;
    selectors.start.classList.add('disabled');

    state.loop= setInterval(()=>{
        state.totalTime++;

        selectors.moves.innerHTML=`${state.totalFlips } `;
        selectors.timer.innerHTML= `${state.totalTime}`
    }, 1000)
 }

 const flipBackcards= ()=>{
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippeddCards=0;
 }

 const flipCard = card =>{
    state.flippeddCards++;
    state.totalFlips++;

    if(!state.gameStarted){
        startGame();
    }
    if(state.flippeddCards <= 2){
        //nếu số card <=2 thì thêm lớp flipped vào thẻ đó  
        card.classList.add('flipped');
    }
    if(state.flippeddCards ===2){
        //khi số lượng thẻ đãm = 2 thì chọn các thẻ có lớp fipped mà không có lớp matched
        const flippedCards= document.querySelectorAll('.flipped:not(.matched)');
        // kiểm tra xem hai thẻ đã lật giống nhau  
                if(flippedCards[0].innerText === flippedCards[1].innerText){
                    flippedCards[0].classList.add('matched');
                    flippedCards[1].classList.add('matched');
                    state.flippeddCards=0;
                }else{
                       setTimeout(()=>{
                    flipBackcards();
                },1000)
                }
             
            }
            if(!document.querySelectorAll('.card:not(.flipped').length){
                setTimeout(()=>{
                    selectors.boardContainer.classList.add('flipped');
                    selectors.win.innerHTML=`
                    <span class="win-text">
                        You Won! <br />
                        with <span class="highlight">${state.totalFlips}</span>
                        moves<br />
                        under <span class="highlight">${state.totalTime}</span>
                        seconds
                    </span>
                    `
                    clearInterval(state.loop)
                },1000)
            }

    }
        

 const attachEventListeners= ()=>{
    document.addEventListener('click', event =>{
        const eventTarget= event.target;
        const eventParent = eventTarget.parentElement;
        
        if(eventTarget.className.includes('card') && !eventParent.className.includes('flipped')){
            flipCard(eventParent);
        }else if(eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')){
            startGame();
        }
        

    })
 }
  const musicEvent=()=>{
    selectors.music.onclick = function(){
        if(state.isPlaying){
        selectors.audio.pause()
        }else{
        selectors.audio.play()
        }
    }
    audio.onplay = function(){
        state.isPlaying =true
        selectors.music.classList.add('playing') 
    }
        audio.onpause= function(){
        state.isPlaying =false
        selectors.music.classList.remove('playing')
        }
  }
 generateGame();
 musicEvent();
attachEventListeners();