import Phaser from 'phaser'

export default class StartScene extends Phaser.Scene
{
	constructor(){
		super({
			key: 'start-scene',
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 }
				}
			},
		});
	}
	
	init(){
		this.player = undefined;

		// cactus
		this.cactus = undefined;

		// parallax background
		this.bglayer1 = undefined;
		this.bglayer2 = undefined;
		this.bglayer3 = undefined;
		this.bglayer4 = undefined;
		this.bglayer5 = undefined;

		// game half size
		this.halfWidth = this.scale.width / 2;
		this.halfHeight = this.scale.height / 2;

		// buttons
		this.tutorialBtn = undefined;
		this.playBtn = undefined;

		// text
		this.helloText = undefined;
	}

	preload(){
        this.load.image(`cactus`, `../images/cactus.png`);

		// parallax background
		this.load.image(`bglayer1`, `../images/background/plx-1.png`);
		this.load.image(`bglayer2`, `../images/background/plx-2.png`);
		this.load.image(`bglayer3`, `../images/background/plx-3.png`);
		this.load.image(`bglayer4`, `../images/background/plx-4.png`);
		this.load.image(`bglayer5`, `../images/background/plx-5.png`);

		// GUI elements
		this.load.image(`tutorialbtn`, `../images/GUI/faq.png`);
		this.load.image(`playbtn`, `../images/GUI/play.png`);

		this.load.spritesheet(`dino`, `../images/dino.png`, {
			frameWidth: 576 / 24,
			frameHeight: 24
		});
    }

    create(){
		this.loadParallaxBackground();

		// font
		loadFont(`futilepro`, `../font/FutilePro.ttf`);

        this.tutorialBtn = this.add.image(this.halfWidth - 100, this.halfHeight + 170, `tutorialbtn`)
		.setScale(0.6)
		.setInteractive();

		this.startBtn = this.add.image(this.halfWidth + 100, this.halfHeight + 170, `playbtn`)
		.setScale(0.6)
		.setInteractive();

		this.startBtn.on(`pointerup`, () => {
			this.scene.start(`main-scene`);
		});

		this.tutorialBtn.on(`pointerup`, () => {
			this.scene.start(`tutorial-scene`);
		});

		// welcome text
		this.helloText = this.add.text(this.halfWidth, 280, `HELLO! I am\nDUMB DINOSAUR`, {
			fontFamily: `futilepro`,
			fontSize: `75px`,
			align: `center`,
			color: `#E0FFED`
		}).setOrigin();

		this.playerAnim();
		this.player = this.physics.add.sprite(this.halfWidth - 100, this.halfHeight - 180, `dino`).setScale(5)
		this.cactus = this.add.image(this.halfWidth + 100, this.halfHeight - 180, `cactus`).setScale(0.2)

		this.player.anims.play(`huh`);
    }

	update(){
		
	}

	playerAnim(){
		this.anims.create({
			key: `huh`,
			frames: this.anims.generateFrameNumbers(`dino`, {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});
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