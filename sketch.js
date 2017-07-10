
var VEHICLE_COUNT = 20;
var FOOD_COUNT = 50;
var POISON_COUNT = 20;

var MAX_FOOD = 80;
var MAX_POISON = 30;

var vehicles = [];
var food = [];
var poison = [];

function setup() {
    createCanvas(800,600);
    
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
    
    if(random(1) < 0.1 && food.length < MAX_FOOD){
        var x = random(width-50)+25;
        var y = random(height-50)+25;
        food.push(createVector(x,y));
    }
    if(random(1) < 0.07 && poison.length < MAX_POISON){
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
        vehicles[i].display();
        
        if(random() < 0.003){
            vehicles.push(vehicles[i].clone());
        }
        
        if(vehicles[i].dead()){
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