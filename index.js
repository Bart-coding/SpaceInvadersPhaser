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
  //backgroundColor: '48a',
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
var explosion;//temp
var back;
var score;
var end;

var group;
var nextBulletTime = 0;
var chance = 5;
var gameOver = false;

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

  //bullet.body.bounce.set(1);
  //this.physics.world.on('worldbounds', ballLost);

  ship = this.physics.add.sprite(width/2, height*0.9, 'ship');
  ship.setOrigin(0.5);
  ship.setScale(2);
  ship.body.collideWorldBounds = true; //koliduje z granicami świata
  //ship.body.immovable = true; //nieprzesuwalny

  /*var bulletTest = this.physics.add.sprite(width/4, height*0.9, 'bullet');//testy
  bulletTest.setOrigin(0.5);
  bulletTest.name = 'bulletTest';*/
  
  cursors = this.input.keyboard.createCursorKeys();
  shot = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
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
    collideWorldBounds: true
    });

    group.setVelocityX(80);
    group.setVelocityY(20);

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 15 }),
      frameRate: 40//,
      //repeat: 1
  });

    var physics = this.physics;//może być globalne
    this.physics.add.collider(group, ship, function () {//w arg. mogą być te obiekty
      gameOver = true;
      var explosion = physics.add.sprite(ship.body.x+ship.body.width/2,ship.body.y).setOrigin(0.5).setScale(0.25);
      explosion.anims.play('explode');
      ship.disableBody(true,true)
      console.log("gameover")
  });
}

function update() {
  var physics = this.physics;//tmp,może być globalne
    if (gameOver){
        score = this.add.text(200, 200, "score: "  + (24 - group.children.size).toString(), { fontSize: "32px"});
        if(group.children.size == 0){
            end = this.add.text(200, 300, "YOU WIN", { fontSize: "48px"});
        } else{
            end = this.add.text(200, 300, "GAME OVER", { fontSize: "48px"});
        }
        score.setOrigin(0.5);
        end.setOrigin(0.5);
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
      //if(enemy.body)
      let temp = Math.floor(Math.random() * 10000);

      if(temp < chance){
          var bomb = this.physics.add.sprite(enemy.body.x, enemy.body.y, 'bomb')
          bomb.body.velocity.y = 200;
          this.physics.add.collider(bomb, ship, function () {
            var explosion = physics.add.sprite(ship.body.x+ship.body.width/2,ship.body.y).setOrigin(0.5).setScale(0.25);
            explosion.anims.play('explode');
            ship.disableBody(true,true);
            gameOver = true;
        });
      }
  }, this);

  if (shot.isDown && this.time.now>=nextBulletTime && !gameOver) { //&& ship nierozwalony
    console.log(this.time.now)
    console.log('spacja')
    var bullet = this.physics.add.sprite(ship.body.x + ship.body.width / 2, ship.body.y - 10, 'bullet');
    this.physics.add.collider(bullet, group, function (bullet, concreteInvader) {
      var explosion = physics.add.sprite(concreteInvader.body.x+concreteInvader.body.width/2,concreteInvader.body.y+concreteInvader.body.height/2).setOrigin(0.5).setScale(0.25);
      explosion.anims.play('explode')
      //explosion.destroy();
      //ship.anims.play('explode')
      concreteInvader.destroy();
      bullet.destroy();
      if (group.children.size == 0){
        gameOver = true;
    }
  });
    //bullet.setCollideWorldBounds(true);
    //bullet.body.onWorldBounds = true;
    nextBulletTime = this.time.now + 500; //w 2-ce game.time.now
    console.log(nextBulletTime)
    bullet.body.velocity.y = -200;
  }
}