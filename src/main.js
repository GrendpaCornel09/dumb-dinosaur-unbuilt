import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import LoseScene from './scenes/LoseScene'
import StartScene from './scenes/StartScene'
import TutorialScene from './scenes/TutorialScene'

const config = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 }
		}
	},
	scene: [StartScene, TutorialScene, MainScene, LoseScene]
}

export default new Phaser.Game(config)
