//import './style.css';
//import 'phaser';

const appDiv = document.getElementById('app');

var config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
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
var ship, bullet;
var cursors;

function preload() {
  this.load.baseURL = 'https://examples.phaser.io/assets/';
  this.load.crossOrigin = 'anonymous';
  this.load.image('background', 'games/invaders/starfield.png');
  this.load.image('bullet', 'games/invaders/bullet.png');
  this.load.image('ship', 'games/invaders/player.png');
}

function create() {
  let back = this.add.tileSprite(0, 28, 500, 300, 'background');//do ogarnięcia
  back.setOrigin(0);
  back.setScrollFactor(0); //fixedToCamera = true;
  //
  bullet = this.physics.add.sprite(250, 350, 'bullet');
  bullet.setOrigin(0, 0);

  bullet.body.velocity.x = 200;
  bullet.body.velocity.y = -150;
  bullet.body.bounce.set(1);

  bullet.body.setCollideWorldBounds(true);
  bullet.body.onWorldBounds = true;
  //this.physics.world.on('worldbounds', ballLost);

  ship = this.physics.add.sprite(200, 550, 'ship');
  ship.setOrigin(0.5);
  ship.body.collideWorldBounds = true; //koliduje z granicami świata
  ship.body.immovable = true; //nieprzesuwalny

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  ship.body.velocity.x = 0;
  if (cursors.left.isDown) { //reakcja statku na próbę przesunięcia
    ship.body.velocity.x = -200;
  } else if (cursors.right.isDown) {
    ship.body.velocity.x = 200;
  }
  this.physics.collide(bullet, ship, bulletHitsShip);

  function bulletHitsShip(bullet, ship) {
    bullet.disableBody(true, true); //skasowanie ciała pocisku
  }
}
