
var enable_interaction = true;

var size = 50;
var F = 0.4;
var cross_size = size/2;
var edge_thickness = 4;

var t = 0;
var rate = 0.01

var cross_fade = 1;  //true;
var cross_colors =[170,240];
var square_clrs = [190,220];
var square_colors = [`rgba(${square_clrs[0]},${square_clrs[0]},${square_clrs[0]},1)`,
                     `rgba(${square_clrs[1]},${square_clrs[1]},${square_clrs[1]},1)`];


var get_mouse_pos = false;
var get_touch_pos = false;


var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


startAnimating(30);


function draw() { 

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = 'rgba(255,255,255,1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let columns = Math.ceil(canvas.width/size);
    let rows = Math.ceil(canvas.height/size); 
    
    ctx.save();
    ctx.translate(-size/2, - size/2);
    for (let i = 0; i <= columns; i++ ) {
        for (let j = 0; j <= rows; j++) {

            square_color = square_colors[(i+j)%2];

            square(ctx, size*(i), size*(j), size, square_color);
            
            min = Math.min(...cross_colors);
            max = Math.max(...cross_colors);
            plus_color = min + (max-min)*(0.5+0.5*Math.sin((t + (i+j)*F)*2*Math.PI) );
    
            plus(size*(i), size*(j), 0, 0, cross_size, edge_thickness, Math.floor(plus_color), 1);
            
        }
    }
    ctx.restore();

    t += cross_fade*rate;

    
    if (enable_interaction) {
        canvas.addEventListener('mousedown', e => {
        //get_mouse_pos = true;
        //getMousePosition(canvas, e)
        cross_fade = 0;
        });
          
        canvas.addEventListener('mouseup', e => {
        //get_mouse_pos = false;
        cross_fade = 1;
        });
      
        canvas.addEventListener('mousemove', function(e) {
          if(true) {
            getMousePosition(canvas, e)
          }
        })
        
        canvas.addEventListener('touchstart', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
            cross_fade = 0;
        }, false);
          
        canvas.addEventListener('touchend', function(e) {
            cross_fade = 1;
     
        }, false);
          
        canvas.addEventListener('touchmove', function(e) {
            getTouchPosition(canvas,e);
            event.preventDefault();
        }, false);
    }
   
}

function square(ctx, x, y, size, color) {
    
    
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function plus(x, y, x_shift, y_shift, size, line_width, color, alpha) {
    
    color_string = `rgba( ${color}, ${color}, ${color}, ${alpha} )`;
    ctx.strokeStyle = color_string;
    ctx.lineWidth = line_width;

    ctx.beginPath();
    ctx.moveTo(x + x_shift*size/2, y - size/2);
    ctx.lineTo(x + x_shift*size/2, y + size/2);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - size/2, y + y_shift*size/2);
    ctx.lineTo(x + size/2, y + y_shift*size/2);
    ctx.closePath();
    ctx.stroke();
}




function getMousePosition(canvas, event) {
    x_touch = event.clientX/canvas.width;
    y_touch = event.clientY/canvas.height;

    F = Math.min(1, Math.max(0, -0.5 + x_touch) + 0.5);
    cross_size = Math.min(2*size, Math.max(0, -0.1 + 2*size*y_touch ) + 0.1 );
}

function getTouchPosition(canvas, event) {
    var touch = event.touches[0];
    x_touch = touch.clientX/canvas.width;
    y_touch = touch.clientY/canvas.height;
    
    F = Math.min(1, Math.max(0, -0.1 + x_touch) + 0.1);
    cross_size = Math.min(2*size, Math.max(0, -0.1 + 2*size*y_touch ) + 0.1 );
}




function startAnimating(fps) {
    
    fpsInterval = 1000/fps;
    then = window.performance.now();
    startTime = then;
    
    animate();
 }
 
 function animate(newtime) {
 
     
     if (stop) {
         return;
     }
 
     requestAnimationFrame(animate);
 
     now = newtime;
     elapsed = now - then;
 
     if (elapsed > fpsInterval) {
         then = now - (elapsed % fpsInterval);
     
         draw();  
     }
 }
 