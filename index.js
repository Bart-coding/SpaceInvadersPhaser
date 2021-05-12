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
var bullets;
var invaders;
var group;
var nextBulletTime = 0;
var gameOver = false;

function preload() {
  this.load.baseURL = 'https://examples.phaser.io/assets/';
  this.load.crossOrigin = 'anonymous';
  this.load.image('background', 'games/invaders/starfield.png');
  this.load.image('bullet', 'games/invaders/bullet.png');
  this.load.image('ship', 'games/invaders/player.png');
  this.load.image('invader', 'games/invaders/invader.png')
  this.load.spritesheet('explosion','games/invaders/explode.png',{frameWidth:32,frameHeight:48});
}

function create() {
  back = this.add.tileSprite(0, 0, width, height, 'background');
  back.setOrigin(0,0);
  back.setOrigin(0);

  //back.setScrollFactor(0); //fixedToCamera = true;

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
    group.setVelocityY(60);

    
    this.physics.add.collider(group, ship, function () {//w arg. mogą być te obiekty
      gameOver = true;
      ship.disableBody(true,true)
      console.log("gameover")
  });
}

function update() {
  ship.body.velocity.x = 0;

  if (cursors.left.isDown) { //reakcja statku na próbę przesunięcia
    ship.body.velocity.x = -200;
    console.log('w lewo')
  } else if (cursors.right.isDown) {
    ship.body.velocity.x = 200;
    console.log('w prawo')
  }

  if (shot.isDown && this.time.now>=nextBulletTime && !gameOver) { //&& ship nierozwalony
    console.log(this.time.now)
    console.log('spacja')
    var bullet = this.physics.add.sprite(ship.body.x + ship.body.width / 2, ship.body.y - 10, 'bullet');
    this.physics.add.collider(bullet, group, function (bullet, concreteInvader) {
      concreteInvader.disableBody(true,true);
      bullet.disableBody(true,true);//+wybuch
  });
    //bullet.setCollideWorldBounds(true);
    //bullet.body.onWorldBounds = true;
    nextBulletTime = this.time.now + 500; //w 2-ce game.time.now
    console.log(nextBulletTime)
    bullet.body.velocity.y = -200;
  }

  //this.physics.collide(bulletTest, ship, bulletHitsShip);//do testów
  function bulletHitsShip(bulletTest, ship) { //do testów
    console.log(ship.body.x)
    bulletTest.disableBody(true, true); //skasowanie ciała pocisku

    /*explosion = this.physics.add.sprite(ship.x,ship.y,'explosion');
    ship.disableBody(true,true);
    this.anims.create({key:'collision',
    frames:this.anims.generateFrameNumbers('explosion',
    {start:0,end:15}),frameRate:10,repeat:1});
    explosion.anims.play('collision', true);*/
  }
}
