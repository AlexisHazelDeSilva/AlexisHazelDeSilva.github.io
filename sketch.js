
var VEHICLE_COUNT = 20;
var FOOD_COUNT = 80;
var POISON_COUNT = 40;

var MAX_FOOD = 250;
var MAX_POISON = 100;

var foodondeath = true;

var vehicles = [];
var food = [];
var poison = [];

var paused = false;

var debug = true;

function keyTyped(){
    if(key === 'p' ){
        paused = !paused;
    }
    if(key === 'd' ){
        debug = !debug;
    }
    if(key === 'f' ){
        foodondeath = !foodondeath;
    }
}

function setup() {
    frameRate(50);
    createCanvas(1200,700);
    
    for(var i = 0; i < VEHICLE_COUNT; i++){
        
        var x = random(width-50)+25;
        var y = random(height-50)+25;
        
        vehicles.push(new Vehicle(x,y));
    }
    
    for(var i = 0; i < FOOD_COUNT; i++){
        
        var x = random(width-50)+25;
        var y = random(height-50)+25;
        
        food.push(createVector(x,y));
    }
    for(var i = 0; i < POISON_COUNT; i++){
        
        var x = random(width-50)+25;
        var y = random(height-50)+25;
        
        poison.push(createVector(x,y));
    }
    
}

function draw() {
    background(0,0,64);
    
    textSize(60);
    textAlign(CENTER,CENTER);
    fill(100,100,0);
    stroke(128,128,0);
    strokeWeight(0.5);
    text("Get Well Bobbie!",600,350);
    textAlign(LEFT,CENTER);
    
    textSize(10);
    
    if(!paused){

        if(random(1) < 0.2 && food.length < MAX_FOOD){
            var x = random(width-50)+25;
            var y = random(height-50)+25;
            food.push(createVector(x,y));
        }
        if(random(1) < 0.15 && poison.length < MAX_POISON){
            var x = random(width-50)+25;
            var y = random(height-50)+25;
            poison.push(createVector(x,y));
        }

        for(var i = 0; i < food.length; i++){
            fill(0,255,0);
            stroke(0,128,0);
            ellipse(food[i].x,food[i].y,8,8);
        }
        for(var i = 0; i < poison.length; i++){
            fill(255,0,0);
            stroke(128,0,0);
            ellipse(poison[i].x,poison[i].y,8,8);
        }

        for(var i = vehicles.length-1; i >= 0; i--){
            vehicles[i].behaviors(food,poison);
            vehicles[i].boundaries();
            vehicles[i].update();
            vehicles[i].display(debug);

            if(random() < 0.003){
                vehicles.push(vehicles[i].clone());
            }

            if(vehicles[i].dead()){
                if(foodondeath == true){
                    food.push(createVector(vehicles[i].position.x,vehicles[i].position.y));
                }
                vehicles.splice(i,1);
            }

        }

        if(vehicles.length < 3){
            while(vehicles.length < 3){

                var x = random(width-50)+25;
                var y = random(height-50)+25;

                vehicles.push(new Vehicle(x,y));
            }
        }
    }
    else{
        
        for(var i = 0; i < food.length; i++){
            fill(0,255,0);
            stroke(0,128,0);
            ellipse(food[i].x,food[i].y,8,8);
        }
        for(var i = 0; i < poison.length; i++){
            fill(255,0,0);
            stroke(128,0,0);
            ellipse(poison[i].x,poison[i].y,8,8);
        }
        for(var i = vehicles.length-1; i >= 0; i--){
            vehicles[i].display(debug);
        }
    }
    
    if(debug == true){
        
        
        closeVeh = null;

        for(var i = vehicles.length-1; i >= 0; i--){

            vehicles[i].findDist();

            if(closeVeh == null || closeVeh.distance > vehicles[i].distance){
                closeVeh = vehicles[i];
            }

        }

        stroke(200);
        line(mouseX,mouseY,closeVeh.position.x,closeVeh.position.y);
        
        fill(255);
        stroke(0);

        text("Food on Death: "+foodondeath,0,10);
        text("Closest Vehicle Dist: "+closeVeh.distance,0,25);
        text("Plant Weight: "+closeVeh.dna[0],0,40);
        text("Meat Weight: "+closeVeh.dna[1],0,55);
        text("Plant Perception: "+closeVeh.dna[2],0,70);
        text("Meat Perception: "+closeVeh.dna[3],0,85);
        text("Nutrition: "+closeVeh.dna[4],0,100);
        text("Generation: "+closeVeh.generation,0,115);
        text("Color: "+int(closeVeh.dna[6])+","+int(closeVeh.dna[7])+","+int(closeVeh.dna[8]),0,145);
    }
    
}