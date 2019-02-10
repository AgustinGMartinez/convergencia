(function() {
  window.onload = function() {
    var bigCanvas = function() {
      //create canvas and append it
      var can = document.createElement('canvas');
      can.setAttribute('id', 'canvas');
      var container = document.querySelector('.canvas-container');
      container.appendChild(can);

      // canvas setup
      var canvas = document.getElementById('canvas');
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      var c = canvas.getContext("2d");

      // logo
      var logo = new Image();
      logo.src = themeUri[0]+"/img/logo.png";


      // Config
      var quantity = 3;
      var radiusMax = 140 || window.innerWidth * 0.0875;
      var radiusMin = 110 || window.innerWidth * 0.06875;
      var maxOffset = canvas.width * 0.2;
      var firstGeneration = quantity;
      var maxSpeed = 0.35;
      var minSpeed = 0.2;
      var maxChangeFrequency = 300;
      var minChangeFrequency = 100;
      var maxAlpha = 0.9;
      var minAlpha = 0.7;
      var textBold = "bold";
      var textSize = "25px";
      var textFamily = "sans-serif";
      var alternativeFontSize = "18px";
      var textColor = "#fff";
      var textAlign = "center";
      var getFont = function(useAltSize = false) {
        var size = textSize;
        if (useAltSize) {
          size = alternativeFontSize;
        }

        return textBold + " " + size + " " + textFamily;
      }
      var center = {
        width: 0,
        height: 0,
        x: canvas.width/2,
        y: canvas.height/2
      }
      logo.onload = function(){
        center.width = logo.width;
        center.height = logo.height;
      }

      var isInCenter = function (circle) {
        if (circle.x + circle.radius > canvas.width/2 - center.width/2 && circle.x - circle.radius < canvas.width/2 + center.width/2 && circle.y + circle.radius > canvas.height/2 - center.height/2 && circle.y - circle.radius < canvas.height/2 + center.height/2) {
          return true
        }
        else return false;
      }
      var checkCircleCollision = function(c1) {
        for (i in circles) {
          var c2 = circles[i];
          if (c2.x == c1.x && c2.y == c1.y ) continue;

          var distance = Math.sqrt(Math.pow(Math.abs(c2.x - c1.x), 2) + Math.pow(Math.abs(c2.y - c1.y), 2));
          var sumOfRadius = c1.radius + c2.radius;

          if (distance <= sumOfRadius) {
            return {
              collided: true,
              c1: c1,
              c2: c2
            }
          }
        }

        return {collided: false};
      }

      // Clases
      function Color() {
        this.baseColor = ['46,69,162', '150,206,9'][Math.round(Math.random())];
        this.maxAlpha = Math.random() * (maxAlpha - minAlpha) + minAlpha; // GLOBAL VARIABLES
        this.alpha = 0;
        this.color;

        this.setColor = function() {
          this.color = 'rgba(' + this.baseColor + ', ' + this.alpha + ')';
        }
      }

      function Text(text, parentRadius) {
        this.maxLength = parentRadius * 2;
        this.text = text;
        this.x;
        this.y;
        this.color;

        this.move = function(x, y) {
          this.x = x;
          this.y = y;
        }

        this.draw = function() {
          c.beginPath();
          c.fillStyle = this.color || "transparent";
          c.font = getFont(false); // GLOBAL
          c.textAlign = textAlign; //Global

          // check if text is too long and adjust font-size acordingly
          var fits = true;
          for (text of this.text) {
            if (c.measureText(text).width > this.maxLength) {
              c.font = getFont(true); // Global
              fits = false;
            }
          }
          if (fits) {
            c.font = getFont(false); // Global
          }

          // Ajuste de altura de lineas segun cantidad de ellas
          for (var i = 0; i < this.text.length * 30; i+=30) {
            if ( this.text.length == 1) {
              c.fillText(this.text[i/30], this.x, this.y + i + 0);
            } else if (this.text.length == 2) {
              c.fillText(this.text[i/30], this.x, this.y + i - 15);
            } else {
              c.fillText(this.text[i/30], this.x, this.y + i - 30);
            }
          }

          c.fill();
        }
      }

      function Circle() {
        // relative Color object
        this.colorOptions = new Color();
        this.color = this.colorOptions.color;
        this.alpha = this.colorOptions.alpha;
        this.maxAlpha = this.colorOptions.maxAlpha;
        // relative Text object
        this.text;
        // inner props
        this.radius = Math.round(Math.random() * (radiusMax - radiusMin) + radiusMin);
        this.turns = 0;
        this.maxTurns = Math.round(Math.random() * maxChangeFrequency + minChangeFrequency);
        this.isExiting = false;
        this.mustRenew = true;
        this.x;
        this.y;

        this.borderLeft = function() {
          return this.x + this.radius;
        }
        this.borderRight = function() {
          return this.x - this.radius;
        }
        this.borderTop = function() {
          return this.y - this.radius;
        }
        this.borderBottom = function() {
          return this.y + this.radius;
        }

        this.draw = function() {
          c.beginPath();
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          c.fillStyle = this.color;
          c.fill();
          c.closePath();
          this.text.draw();
        }

        this.setup = function() {
          var i = 0;
          do {
            this.setRandomCoordinates();
            i++;
          } while ((isInCenter(this) || checkCircleCollision(this).collided) && i < 300 );
          this.giveNewDirectionVectors();
        }

        this.setRandomCoordinates = function() {
          this.x =  Math.min(Math.max(Math.round(Math.random() * canvas.width), (this.radius + maxOffset)), canvas.width - (this.radius + maxOffset));
          this.y =  Math.min(Math.max(Math.round(Math.random() * canvas.height), this.radius * 2), canvas.height - this.radius * 2);
        }

        this.giveNewDirectionVectors = function() {
          var plusOrMinus = Math.round(Math.random()) ? 1 : -1;
          this.dx = plusOrMinus * (Math.random() * (maxSpeed - minSpeed) + minSpeed);
          plusOrMinus = Math.round(Math.random()) ? 1 : -1;
          this.dy = plusOrMinus * (Math.random() * (maxSpeed - minSpeed) + minSpeed);
        }

        this.move = function() {
          this.x += this.dx;
          this.y += this.dy;
          this.text.move(this.x, this.y, this.radius);
        }

        this.increaseAlpha = function() {
          this.colorOptions.alpha += 0.001;
          this.colorOptions.setColor();
          this.color = this.colorOptions.color;
          this.alpha = this.colorOptions.alpha;
          // Avoid changing alpha of first generated circles
          this.text.color = "rgba(255,255,255,"+this.alpha+")";
        }

        this.decreaseAlpha = function() {
          // how fast alpha decreases is inversamente proporcional al tamaño del circulo
          this.colorOptions.alpha -= 0.003;
          this.colorOptions.setColor();
          this.color = this.colorOptions.color;
          this.alpha = this.colorOptions.alpha;
          // pending
          this.text.color = "rgba(255,255,255,"+this.alpha+")";
        }

        this.setText = function(text) {
          this.text = new Text(text, this.radius);
          this.text.move(this.x, this.y);
          this.text.draw(this.alpha);
        }
      }

      // Data Storage
      var circles = [];
      var texts = [
        ["Conectividad y", "networking"],
        ["Infraestructura", "eléctrica y", "Datacenter"],
        ["Protección y", "respaldo de", "energía"],
        ["Infraestructura", "óptica pasiva"],
        ["Soluciones de", "seguridad", "electrónica"],
        ["Control", "Biométrico"],
        ["Videovigilancia", "IP"],
        ["Sistemas de", "control de acceso"]
      ];

      // INITIALIZE
      function init() {

        while (circles.length < quantity) {
          var circle = new Circle;
          circle.setup();
          circle.colorOptions.alpha = circle.colorOptions.maxAlpha;
          circle.color = circle.colorOptions.color;
          circle.alpha = circle.colorOptions.alpha;
          circle.colorOptions.setColor();
          circle.setText(texts.shift() || "");
          circle.text.fromFirstGeneration = true;
          circle.text.color = textColor;
          circles.push(circle);
          if (firstGeneration > 0 ) firstGeneration--;
        }

        animate();
      }

      var animation;

      function animate() {

        c.clearRect(0,0,canvas.width,canvas.height);

        var toRemove = [];

        for (var i in circles) {
          var circle = circles[i];

          circle.color = circle.colorOptions.color;
          circle.alpha = circle.colorOptions.alpha;

          if (circle.alpha < circle.maxAlpha && circle.colorOptions.alpha < circle.colorOptions.maxAlpha && !circle.isExiting) {
            // fade inspect
            circle.increaseAlpha();
          } else if (circle.isExiting && circle.alpha > 0 && circle.colorOptions.alpha > 0) {
            // fade out
            circle.decreaseAlpha();
          }

          // create new circle if exiting
          if (circle.isExiting && circle.mustRenew) {
            circle.mustRenew = false;
            newCircle = new Circle;
            newCircle.setup();
            texts.push(circle.text.text);
            newCircle.setText(texts.shift() || "");
            circles.push(newCircle);
          }

          // check if is exiting
          if (circle.borderLeft() < maxOffset || circle.borderRight() > canvas.width - maxOffset || circle.borderTop() < 0 || circle.borderBottom() > canvas.height) {
            circle.isExiting = true;
          }

          // change direction every couple frames but prevent the circles from scaping the death zone
          if (circle.turns <= 0 && !circle.isExiting) {
            circle.giveNewDirectionVectors();
            circle.turns = circle.maxTurns;
          }
          circle.turns--;

          //move the circles for this frame
          circle.move();
          //check if moving too close to center
          if (isInCenter(circle)) {
            if (circle.x < center.x) {
              circle.dx = -Math.abs(circle.dx);
            } else {
              circle.dx = Math.abs(circle.dx);
            }

            if (circle.y < center.y) {
              circle.dy = -Math.abs(circle.dy);
            } else {
              circle.dy = Math.abs(circle.dy);
            }
          }

          // manage collisions
          var collision = checkCircleCollision(circle);
          if (collision.collided) {
            if (collision.c1.x < collision.c2.x) {
              collision.c1.dx = -Math.abs(collision.c1.dx);
              collision.c2.dx = Math.abs(collision.c2.dx);
            } else {
              collision.c1.dx = Math.abs(collision.c1.dx);
              collision.c2.dx = -Math.abs(collision.c2.dx);
            }

            if (collision.c1.y < collision.c2.y) {
              collision.c1.dy = -Math.abs(collision.c1.dy);
              collision.c2.dy = Math.abs(collision.c2.dy);
            } else {
              collision.c1.dy = Math.abs(collision.c1.dy);
              collision.c2.dy = -Math.abs(collision.c2.dy);
            }
          }

          // delete circle if not visible anymore
          if (circle.isExiting && circle.alpha <= 0) {
            toRemove.push(i);
          };

          // display the circle
          circle.draw();
        }

        //delete circles that are no longer visible
        for (i of toRemove) {
          circles.splice(i, 1);
        }
        toRemove = [];

        // draw logo at the end so it has a higher z-index
        c.drawImage(logo, canvas.width/2 - logo.width/2,  canvas.height/2 - logo.height/2);

        animation = requestAnimationFrame(animate);
      }

      init();

      this.cancelAnimationFrame = function () {
        cancelAnimationFrame(animation)
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var smallCanvas = function() {
      //create canvas and append it
      var can = document.createElement('canvas');
      can.setAttribute('id', 'canvas');
      var container = document.querySelector('.canvas-container');
      container.appendChild(can);

      // canvas setup
      var canvas = document.getElementById('canvas');
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      var c = canvas.getContext("2d");

      // logo
      var logo = new Image();
      logo.src = themeUri[0]+"/img/logo.png";

      // Config
      var quantity = 12;
      var radiusMax = 60;
      var radiusMin = 20;
      var maxOffset = canvas.width * 0.2;
      var firstGeneration = quantity;
      var velocitySpec = 1;
      var maxChangeFrequency = 300;
      var minChangeFrequency = 100;
      var center = {
        width: 0,
        height: 0,
        x: canvas.width/2,
        y: canvas.height/2
      }
      logo.onload = function(){
        center.width = logo.width;
        center.height = logo.height;
      }

      // Clases
      function Color () {
        this.rootColor = ['46,69,162', '150,206,9'][Math.round(Math.random())];
        this.maxAlpha = Math.random() * 0.9 + 0.1;
        this.alpha = 0;

        this.setColor = function() {
          this.color = 'rgba(' + this.rootColor + ', ' + this.alpha + ')';
        }
      }

      function Circle() {
        this.colorOptions = new Color();
        this.color = this.colorOptions.color;
        this.alpha = this.colorOptions.alpha;
        this.maxAlpha = this.colorOptions.maxAlpha;
        this.radius = Math.round(Math.random() * (radiusMax - radiusMin) + radiusMin);
        this.turns = 0;
        this.maxTurns = Math.round(Math.random() * maxChangeFrequency + minChangeFrequency);
        this.isExiting = false;
        this.mustRenew = true;
        this.x =  Math.min(Math.max(Math.round(Math.random() * canvas.width), (this.radius + maxOffset)), canvas.width - (this.radius + maxOffset));
        this.y =  Math.min(Math.max(Math.round(Math.random() * canvas.height), this.radius * 2), canvas.height - this.radius * 2);

        this.borderLeft = function() {
          return this.x + this.radius;
        }
        this.borderRight = function() {
          return this.x - this.radius;
        }
        this.borderTop = function() {
          return this.y - this.radius;
        }
        this.borderBottom = function() {
          return this.y + this.radius;
        }

        this.draw = function() {
          c.beginPath();
          c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          c.fillStyle = this.color;
          c.fill();
        }

        this.changeDirection = function() {
          this.dx = Math.random() * velocitySpec - 0.5;
          this.dy = Math.random() * velocitySpec - 0.5;
        }

        this.move = function() {
          this.x += this.dx;
          this.y += this.dy;
        }

        this.increaseAlpha = function() {
          this.colorOptions.alpha += 0.001;
          this.colorOptions.setColor();
          this.color = this.colorOptions.color;
          this.alpha = this.colorOptions.alpha;
        }

        this.decreaseAlpha = function() {
          // how fast alpha decreases is inversamente proporcional al tamaño del circulo
          this.colorOptions.alpha -= 0.003;
          this.colorOptions.setColor();
          this.color = this.colorOptions.color;
          this.alpha = this.colorOptions.alpha;
        }
      }

      // Data Storage
      var circles = [];

      // INITIALIZE
      function init() {
        while (circles.length < quantity) {
          var circle = new Circle;
          circle.colorOptions.alpha = circle.colorOptions.maxAlpha;
          circle.color = circle.colorOptions.color;
          circle.alpha = circle.colorOptions.alpha;
          circle.colorOptions.setColor();
          circles.push(circle);
          if (firstGeneration > 0 ) firstGeneration--;
        }

        animate();
      }

      var animation;

      var toRemove = [];

      function animate() {

        c.clearRect(0,0,canvas.width,canvas.height);

        c.drawImage(logo, canvas.width/2 - logo.width/2,  canvas.height/2 - logo.height/2);

        c.globalCompositeOperation = "destination-over";

        for (var i in circles) {
          var circle = circles[i];

          circle.color = circle.colorOptions.color;
          circle.alpha = circle.colorOptions.alpha;

          if (circle.alpha < circle.maxAlpha && circle.colorOptions.alpha < circle.colorOptions.maxAlpha && !circle.isExiting) {
            // fade inspect
            circle.increaseAlpha();
          } else if (circle.isExiting && circle.alpha > 0 && circle.colorOptions.alpha > 0) {
            // fade out
            circle.decreaseAlpha();
          }

          // create new circle if exiting
          if (circle.isExiting && circle.mustRenew) {
            circle.mustRenew = false;
            circles.push(new Circle);
          }

          // check if is exiting
          if (circle.borderLeft() < maxOffset || circle.borderRight() > canvas.width - maxOffset || circle.borderTop() < 0 || circle.borderBottom() > canvas.height) {
            circle.isExiting = true;
          }

          // change direction every 30 frames but prevent the circles from scaping the death zone
          if (circle.turns <= 0 && !circle.isExiting) {
            circle.changeDirection();
            circle.turns = circle.maxTurns;
          }
          circle.turns--;

          //move the circles for this frame
          circle.move();

          // delete circle if not visible anymore
          if (circle.isExiting && circle.alpha <= 0) {
            toRemove.push(i);
          };

          // display the circle
          circle.draw();
        }

        //delete circles that are no longer visible
        for (i of toRemove) {
          circles.splice(i, 1);
        }
        toRemove = [];

        animation = requestAnimationFrame(animate);
      }

      init();

      this.cancelAnimationFrame = function () {
        cancelAnimationFrame(animation)
      }
    }

    var chooseCanvasToShow = function() {
      // remove old canvas when resize
      if (currentCanvas != null) {
        currentCanvas.cancelAnimationFrame();
        var canvas = document.getElementById('canvas');
        canvas.parentNode.removeChild(canvas);
      }

      if (window.innerWidth > 900) {

        var container = document.querySelector('.canvas-container');
        if ( container ) currentCanvas = new bigCanvas();

      } else {

        var container = document.querySelector('.canvas-container');
        if ( container ) currentCanvas = new smallCanvas();

      }
    }

    var currentCanvas;

    chooseCanvasToShow();

    window.addEventListener('resize', chooseCanvasToShow);
  }
})();
