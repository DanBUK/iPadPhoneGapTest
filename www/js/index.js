var piece = {
   center : {
      x: 320 / 2,
      y: 460 / 2,
      xShift : 0,
      yShift : 0
   },
   color: "#000",
   computeCenter: function (acceleration) {
     newCenter = {};
     newCenter.xShift = this.center.xShift * 0.8 + acceleration.x * 2.0;
     newCenter.yShift = this.center.yShift * 0.8 + acceleration.y * 2.0;
     newCenter.x = this.center.x + this.center.xShift;
     // use *minus* to compute the center's new y
     newCenter.y = this.center.y - this.center.yShift;
     // do not go outside the boundaries of the canvas
     if (newCenter.x < app.circleRadius) {
       newCenter.x = app.circleRadius;
     }
     if (newCenter.x > app.canvasWidth - app.circleRadius) {
       newCenter.x = app.canvasWidth - app.circleRadius;
     }
     if (newCenter.y < app.circleRadius) {
       newCenter.y = app.circleRadius;
     }
     if (newCenter.y > app.canvasHeight - app.circleRadius) {
       newCenter.y = app.canvasHeight - app.circleRadius;
     }
     this.center = newCenter;
   },
};

// 2048x1536

var app = {
  canvas: null,
  context: null,
  canvasWidth: 2048,
  canvasHeight: 1536,
  circleRadius: 32,
  debugEnabled: true,

  initialize: function () {
    this.bindEvents();
  },

  debug: function (str) {
    if (this.debugEnabled === true) {
      var dele = document.getElementById('debug');
      var e = document.createElement('span');
      e.textContent = str.toString();
      dele.appendChild(e);
      var e = document.createElement('br');
      dele.appendChild(e);
    }
  },

  // Bind Event Listeners
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    this.onDeviceReady();
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function () {
    this.canvas = document.getElementById('html5canvas');
    this.context = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this), false);
    this.setupAccelWatcher();
  },

  setupAccelWatcher: function () {
    // this.debug(' setupAccelWatcher ');
    this.debug(' typeof navigator: ' + typeof navigator);
    this.debug(' typeof accelerometer: ' + typeof navigator.accelerometer);
    this.watchId = navigator.accelerometer.watchAcceleration(
      this.accelWatcherSuccess.bind(this),
      this.accelWatcherError.bind(this),
      { frequency: 100 }
    );
    this.debug('<br/> setupAccelWatcher watchId: ' + this.watchId.toString(10));
  },
  
  accelWatcherSuccess: function (accel) {
    this.debug('accelWatcherSuccess');
    this.debug(accel);
    piece.computeCenter(accel);
    this.redrawCanvas();
  },
  
  accelWatcherError: function () {
    
  },

  resizeCanvas: function () {
    this.canvas.width = this.canvasWidth = window.innerWidth;
    this.canvas.height = this.canvasHeight = ((this.debugEnabled === true) ? -100 : 0 ) + window.innerHeight;
    this.debug('width: ' + this.canvasWidth);
    this.debug('height: ' + this.canvasHeight);
    this.redrawCanvas();
  },

  redrawCanvas: function () {
    this.drawBoard();
    this.drawPiece();
  },

  drawBoard: function () {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (var x = 0.5; x < this.canvasWidth; x += 10) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvasHeight);
    }
    for (var y = 0.5; y < this.canvasHeight; y += 10) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvasWidth, y);
    }
    this.context.strokeStyle = "#eee";
    this.context.stroke();
  },
  
  drawPiece: function () {
    this.context.fillStyle = piece.color;
    this.context.beginPath();
    this.context.arc(piece.center.x, piece.center.y, app.circleRadius, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.fill();
  }
};
