import Phaser from 'phaser'
import ScoreLabel from '../game/ScoreLabel';

export default class LoseScene extends Phaser.Scene
{
	constructor(){
		super({
			key: 'lose-scene',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 }
				}
			}
		});
	}
	
	init(data){
		this.player = undefined;
		this.cactus = undefined;

		// game half size
		this.halfWidth = this.scale.width / 2;
		this.halfHeight = this.scale.height / 2;

		// parallax background
		this.bglayer1 = undefined;
		this.bglayer2 = undefined;
		this.bglayer3 = undefined;
		this.bglayer4 = undefined;
		this.bglayer5 = undefined;

		// sound
		this.loseSound = undefined;

		// button
		this.restartBtn = undefined;

		// text
		this.loseText = undefined;
		this.scoreText = undefined;

		// score
		this.score = data.score;
	}

	preload(){
		// cactus
		this.load.image(`cactus`, `../images/cactus.png`);

		// parallax background
		this.load.image(`bglayer1`, `../images/background/plx-1.png`);
		this.load.image(`bglayer2`, `../images/background/plx-2.png`);
		this.load.image(`bglayer3`, `../images/background/plx-3.png`);
		this.load.image(`bglayer4`, `../images/background/plx-4.png`);
		this.load.image(`bglayer5`, `../images/background/plx-5.png`);

		// GUI
		this.load.image(`restartbtn`, `../images/GUI/restart.png`);

		// dino
		this.load.spritesheet(`dino`, `../images/dino.png`, {
			frameWidth: 576 / 24,
			frameHeight: 24
		});
		
		// sfx
		this.load.audio(`lose`, `../sfx/lose.mp3`);
    }

    create(){
		this.loadParallaxBackground();

		const soundConfig = {
			loop: false,
			volume: 0.3
		}

		this.loseSound = this.sound.add(`lose`, soundConfig);
		this.loseSound.stop();
		this.loseSound.play();

		// "futile pro" font
		loadFont(`futilepro`, `../font/FutilePro.ttf`);

		this.deathAnim();
        this.player = this.physics.add.sprite(this.halfWidth - 30, this.halfHeight - 180, `dino`).setScale(5).setRotation(-0.5);
		this.cactus = this.add.image(this.halfWidth + 30, this.halfHeight - 180, `cactus`).setScale(0.2).setRotation(0.5);
		
		// you lose text
		this.loseText = this.add.text(this.halfWidth, this.halfHeight, `You're Almost There,\nTRY AGAIN WKWKWK!!!`, {
			fontFamily: `futilepro`,
			fontSize: `65px`,
			align: `center`,
			color: `#E0FFED`
		}).setOrigin();

		// your score text
		// this.scoreText = this.createScoreText(35, 35, `000000`);
		this.scoreText = this.add.text(35, 35, `${this.score}`, {
			fontFamily: `futilepro`,
			fontSize: `37px`,
			color: `#E0FFED`,
			align: `left`
		});

		// TODO
		const score = Array.from(String(this.score), Number);
		for(let i = 0; i < 5 - String(this.score).length; i++){
			score.unshift(0);
		}

		this.scoreText.setText(score.join(``));
		// this.scoreText.setText(`${this.score}`);

		// restart button
		this.restartBtn = this.add.image(this.halfWidth, this.halfHeight + 180, `restartbtn`).setScale(0.6).setInteractive();
		this.restartBtn.on(`pointerup`, () => {
			this.scene.start(`start-scene`);
		});
		
		// player animation play
		this.player.anims.play(`dead`, true);
    }
	
	update(){
		
	}
	
	deathAnim(){
		this.anims.create({
			key: `dead`,
			frames: this.anims.generateFrameNumbers(`dino`, {
				start: 14,
				end: 16
			}),
			frameRate: 10,
			repeat: -1
		});
	}

	createScoreText(x, y, score){
		const style = {
			fontFamily: `futilepro`,
			fontSize: `37px`,
			color: `#E0FFED`,
			align: `left`
		}

		const text = new ScoreLabel(this, x, y, score, style).setDepth(1);

		this.add.existing(text);

		return text;
	}

	loadParallaxBackground(){
		// parallax background
		this.bglayer1 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer1`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2.5)
		.setDepth(-5);
		
		this.bglayer2 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer2`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2.5)
		.setDepth(-4);

		this.bglayer3 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer3`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2.5)
		.setDepth(-3);

		this.bglayer4 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer4`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2.5)
		.setDepth(-2);

		this.bglayer5 = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, `bglayer5`)
		.setOrigin(0, 0)
		.setScrollFactor(0)
		.setScale(2.5)
		.setDepth(-1);
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