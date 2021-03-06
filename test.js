//import './style.css';
//import 'phaser';

const appDiv = document.getElementById('app');
const width = 400;
const height = 600;
var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,    
  parent: appDiv,//div, w którym dzieje się rozgrywka
  physics: {
    default: 'arcade'
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var ship;
var cursors;
var explosion;
var back;
var score = null;
var end = null;
var shot;
var counter = 24;

var group;
var nextBulletTime = 0;
var chance = 10;
var gameOver = false;
var shipDestroyed = false;
var outOfBounds = 1;
//var bounds;// = Phaser.GetBounds.getBottomBounds();//this.physics.arcade.bounds;
//var bottomBounds = Phaser.GetBounds.getBottomBounds();

function preload() {
  this.load.baseURL = 'https://examples.phaser.io/assets/';
  this.load.crossOrigin = 'anonymous';
  this.load.image('background', 'games/invaders/starfield.png');
  this.load.image('bullet', 'games/invaders/bullet.png');
  this.load.image('bomb', 'games/invaders/enemy-bullet.png')
  this.load.image('ship', 'games/invaders/player.png');
  this.load.image('invader', 'games/invaders/invader.png')
  this.load.spritesheet('explosion','games/invaders/explode.png',{frameWidth:180,frameHeight:120});
}

function create() {
  back = this.add.tileSprite(0, 0, width, height, 'background');
  back.setOrigin(0,0);
  back.setOrigin(0);

  //back.setScrollFactor(100,100); fixedToCamera = true;


  ship = this.physics.add.sprite(width/2, height*0.9, 'ship');
  ship.setOrigin(0.5);
  ship.setScale(2);
  ship.body.collideWorldBounds = true; //koliduje z granicami świata
 

  
  cursors = this.input.keyboard.createCursorKeys();
  shot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  restart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  
  group = this.physics.add.group({
    key: 'invader',
    frameQuantity: 24,
    gridAlign: {
        x: 30,
        y: 50,
        width: 8,
        height: 8,
        cellWidth: 40,
    },
    setScale: {x: 2, y: 2},
    bounceX: 1,
    bounceY: 0,
    collideWorldBounds: true
    });

    group.setVelocityX(80);
    group.setVelocityY(120);

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
      frameRate: 40//,
      //repeat: 1
  });

    var physics = this.physics;
    this.physics.add.collider(group, ship, function () {//w arg. mogą być te obiekty
      gameOver = true;
      var explosion = physics.add.sprite(ship.body.x+ship.body.width/2,ship.body.y).setOrigin(0.5).setScale(0.25);
      explosion.anims.play('explode');
      explosion.body.velocity.y=50;
      ship.disableBody(true,true)
      shipDestroyed = true;
      console.log("gameover")
  });


  //console.log(bounds.y)
  /*group.getChildren().forEach((concreteInvader) => {
    console.log(this.bounds.y)
    physics.add.collider(concreteInvader,bounds, function (concreteInvader, bounds) {
      //concreteInvader.body.setCollideWorldBoundsY(false)
        console.log(height)
        if (bounds.y>height-30) {
        console.log("weszlo")
        concreteInvader.body.setCollideWorldBounds(false)
        }
      });
  },this);*/


}

function update() {
  
if(chance == 10 && group.children.size <= 18){
  chance = 15;
}
if(chance == 15 && group.children.size <= 12){
  chance = 20;
}
if(chance == 20 && group.children.size <= 6){
  chance = 40;
}

  if (restart.isDown) {
    this.registry.destroy();
    this.events.off();
    this.scene.restart();
    if (gameOver) gameOver = false;
    if (shipDestroyed) shipDestroyed = false;
    if (score!==null) score = null;
    if (end!==null) end = null;
    nextBulletTime = 0;
  }

  var physics = this.physics;
    if (gameOver && !shipDestroyed){
        score = this.add.text(200, 200, "score: "  + (24 - group.children.size)*outOfBounds.toString(), { fontSize: "32px"});
        end = this.add.text(200, 300, "YOU WIN", { fontSize: "48px"});
        end.setOrigin(0.5);
        score.setOrigin(0.5);
        
    }
    else if (gameOver) {
        if 
          (score===null) score = this.add.text(200, 200, "score: "  + (24 - group.children.size)*outOfBounds.toString(), { fontSize: "32px"});
        else 
          score.setText("score: "  + (24 - group.children.size).toString())
        if (end===null)
          end = this.add.text(200, 300, "GAME OVER", { fontSize: "48px"});
        else if (group.children.size===0 && outOfBounds==1)
          end.setText("YOU WIN")
        end.setOrigin(0.5);
        score.setOrigin(0.5);

        
    }
    ship.body.velocity.x = 0;

    if (cursors.left.isDown) { //reakcja statku na próbę przesunięcia
      ship.body.velocity.x = -200;
      console.log('w lewo')
    } else if (cursors.right.isDown) {
      ship.body.velocity.x = 200;
      console.log('w prawo')
    }
  
    group.getChildren().forEach(function(enemy) {
      if (enemy.body.y+enemy.body.height/2>=height-20) {
        enemy.destroy()
        outOfBounds = 0;
      
      }

        let temp = Math.floor(Math.random() * 10000);

        if(temp < chance && !shipDestroyed){
            var bomb = this.physics.add.sprite(enemy.body.x, enemy.body.y, 'bomb')
            bomb.body.velocity.y = 200;
            this.physics.add.collider(bomb, ship, function () {
              var explosion = physics.add.sprite(ship.body.x+ship.body.width/2,ship.body.y).setOrigin(0.5).setScale(0.25);
              explosion.anims.play('explode');
              explosion.body.velocity.y=100;
              ship.disableBody(true,true);
              shipDestroyed = true;
              gameOver = true;
          });
        }
    }, this);

    if (shot.isDown && this.time.now>=nextBulletTime && !shipDestroyed) {
      console.log(this.time.now)
      console.log('spacja')
      var bullet = this.physics.add.sprite(ship.body.x + ship.body.width / 2, ship.body.y - 10, 'bullet');
      this.physics.add.collider(bullet, group, function (bullet, concreteInvader) {
        var explosion = physics.add.sprite(concreteInvader.body.x+concreteInvader.body.width/2,concreteInvader.body.y+concreteInvader.body.height/2).setOrigin(0.5).setScale(0.25);
        explosion.anims.play('explode')
        explosion.body.velocity.y=-100;
        //explosion.destroy();
        concreteInvader.destroy();
        bullet.destroy();
        if (group.children.size == 0){
          gameOver = true;
      }
    });
    nextBulletTime = this.time.now + 500; //w 2-ce game.time.now
    console.log(nextBulletTime)
    bullet.body.velocity.y = -200;
  }
}