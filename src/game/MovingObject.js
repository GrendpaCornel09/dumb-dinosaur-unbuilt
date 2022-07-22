import Phaser from 'phaser'

export default class MovingObject extends Phaser.Physics.Arcade.Sprite
{
	constructor(scene, x, y, texture, config){
		super(scene, x, y, texture);

		this.scene = scene;
		this.speed = config.speed;
		this.setScale(config.scale)
	}

	spawn(x, y){
		this.setPosition(x, y);
		this.setActive(true);
		this.setVisible(true);
	}

	delete(){
		this.destroy();
	}

	update(time){
		this.setVelocityX(this.speed * -1);
		if(this.x < -10 || this.y > 610){
			this.delete();
		}
	}
}