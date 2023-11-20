// Importing sound effects
const introMusic= new Audio("./music/introSong.mp3");
const shootingSound= new Audio("./music/shoooting.mp3");
const killEnemySound=new Audio("./music/killEnemy.mp3");
const  gameOverSound=new Audio("./music/gameOver.mp3");
const heavyWeaponSound=new Audio("./music/heavyWeapon.mp3");
const hugeWeaponSound=new Audio("./music/hugeWeapon.mp3");







introMusic.play().catch(error => {
    // Handle the error (e.g., log it)
    console.error('Autoplay failed:', error);
});


//Basic Environment Setup
const canvas=document.createElement("canvas");
document.querySelector(".mygame").appendChild(canvas);
canvas.width=innerWidth;
canvas.height=innerHeight;
const context=canvas.getContext("2d");
const lightweapondamage=10;
const heavyweapondamage=20;
const hugeweapondamage=50;
let playerscore=0;


let difficulty=2;

const form=document.querySelector("form")
const scoreboard=document.querySelector(".scoreboard")

//Basic Function



//Event Listener For Difficulty Form
document.querySelector("input").addEventListener("click",(e)=>{
    e.preventDefault();
    //stoping Music
    introMusic.pause();



    //Making form invisible
    form.style.display="none";
    //Making scoreboard visible
     scoreboard.style.display="block";
    
     //Getting difficulty selected by user
     const uservalue=document.getElementById("difficulty").value;
   
    if (uservalue==="easy"){
        setInterval(spawnEnemy,2000)
        return (difficulty=5)
    }   
    if(uservalue==="medium"){
        setInterval(spawnEnemy,1400)
        return (difficulty=8)
    } 
    if(uservalue==="hard"){
        setInterval(spawnEnemy,1000)
        return (difficulty=10)

    } 
    if(uservalue==="veryhard"){
        setInterval(spawnEnemy,700)
        return (difficulty=12)
    } 
})

//Endscreen
const gameoverloader=()=>{
    //creating endscreen div and play again button and high score div
    const gameOverbanner=document.createElement("div");
    const gameoverbtn=document.createElement("button");
    const highscore=document.createElement("div");

    highscore.innerHTML=`High Score:${
        localStorage.getItem("highScore")
        ?localStorage.getItem("highScore")
        :playerscore
    }`;

    const oldhighScore=
    localStorage.getItem("highScore")&& localStorage.getItem("highScore");

    if(oldhighScore<playerscore){
        localStorage.setItem("highScore",playerscore);
        
    //updating high score html
    highscore.innerHTML=`High Score:${playerscore}`;
    }




    
    //adding text to play again button
    gameoverbtn.innerText="Play Again";
    gameOverbanner.appendChild(highscore);
    gameOverbanner.appendChild(gameoverbtn)
    
    
    
    //making reload on clicking play again button
    gameoverbtn.onclick=()=>{
        window.location.reload();

      };
        gameOverbanner.classList.add("gameover");
        document.querySelector("body").appendChild(gameOverbanner);
        

    };
    


//------------------Creating player,weapon,enemy,etc Classes-----------------------------------------

//setting Player posiotion to center
playerposition={
    x:canvas.width/2,
    y:canvas.height/2,
};

//Creating player class
class player{
    constructor(x,y,radius,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }


    draw() {
    context.beginPath();
    context.arc( this.x,this.y,this.radius,Math.PI / 180 * 0,Math.PI / 180 * 360,false);
    context.fillStyle=this.color;
    context.fill();
  }
   
   



}

// ---------------------------------------------2---------------------------


//creting weapon class
class weapon{
    constructor(x,y,radius,color,velocity,damage){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.damage=damage;

    }

    draw(){
                context.beginPath();
                context.arc( this.x,this.y,this.radius,Math.PI / 180 * 0,Math.PI / 180 * 360,false);
                context.fillStyle=this.color;
                context.fill();
            

        }
   
   
    update(){
        this.draw();
        (this.x+=this.velocity.x),
        (this.y+=this.velocity.y);
         }


}



//creting hugeweapon class
class hugeweapon{
    constructor(x,y,damage){
        this.x=x;
        this.y=y;

        this.color=  "rgba(479,97,255,1)"
        this.damage=damage;
    }

    draw(){
                context.beginPath();
                context.fillStyle=this.color;
                context.fillRect(this.x,this.y,200,canvas.height);
                
            
            

        }
   
   
    update(){
        (this.x+=20)
        this.draw();
        
        
        }


}
// ------------------------------------------3-------------

//creating Enemy class
class enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity

    }

    draw(){
                context.beginPath();
                context.arc( this.x,this.y,this.radius,Math.PI / 180 * 0,Math.PI / 180 * 360,false);
                context.fillStyle=this.color;
                context.fill();
            

        }
   
   
    update(){
        this.draw();
        (this.x+=this.velocity.x),(this.y+=this.velocity.y);
         }


}


//creating Particle class
const fraction=.99
class Particle{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity
        this.aplha=1

    }

    draw()
    {     
                context.save()
                context.globalAlpha=this.aplha;
                context.beginPath();
                context.arc( this.x,this.y,this.radius,Math.PI / 180 * 0,Math.PI / 180 * 360,false);
                context.fillStyle=this.color;
                context.fill();
                context.restore();
            

        }
   
   
    update(){
        this.draw();
        this.velocity.x*=fraction,
        this.velocity.y*=fraction
        this.x+=this.velocity.x,
        this.y+=this.velocity.y;
        this.aplha-=0.01;
        // console.log(this.velocity)
         
    }


}



// --------------------------------Main logic here----------------------------------------

//creating player object,weapon array,enemy array,etc array
const aadi=new player(playerposition.x,playerposition.y,15,"white");


const wep=[]
const enemyarray=[]
const particle=[]
const hugeweapons=[]

//-----------------------Function to create  SpawnEnemy at random location------------------------------
const spawnEnemy=()=>{

    //genrating rando size for enemy
    const enemysize=Math.random()*(40-5)+5;
    //genrating random color for enemy
    const enemycolor= `hsl(${Math.floor(Math.random()*360)},100%,50%)`;

    //random is enemy spawn position
    let random;


    //making enemy location random but only from outside of screen
    if(Math.random()<0.5){
    //Making x equal to very left off of screen or very right off of screen and setting Y to anywhere vertically
        random={
            x:Math.random()<.5? canvas.width +enemysize:0-enemysize,
            y:Math.random()*canvas.height,
            
        }
    }
    else{
    //Making Y equal to very up off of screen or very down off of screen and setting x to anywhere horizontally
            random={
                x:Math.random()*canvas.width,
                y:Math.random()<.5? canvas.height +enemysize:0-enemysize,
        
            }
        }




        // finding angle between center (means player position) and enemy position
    const myangle=Math.atan2(
            canvas.height/2-random.y,
            canvas.width/2-random.x,
        )

    //Making velocity or speed of enemy by multiplying choosen difficulty to radian
    const velocity={
            x:Math.cos(myangle)*difficulty,
            y:Math.sin(myangle)*difficulty,
        };

     //adding enemies to enemyarray
     enemyarray.push(new enemy(random.x,random.y,enemysize,enemycolor,velocity))
    
}



//-----------------------------------------creating animation function-----------------------------------
let animationId;
function animation(){
    //Making Recursion
   animationId=requestAnimationFrame(animation);

    //updating player score in score board html
    scoreboard.innerHTML=`Score:${playerscore}`;




    //clearing canvas on each frame
    context.fillStyle='rgba(49,49,49,.2)';
    
    
    context.fillRect(0,0,canvas.width,canvas.height);
   
   
    //drawing player
    aadi.draw();

   
    //genrating particles
     particle.forEach((p,particleIndex)=>{
        if(p.aplha<=0){
            particle.splice(particleIndex,1)
        }
        else{
        p.update();
        }
     });
    //Genrating huge weapon
    hugeweapons.forEach((hugeweapon,hugeweaponIndex)=>{
        if(hugeweapon.x>canvas.width){
            hugeweapons.splice(hugeweaponIndex,1)

        }
        else{
            hugeweapon.update();
        }
   
    });
    
    
    
    //genrating bullets
    wep.forEach((weapon,weaponIndex)=>{
   
        weapon.update();
    //Removing weapons if they are off screen
        if(weapon.x+weapon.radius<1 ||
            weapon.y+weapon.radius<1||
            weapon.x-weapon.radius>canvas.width||
            weapon.y-weapon.radius>canvas.height ){
            wep.splice(weaponIndex,1);

        }
        


    })
     //genrating enemies
    enemyarray.forEach((enemy,enemyIndex)=>{
          enemy.update();
        
          
        //finding distance between player and enemy  
            const distance_between_player_and_enemy=Math.hypot(
                aadi.x-enemy.x,
                aadi.y-enemy.y
            );

            //stoping game if enemy hit player
            if(distance_between_player_and_enemy-aadi.radius-enemy.radius<1){
              cancelAnimationFrame (animationId);
              gameOverSound.play()
              return gameoverloader();
            }
            

          hugeweapons.forEach((hugeweapon)=>{
            //finding distance between huge weapon and enemy
            const distance_between_hugeweapon_and_enemy = hugeweapon.x - enemy.x;
          
         

          if(distance_between_hugeweapon_and_enemy<=200 && distance_between_hugeweapon_and_enemy>=-200){
            //increasing playerscore when killing one enemy
            playerscore+=10
            setTimeout(()=>{
                killEnemySound.play()
                enemyarray.splice(enemyIndex,1);
            },0);
          }

        })
      
     
            wep.forEach((weapon,weaponIndex)=>{
        //finding distance between weapon and enemy
                const distance_between_weapon_and_enemy=Math.hypot(
                weapon.x-enemy.x,
                weapon.y-enemy.y
            );
            if(distance_between_weapon_and_enemy - weapon.radius - enemy.radius<1){
               





        //Reducing size of enemy on hit
                if (enemy.radius>weapon.damage+8){
                    gsap.to( enemy,{
                        radius:enemy.radius-weapon.damage,
                    });
                    setTimeout(()=>{
                        wep.splice(weaponIndex,1);
                    },0);
                // removing enemy on hit if they are below 18

                }else{

                    for(let i=0;i<enemy.radius*5;i++){
                        particle.push(
                            new Particle(weapon.x,weapon.y,Math.random()*2,enemy.color,{
                                x:(Math.random()-.5)*(Math.random()*7),
                                y:(Math.random()-.5)*(Math.random()*7),
                            })
                        );
                    }
                    //increasing playerscore when killing one enemy
                    playerscore+=10
                    //rendering player score in scoreboard in html element
                    scoreboard.innerHTML=`score:${playerscore}`


                    //
                    setTimeout(()=>{
                        killEnemySound.play()
                        enemyarray.splice(enemyIndex,1)
                        wep.splice(weaponIndex,1);
    
                    },0);
                }

               
               
            }
        })



    })
  
   
}




//-----------------------------Adding Event listeners--------------------------

    //event Listener for light weapon aka left click
canvas.addEventListener("click",(e)=>{
    shootingSound.play()
    
    //finding angle between the player position (center) and click co-ordinates
    const myangle=Math.atan2(
        e.clientY-canvas.height/2,
        e.clientX-canvas.width/2
    )
    //making const speed for light weapon
    const velocity={
        x:Math.cos(myangle)*6,
        y:Math.sin(myangle)*6,
    };

    //adding light weapon in weapons array
    wep.push(new weapon(canvas.width/2,canvas.height/2,7,"white",velocity,lightweapondamage))
    
     

});



    //event Listener for heavy weapon aka right click
    canvas.addEventListener("contextmenu",(e)=>{
        e.preventDefault()

        if (playerscore<=0)return;
        heavyWeaponSound.play()

        //decreasing playerscore for using heavy weapon
        playerscore-=2;
        //updating player score in scoreboard in html element
        scoreboard.innerHTML=`score:${playerscore}`
    
        //finding angle between the player position (center) and click co-ordinates
        const myangle=Math.atan2(
            e.clientY-canvas.height/2,
            e.clientX-canvas.width/2
        )
        //making const speed for light weapon
        const velocity={
            x:Math.cos(myangle)*3,
            y:Math.sin(myangle)*3,
        };
    
        //adding light weapon in weapons array
        wep.push(new weapon(canvas.width/2,canvas.height/2,30,"cyan",velocity,heavyweapondamage))
        
         
    
});



addEventListener("keypress",(e)=>{
      if(e.key===" "){

        if (playerscore<20)return;
        //decreasing playerscore for using huge nweapon
        playerscore-=20;
        //updating player score in scoreboard in html element
        scoreboard.innerHTML=`score:${playerscore}`

        hugeWeaponSound.play()
        hugeweapons.push(new hugeweapon(0,0,hugeweapondamage))
        // console.log(`key:SpaceBar`);
      }


    
});    

addEventListener("contextmenu",(e)=>{
    e.preventDefault()


  
});
addEventListener("resize",()=>{
    window.location.reload();
})

animation();