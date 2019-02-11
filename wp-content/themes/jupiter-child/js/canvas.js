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


      // Config

      // CIRCLES
      var bigCircleRadiusMax = 140;
      var radiusMax = 120 || window.innerWidth * 0.0875;
      var radiusMin = 110 || window.innerWidth * 0.06875;
      var maxOffset = canvas.width * 0.1;
      var maxSpeed = 0.3;
      var minSpeed = 0.2;
      var maxChangeFrequency = 300;
      var minChangeFrequency = 100;
      var maxAlpha = 0.9;
      var minAlpha = 0.7;
      var maxAttemptsBeforeOverlapsingCircles = 1000;
      // TEXT
      var textBold = "bold";
      var textSize = "25px";
      var textFamily = "abel, helvetica, sans-serif";
      var alternativeFontSize = "18px";
      var textColor = "#fff";
      var textAlign = "center";
      var currentLink = null;
      // LAYERS
      var layerDuration = 7000;
      var maxTimeoutForKillingACircle = 2000;
      var maxTimeoutForCreatingACircle = 2000;
      var intersectionTimeForLayers = 1000;
      // FUNCTIONS
      var getFont = function(useAltSize = false) {
        var size = textSize;
        if (useAltSize) {
          size = alternativeFontSize;
        }

        return textBold + " " + size + " " + textFamily;
      }
      var isInCenter = function (circle) {
        if (circle.x + circle.radius > canvas.width/2 - center.width/2 && circle.x - circle.radius < canvas.width/2 + center.width/2 && circle.y + circle.radius > canvas.height/2 - center.height/2 && circle.y - circle.radius < canvas.height/2 + center.height/2) {
          return true;
        }
        else return false;
      }
      var checkCircleCollision = function(c1, circles) {
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
      var bounceIfInBorder = function(circle) {
        if (circle.borderLeft() <= 0) {
          circle.dx = Math.abs(circle.dx);
        } else if (circle.borderRight() >= canvas.width) {
          circle.dx = -Math.abs(circle.dx);
        } else if (circle.borderTop() <= 0) {
          circle.dy = Math.abs(circle.dy);
        } else if (circle.borderBottom() >= canvas.height) {
          circle.dy = -Math.abs(circle.dy);
        }
      }
      var clone = function(obj) {
          var copy = {};
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
          }
          return copy;
      }
      var resetFirstLayerAlphaToZero = function() {
        for (var circle of layers[currentLayersIndex].circles) {
          circle.colorOptions.alpha = minAlpha;
          circle.alpha = minAlpha;
        }
      }

      // Clases
      function Color(baseColor) {
        this.baseColor = baseColor;
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

      function Circle(baseColor, link, isTitle = false) {
        // relative Color object
        this.colorOptions = new Color(baseColor);
        this.color = this.colorOptions.color;
        this.alpha = this.colorOptions.alpha;
        this.maxAlpha = this.colorOptions.maxAlpha;
        // relative Text object
        this.text;
        // inner props
        this.radius = isTitle ? bigCircleRadiusMax : Math.round(Math.random() * (radiusMax - radiusMin) + radiusMin);
        this.turns = 0;
        this.maxTurns = Math.round(Math.random() * maxChangeFrequency + minChangeFrequency);
        this.isDying = false;
        this.x;
        this.y;
        this.link = link;

        this.borderLeft = function() {
          return this.x - this.radius;
        }
        this.borderRight = function() {
          return this.x + this.radius;
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

        this.setup = function(circles) {
          var i = 0;
          do {
            this.setRandomCoordinates();
            i++;
          } while ((isInCenter(this) || checkCircleCollision(this, circles).collided) && i < maxAttemptsBeforeOverlapsingCircles );
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
          this.colorOptions.alpha += 0.005;
          this.colorOptions.setColor();
          this.color = this.colorOptions.color;
          this.alpha = this.colorOptions.alpha;
          // Avoid changing alpha of first generated circles
          this.text.color = "rgba(255,255,255,"+this.alpha+")";
        }

        this.decreaseAlpha = function() {
          this.colorOptions.alpha -= 0.006;
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

      function Layer(layer) {
        this.title = layer.title;
        this.subtitles = layer.subtitles;
        this.color = layer.color;
        this.subcolor = layer.subcolor;
        this.circles = [];
        this.links = layer.links;

        this.init = function(isFirstGenerationLayer = false) {
          for (var i = 0; i < this.subtitles.length + 1 ; i++ ) {
            var circle;

            if (i === 0) {
              circle = new Circle(this.color, this.links[i], true);
            } else {
              circle = new Circle(this.subcolor, this.links[i]);
            }

            circle.setup(this.circles);
            circle.colorOptions.setColor();
            // circle.color = circle.colorOptions.color;
            // circle.alpha = circle.colorOptions.alpha;
            circle.setText(i==0 ? this.title : this.subtitles[i-1]);
            circle.text.fromFirstGeneration = this.isFirstGeneration;
            circle.text.color = textColor;
            if (isFirstGenerationLayer) {
              this.circles.push(circle);
            } else {
              // add circles asynchronously in a lapse between 0 and 1.5s
              var minWaitTimeUntilACircleAppears = maxTimeoutForKillingACircle - intersectionTimeForLayers;
              var waitingTime = Math.random() * maxTimeoutForCreatingACircle + minWaitTimeUntilACircleAppears;
              window.setTimeout(function(circle) {
                this.circles.push(circle);
              }.bind(this, circle), waitingTime);
            }
          }
        }
      }

      // Data Storage
      var layers = [
        {
          title: ["Conectividad y", "networking"],
          subtitles: [
            ["Sistema de", "infraestructura", "óptica pasiva"],
            ["Lan Switching"],
            ["Wireless", "solutions"]
          ],
          color: "46,69,162",
          subcolor: "150,206,9",
          links: ["conectividad-y-networking", "conectividad-y-networking/#siop", "conectividad-y-networking/#switch-lan", "conectividad-y-networking/#wireless-solutions"]
        },
        {
          title: ["Construcción", "integral de", "Datacenters"],
          subtitles: [
            ["Instalaciones", "eléctricas"],
            ["Iluminación", "LED"],
            ["Detección de", "incendios"]
          ],
          color: "150,206,9",
          subcolor: "46,69,162",
          links: ["infraestructura-electrica-y-datacenter/", "infraestructura-electrica-y-datacenter/#instalacion-electrica", "infraestructura-electrica-y-datacenter/#iluminacion", "infraestructura-electrica-y-datacenter/#enfriamiento"]
        },
        {
          title: ["Protección de", "energía y", "enfriamiento"],
          subtitles: [
            ["UPS y", "Grupos", "Electrógenos"],
            ["EnergySure", "Electrónica", "Protegida"],
            ["Tableros", "eléctricos", "especiales"]
          ],
          color: "46,69,162",
          subcolor: "150,206,9",
          links: ["proteccion-y-respaldo-de-energia/", "proteccion-y-respaldo-de-energia/#ups-eaton", "proteccion-y-respaldo-de-energia/#energysure", "proteccion-y-respaldo-de-energia/#tableros-de-comando"]
        },
        {
          title: ["Soluciones", "de seguridad", "electrónica"],
          subtitles: [
            ["Videovigilancia", "IP"],
            ["Control", "inteligente", "IoT"],
            ["Soluciones de", "Energías", "Alternativas"]
          ],
          color: "150,206,9",
          subcolor: "46,69,162",
          links: ["soluciones-de-seguridad-electronica/", "soluciones-de-seguridad-electronica/#videovigilancia", "soluciones-de-seguridad-electronica/#control-inteligente", "soluciones-de-seguridad-electronica/#intrusion"]
        }
      ];
      var currentLayersIndex;
      currentLayers = [];
      var timeOut = false;

      // INITIALIZE
      function init() {

        currentLayersIndex = Math.round(Math.random() * (layers.length - 1));

        var layer = new Layer(layers[currentLayersIndex]);
        var isFirstGenerationLayer = true;
        layer.init(isFirstGenerationLayer);
        currentLayers.push(layer);

        for (var circle of currentLayers[0].circles) {
          // change alpha to max since its first layer to appear
          circle.colorOptions.alpha = circle.colorOptions.maxAlpha;
          circle.alpha = circle.maxAlpha;
          // set the color with the new alpha
          circle.colorOptions.setColor();
        }

        animate();
      }

      var animation;

      function animate() {


        c.clearRect(0,0,canvas.width,canvas.height);

        // clone the object before iterating so removing content asynchronously from the original won't impact the iteration
        var iterableCurrentLayers = clone(currentLayers);

        for (var j in iterableCurrentLayers) {

          for (var i in iterableCurrentLayers[j].circles) {
            var circles = iterableCurrentLayers[j].circles;
            var circle = circles[i];

            circle.color = circle.colorOptions.color;
            circle.alpha = circle.colorOptions.alpha;

            if (!circle.isDying && circle.alpha < circle.maxAlpha && circle.colorOptions.alpha < circle.colorOptions.maxAlpha) {
              // fade inspect
              circle.increaseAlpha();
            } else if (circle.isDying && circle.alpha > 0 && circle.colorOptions.alpha > 0) {
              // fade out
              circle.decreaseAlpha();
            }


            bounceIfInBorder(circle);

            // change direction every couple frames but prevent the circles from scaping the death zone
            if (circle.turns <= 0) {
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
            var collision = checkCircleCollision(circle, currentLayers[j].circles);
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

            // display the circle
            circle.draw();
          }
        }

        // change layer after given time
        if (!timeOut) {
          timeOut = true;

          window.setTimeout(function(){
            timeOut = false;

            var mustReplaceLayer;

            // manages removing dead layers
            for (var i in currentLayers) {
              var allDead = true;
              for (var circle of currentLayers[i].circles) {
                if (!circle.isDying || !circle.colorOptions.alpha <= 0) {
                  allDead = false;
                }
              }
              if (allDead) {
                currentLayers.splice(i, 1);
                mustReplaceLayer = true;
              }
            }

            // manages adding a new layer
            currentLayersIndex++;

            currentLayersIndex > 3 ? currentLayersIndex = 0 : currentLayersIndex;

            var layer = new Layer(layers[currentLayersIndex]);
            layer.init();
            currentLayers.push(layer);

            // manages starting to kill a layer
            for (var i in currentLayers) {
              // now that a new layer is starting to show, lets set all to dying except for the last one
              if (Number(i)+1 === currentLayers.length && currentLayers.length > 1) {
                continue;
              };
              // kill all circles of all layers except last one added, after random seconds
              for (var j in currentLayers[i].circles) {
                // we have to pass i and j as arguments because asynchronous functions would otherwise take the values after the timeout, causing i and j to be the last value of their iterations
                window.setTimeout(function(i, j) {
                  currentLayers[i].circles[j].isDying = true;
                }.bind(this, i, j), Math.random() * maxTimeoutForKillingACircle);
              }
            }
          }, layerDuration);
        }

        // draw logo at the end so it has a higher z-index
        c.drawImage(logo, canvas.width/2 - logo.width/2,  canvas.height/2 - logo.height/2);

        if (!eventsAreListening) {
          // EVENT LISTENERS TO MANAGE LINKS
          canvas.addEventListener('mousedown', function(e){
            e.preventDefault();
            var isMiddleClick = e.which == 2;

            if (currentLink) {
              if (!isMiddleClick) {
                window.location.href = currentLink;
              } else {
                window.open(currentLink, "_blank");
                currentLink = null;
              }
            }
          });

          var tooOften = false;
          console.warn("attaching a new event listener")
          canvas.addEventListener('mousemove', function(e){
            // if (!tooOften) {
              tooOften = true;
              var hovering = false;

              var m =  {
                x: event.clientX,
                y: event.clientY
              };


              for (var c of currentLayers[currentLayers.length-1].circles) {
                var distance = Math.sqrt(Math.pow(Math.abs(c.x - m.x), 2) + Math.pow(Math.abs(c.y - m.y), 2));

                if (distance < c.radius) {
                  hovering = true;
                  currentLink = c.link;
                  document.body.style.cursor = "pointer";
                }
              }

              if (!hovering) {
                currentLink = null;
                document.body.style.cursor = "";
              }

              // window.setTimeout(function(){
              //   tooOften = false;
              // }, 200);
            // }
          });
        }

        eventsAreListening = true;

        animation = requestAnimationFrame(animate);
      }

      init();

      // QUICK WORKAROUND FOR SETTING THE MOUSEOVER EVENT LISTENER FOR LINKS ONLY ONCE
      var eventsAreListening = false;

      this.cancelAnimation = function () {
        cancelAnimationFrame(animation);
      };
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var smallCanvas = function(id, container = document.querySelector('.canvas-container'), showLogo = true) {
      //create canvas and append it
      var canvas = document.createElement('canvas');
      canvas.setAttribute('id', id);
      var container = container;
      container.insertBefore(canvas, container.childNodes[0]);

      // canvas setup
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      var c = canvas.getContext("2d");

      // logo
      if (showLogo) {
        var logo = new Image();
        logo.src = themeUri[0]+"/img/logo.png";
      }

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
      if (showLogo) {
        logo.onload = function(){
          center.width = logo.width;
          center.height = logo.height;
        }
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

        if (showLogo) {
          c.drawImage(logo, canvas.width/2 - logo.width/2,  canvas.height/2 - logo.height/2);
        }

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

      this.cancelAnimation = function () {
        cancelAnimationFrame(animation)
      }
    }

    var chooseCanvasToShow = function() {
      // remove old canvas when resize
      if (currentCanvas != null) {
        currentCanvas.cancelAnimation();
        var canvas = document.getElementById('canvas');
        canvas.parentNode.removeChild(canvas);
      }

      if (window.innerWidth > 900) {

        var container = document.querySelector('.canvas-container');
        if ( container ) currentCanvas = new bigCanvas();

      } else {

        var container = document.querySelector('.canvas-container');
        if ( container ) currentCanvas = new smallCanvas("canvas");

      }
    }

    var currentCanvas;

    chooseCanvasToShow();
    window.removeEventListener('resize', chooseCanvasToShow);
    window.addEventListener('resize', chooseCanvasToShow);

    var footerCanvasContainer = document.querySelector('.small-canvas-container');

    if (footerCanvasContainer) {
      smallCanvas("footer-canvas", footerCanvasContainer, false);
    }
  }
})();
