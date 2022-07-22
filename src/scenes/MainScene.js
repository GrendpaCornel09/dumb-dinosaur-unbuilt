import Phaser from 'phaser'
import MovingObject from '../game/MovingObject';
import ScoreLabel from '../game/ScoreLabel';

export default class MainScene extends Phaser.Scene
{
	constructor(){
		super({
			key: 'main-scene',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 1000 }
				}
			},
		});
	}
	
	init(){
		this.player = undefined;
		this.ground = undefined;

		// cactus
		this.cactus = undefined;

		this.obstacleArr = undefined;
		this.randomType = undefined;
		this.obstacleType = undefined;

		// parallax background
		this.bglayer1 = undefined;
		this.bglayer2 = undefined;
		this.bglayer3 = undefined;
		this.bglayer4 = undefined;
		this.bglayer5 = undefined;

		// game half size
		this.halfWidth = this.scale.width / 2;
		this.halfHeight = this.scale.height / 2;

		// sounds
		this.backsound = undefined;
		this.jumpSound = undefined;

		// buttons
		this.tutorialBtn = undefined;
		this.playBtn = undefined;
		this.restartBtn = undefined;

		// score
		this.score = 0;
		this.scoreText = undefined;
	}

	preload(){
        this.load.image(`ground`, `../images/ground.png`);
		this.load.image(`cactus`, `../images/cactus.png`);
		this.load.image(`brick`, `../images/brick.png`);
		
		// parallax background
		this.load.image(`bglayer1`, `../images/background/plx-1.png`);
		this.load.image(`bglayer2`, `../images/background/plx-2.png`);
		this.load.image(`bglayer3`, `../images/background/plx-3.png`);
		this.load.image(`bglayer4`, `../images/background/plx-4.png`);
		this.load.image(`bglayer5`, `../images/background/plx-5.png`);
		
		// GUI elements
		this.tutorialBtn = this.load.image(`tutorialbtn`, `../images/GUI/faq.png`);
		this.playBtn = this.load.image(`playbtn`, `../images/GUI/play.png`);
		this.restartBtn = this.load.image(`restartbtn`, `../images/GUI/restart.png`);

		// background music
		this.load.audio(`music`, `../music/music.mp3`);

		// sfx
		this.load.audio(`lose`, `../sfx/lose.mp3`);
		this.load.audio(`jump`, `../sfx/jump.mp3`);

		this.load.spritesheet(`dino`, `../images/dino.png`, {
			frameWidth: 576 / 24,
			frameHeight: 24
		});
    }

    create(){
		this.handleScore();
		this.loadParallaxBackground();
		
		// sounds
		const soundConfigBacksound = {
			loop: true,
			volume: 0.5
		}

		const soundConfigJump = {
			loop: false,
			volume: 0.2
		}

		this.backsound = this.sound.add(`music`, soundConfigBacksound);
		this.backsound.play();

		this.jumpSound = this.sound.add(`jump`, soundConfigJump);
		this.jumpSound.stop();

		this.cursors = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE
		});
		
        // font
		loadFont(`futilepro`, `../font/FutilePro.ttf`);

		// ground
		const ground = this.physics.add.staticImage(400, 550, `ground`);
		
		// player
		this.player = this.physics.add.sprite(this.halfWidth - 300, this.halfHeight + 125, `dino`, 1).setScale(3).setOffset(0, -3);
		
		// player animation
		this.playerAnim();
		
		// enemy spawning
		this.cactus = this.physics.add.group({
			classType: MovingObject,
			maxSize: 4,
			runChildUpdate: true
		});

		this.brick = this.physics.add.group({
			classType: MovingObject,
			maxSize: 4,
			runChildUpdate: true
		});

		// collider
		this.physics.add.collider(this.player, ground);
		this.physics.add.collider(this.cactus, ground);
		this.physics.add.collider(this.brick, ground);

		// player cactus overlap
		this.physics.add.overlap(this.player, this.cactus, this.playerHit, null, this);
		this.physics.add.overlap(this.player, this.brick, this.playerHit, null, this);

		// cactus spawn timer
		this.time.addEvent({
			delay: Phaser.Math.Between(1500, 2000),
			callback: this.spawnCactus,
			callbackScope: this,
			loop: true
		});

		// score
		// this.scoreText = this.add.text(35, 35, `000000`, {
		// 	fontFamily: `futilepro`,
		// 	fontSize: `37px`,
		// 	color: `#E0FFED`,
		// 	align: `left`
		// });

		this.scoreText = this.createScoreText(35, 35, `000000`);
    }

	update(){
		// parallax background
		this.bglayer2.tilePositionX += 0.5;
		this.bglayer3.tilePositionX += 0.7;
		this.bglayer4.tilePositionX += 1;
		this.bglayer5.tilePositionX += 1.5;

		// player movement
		this.playerMove(this.player);
	}

	playerMove(player){
		// @ts-ignore
		if(this.cursors.space.isDown){
			player.setVelocityY(-400);
			player.anims.play(`standby`, true);
			this.jumpSound.play();
		}

		if(player.y < 415){
			player.anims.play(`standby`, true);
		}

		if(player.y < this.halfHeight - 100){
			player.setPosition(this.halfWidth - 300, this.halfHeight + 125);
			player.setVelocityY(0);
		}
		
		else{
			player.anims.play(`run`, true);
		}
	}

	playerAnim(){
		this.anims.create({
			key: `run`,
			frames: this.anims.generateFrameNumbers(`dino`, {
				start: 4,
				end: 9
			}),
			frameRate: 10
		});

		this.anims.create({
			key: `standby`,
			frames: [{
				key: `dino`,
				frame: 1
			}]
		});

		this.anims.create({
			key: `dead`,
			frames: this.anims.generateFrameNumbers(`dino`, {
				start: 14,
				end: 16
			}),
			frameRate: 10,
		});
	}

	spawnCactus(){
		const config = {
			speed: Phaser.Math.Between(300, 500),
			scale: 0.13
		}

		const config2 = {
			speed: Phaser.Math.Between(300, 500),
			scale: 0.2
		}

		// @ts-ignore
		// const cactus = this.cactus.get(0, 0, `cactus`, config);
		// @ts-ignore
		const obstacleArr = {
			// @ts-ignore
			0: this.cactus.get(0, 0, `cactus`, config),
			// @ts-ignore
			1: this.brick.get(0, 0, `brick`, config2)
		}

		const randomType = Phaser.Math.Between(0, 1);

		if(randomType == 0){
			this.obstacleType = obstacleArr[0];
		}

		else if(randomType == 1){
			this.obstacleType = obstacleArr[1];
		}

		if(this.obstacleType){
			this.obstacleType.spawn(870, this.halfHeight + 75);
			this.obstacleType.setVelocityX(config.speed);
		}
	}

	playerHit(){
		this.player.anims.play(`dead`, true);
		this.scene.start(`lose-scene`, {
			//TODO score: this.scoreText.getScore()
			score: this.score
		});
		this.scene.pause();
		this.backsound.stop();
	}

	createScoreText(x, y, score){
		const style = {
			fontFamily: `futilepro, sans-serif`,
			fontSize: `37px`,
			color: `#E0FFED`,
			align: `left`
		}

		const text = new ScoreLabel(this, x, y, score, style).setDepth(1);

		this.add.existing(text);

		return text;
	}

	handleScore(){
		this.time.addEvent({
			delay: 1000/10,
			callback: () => {
				this.score++;

				const score = Array.from(String(this.score), Number);
				for(let i = 0; i < 5 - String(this.score).length; i++){
					score.unshift(0);
				}

				this.scoreText.setText(score.join(``));
			},
			callbackScope: this,
			loop: true,
		})
	}

	loadParallaxBackground(){
		// parallax background
		this.bglayer1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer1`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(3);
		
		this.bglayer2 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer2`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2);

		this.bglayer3 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer3`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2);

		this.bglayer4 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer4`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2);

		this.bglayer5 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer5`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2);
	}
}

function loadFont(name, url) {
	var newFont = new FontFace(name, `url(${url})`);
	newFont.load().then(function (loaded) {
		document.fonts.add(loaded);
	}).catch(function (error) {
		return error;
	});
}