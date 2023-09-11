const canvas = document.getElementById('StarfieldVideo');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth; //screen width
canvas.height = window.innerHeight; //screem height


class Star {
  constructor() {
    //initializing
    this.x = Math.random()*canvas.width-canvas.width/2;  //random x
    this.y = Math.random()*canvas.height-canvas.height/2; //random y
    this.px, this.py;
    this.z = Math.random()*4; //random z 
	this.generation = 0;
	this.nextColor = 0;
	this.pulse = 0;
	this.maxColor = 7;
	this.color = ['rgb(255,255,255)','rgb(255,0,0)','rgb(255,128,0)','rgb(255,255,0)','rgb(0,255,0)','rgb(0,0,255)','rgb(75,0,130)','rgb(238,130,238)']	
  }
  
  update() {
	//console.log(this.generation)
    //stores previous x, y and z and generates new coordinates    
    this.px = this.x;
    this.py = this.y;
    this.z += speed;
    this.x += this.x*(speed*0.2)*this.z;
    this.y += this.y*(speed*0.2)*this.z;
	this.generation += 1;
	this.pulse += 1;
	if ( this.generation > 700 ) {
		if (this.pulse > 2) {
			this.pulse = 0;
			this.nextColor += 1;
			if (this.nextColor > this.maxColor) {
				this.nextColor = 0;
			}
		}
	}
    if (this.x > canvas.width/2+50 || this.x < -canvas.width/2-50 ||
        this.y > canvas.height/2+50 || this.y < -canvas.height/2-50) {
	  // reset star 
      this.x = Math.random()*canvas.width-canvas.width/2;
      this.y = Math.random()*canvas.height-canvas.height/2;
	  this.generation = 0;
	  this.nextColor = 0;
	  this.pulse = 0;
	  //console.log('RESET' + this.generation);
      this.px = this.x;
      this.py = this.y;
      this.z = 0;
    }
  }
  
  //draws line from x,y to px,py
  show() {  
    c.lineWidth = this.z;
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.px, this.py);
	c.strokeStyle = this.color[this.nextColor];
    c.stroke();
  }
}

let speed = 0.005;
let stars = [];


//create stars (objects)
for (let i = 0; i < 200; i++) stars.push(new Star());

c.fillStyle = 'rgba(0, 0, 0, 0.1)';
c.strokeStyle = 'rgb(255,255,255)';
c.translate(canvas.width/2, canvas.height/2);

function draw() {
  //create rectangle
  c.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
  for (let s of stars) {
    s.update();
    s.show();
  }
  //infinte call to draw
  requestAnimationFrame(draw);
}

draw();