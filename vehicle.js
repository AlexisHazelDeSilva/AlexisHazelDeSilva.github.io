function Vehicle(x,y){

    this.MIN_PERCEPT = 5;
    this.MAX_PERCEPT = 100;
    
    this.distance = 0;
    
    this.size = 7.5;
    this.maxSpeed = 5;
    this.turnForce = 0.125;
    this.health = 1;
    
    this.generation = 1;
    
    this.acceleration = createVector(0,0);
    this.velocity = createVector(0,0);
    this.position = createVector(x,y);
    
    this.dna = [];
    this.dna[0] = random(5,-5); //Plant Weight
    this.dna[1] = random(5,-5); //Meat Weight
    this.dna[2] = random(this.MIN_PERCEPT,this.MAX_PERCEPT);//Plant Perception
    this.dna[3] = random(this.MIN_PERCEPT,this.MAX_PERCEPT);//Meat Perception
    this.dna[4] = random();//Plant Nutrition
    this.dna[5] = -1*this.dna[4];//Meat Nutrition
    
    //COLOR
    
    this.dna[6] = random(0,255);
    this.dna[7] = random(0,255);
    this.dna[8] = random(0,255);
    
    this.findDist = function(){
        
        this.distance = sqrt(pow(this.position.x - mouseX,2)+pow(this.position.y - mouseY,2));
    }
    
    this.update = function(){
        
        this.health -= 0.005;
        
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        
        this.findDist();
    }
    
    this.applyForce = function(force){
        this.acceleration.add(force);
    }
    
    this.behaviors = function(good,bad){
        var steerG = this.eat(good,this.dna[4],this.dna[2]);
        var steerB = this.eat(bad,this.dna[5],this.dna[3]);
        
        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);
        
        this.applyForce(steerG);
        this.applyForce(steerB);
        
    }
    
    this.eat = function(list,nutrition,perception){
        if(list.length > 0){
            var record = Infinity;
            var closest = null;
            for(var i = 0; i < list.length; i++){
                var d = this.position.dist(list[i]);
                if(d < perception && d < record){
                    record = d;
                    closest = list[i];
                }
                if(d < this.maxSpeed){
                    list.splice(i,1);
                    this.health += nutrition;
                    if(this.health > 1){
                        this.health = 1;
                    }
                    else if (this.health < 0){
                        this.health = 0;
                    }
                    
                }
            }
            if (closest != null){
                  return this.seek(closest);
            }
            
        }
        return createVector(0,0);
    }
    
    this.seek = function(target){
        var desired = p5.Vector.sub(target,this.position);
        desired.setMag(this.maxSpeed);
        var steer = p5.Vector.sub(desired,this.velocity);
        steer.limit(this.turnForce);
        return steer;
    }
    
    this.dead = function(){
        return (this.health <= 0);
    }
    
    this.clone = function(){
        mutated = false;
        
        var newVehicle = new Vehicle(this.position.x,this.position.y);
        
        newVehicle.generation = this.generation + 1;
        
        for(i = 0; i < this.dna.length; i++){
            newVehicle.dna[i] = this.dna[i];
        }
        
        if(random() < 0.03){
            mutated = true;
            this.dna[0] += random(-1,1);
            
            if(this.dna[0] < -10){
                this.dna[0] = -10;
            }
            else if (this.dna[0] > 10){
                this.dna[0] = 10;
            }
            
        }
        if(random() < 0.03){
            mutated = true;
            this.dna[1] += random(-1,1);
            
            if(this.dna[1] < -10){
                this.dna[1] = -10;
            }
            else if (this.dna[1] > 10){
                this.dna[1] = 10;
            }
        }
        if(random() < 0.03){
            mutated = true;
            this.dna[2] += random(-5,5);
            if(this.dna[2] < this.MIN_PERCEPT){
                this.dna[2] = this.MIN_PERCEPT;
            }
            else if(this.dna[2] > this.MAX_PERCEPT){
                this.dna[2] = this.MAX_PERCEPT;
            }
        }
        if(random() < 0.03){
            mutated = true;
            this.dna[3] += random(-5,5);
            if(this.dna[3] < this.MIN_PERCEPT){
                this.dna[3] = this.MIN_PERCEPT;
            }
            else if(this.dna[3] > this.MAX_PERCEPT){
                this.dna[3] = this.MAX_PERCEPT;
            }
        }
        if(random() < 0.03){
            mutated = true;
            this.dna[4] += random()/10;
            
            if(this.dna[4] < 0){
                this.dna[4] = 0;
            }else if(this.dna[4] > 1){
                this.dna[4] = 1;
            }
            
            this.dna[5] = -1*this.dna[4];
        }
        
        if(mutated == true){
            this.dna[6] = random(0,255);
            this.dna[7] = random(0,255);
            this.dna[8] = random(0,255);
        }
        
        return newVehicle;
    }
    
    this.display = function(debug){
        
        var angle = this.velocity.heading() + PI/2;
        
        push();
        translate(this.position.x,this.position.y);
        rotate(angle);
        
        var green = color(0,255,0);
        var red = color(255,0,0);
        var col = lerpColor(red,green,this.health);
        var colNut = lerpColor(red,green,this.dna[4]);
        
        //fill(col);
        fill(this.dna[6],this.dna[7],this.dna[8]);
        
        beginShape();
        vertex(0,-this.size*2);
        vertex(-this.size,this.size*2);
        vertex(0,this.size*2/3);
        vertex(this.size,this.size*2);
        
        stroke(0);
        strokeWeight(1);
        
        endShape(CLOSE);
        
        //DEBUG
        if(debug == true){
            stroke(colNut);
            strokeWeight(3);
            line(-10,0,-10,-this.dna[4]*10);

            stroke(0,255,0);
            strokeWeight(2);
            line(0,0,0,-this.dna[0]*10);
            stroke(255,0,0);
            strokeWeight(1);
            line(0,0,0,-this.dna[1]*10);

            noFill();

            stroke(0,255,0);
            ellipse(0,0,this.dna[2],this.dna[2]);
            stroke(255,0,0);
            ellipse(0,0,this.dna[3],this.dna[3]);
        }
        //END DEBUG
        
        pop();
        
    }

    this.boundaries = function() {
        var d = 25;

        var desired = null;

        if (this.position.x < d) {
          desired = createVector(this.maxSpeed, this.velocity.y);
        } else if (this.position.x > width - d) {
          desired = createVector(-this.maxSpeed, this.velocity.y);
        }

        if (this.position.y < d) {
          desired = createVector(this.velocity.x, this.maxSpeed);
        } else if (this.position.y > height - d) {
          desired = createVector(this.velocity.x, -this.maxSpeed);
        }

        if (desired !== null) {
          desired.normalize();
          desired.mult(this.maxSpeed);
          var steer = p5.Vector.sub(desired, this.velocity);
          steer.limit(this.turnForce);
          this.applyForce(steer);
        }
    }
}