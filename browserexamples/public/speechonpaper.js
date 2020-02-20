
////// js for speech api //////

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

var recognizer = new window.SpeechRecognition();

// Recogniser doesn't stop listening even if the user pauses
recognizer.continuous = true;
// stream results, word by word, asap
recognizer.interimResults = true;

// Start recognising
recognizer.onresult = function(event) {
  for (var i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      updateArt(event.results[i][0].transcript)
      console.log(event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')');
      recognizer.stop();
    } else {
      updateArt(event.results[i][0].transcript)
    }
  }
}

// Listen for errors
recognizer.onerror = function(event) {
  console.log(event.message)
};

////// key listener to start experience ///////

view.onKeyDown = function(event) {
  if(event.key === 'space'){
    try {
      recognizer.start();
      console.log('recognition started');
    } catch(err) {
      console.log(err.message);
    }
  }
}


////// paperscript to create artwork //////

function updateArt(sentence){
  var words = sentence.split(' ')
  points.map(function(point) {point.text.remove()})
  points = []
  for (var i = 0; i < words.length; i++) {
    var newPoint = (Point.random() * view.size/2) + view.size/4;
    var newVector = new Point({
      angle: 360 * Math.random(),
      length: Math.random() * 10
    })
    var newTextPoint = new textPoint(newPoint, newVector, 'blue', words[i])
    points.push(newTextPoint);
  }
}


function textPoint(point, vector, colour, text) {
  this.radius = 100;
  this.point = point
  this.vector = vector
  this.maxVec = 0.1;
  this.text = new PointText(this.point);
  this.text.justification = 'center';
  this.text.fillColor = 'white';
  this.text.fontFamily = 'helvetica';
  this.text.fontWeight = 'bold';
  this.text.content = text;
  this.text.fontSize = 20;
  this.birthdate = Date.now()
  this.isDead = false;
}

textPoint.prototype = {
  update: function () {
    //make cells drift to centre
    var distFromCenter = this.point.getDistance(view.center)
    if(distFromCenter > 100) {
      var direc = (this.point - view.center).normalize(0.1)
      this.vector -= direc
    }

    // limit velocity
    if (this.vector.length > this.maxVec) this.vector.length = this.maxVec

    // add vector to point and update path's position accordingly
    this.point += this.vector
    this.text.position = this.point

    // when the object gets too old, shrink it and mark it as dead
    if(this.birthdate < Date.now() - 80*1000){
      this.text.scale(0.98)
    }
    if(this.birthdate < Date.now() - 83*1000){
      this.text.remove();
      this.isDead = true;
    }
  },

  // makes the cells avoid their neighbours
  react: function (b) {
    var dist = this.point.getDistance(b.point)
    if (dist < this.radius + b.radius && dist != 0) {
      var overlap = this.radius + b.radius - dist
      var direction = (this.point - b.point).normalize(overlap * 0.03)
      this.vector += direction
      b.vector -= direction
    }
  },
}

var words = ''.split(' ')
var points = []
for (var i = 0; i < words.length; i++) {
  var newPoint = (Point.random() * view.size/2) + view.size/4;
  var newVector = new Point({
    angle: 360 * Math.random(),
    length: Math.random() * 10
  })
  var newTextPoint = new textPoint(newPoint, newVector, 'blue', words[i])
  points.push(newTextPoint);
}


/* main */

var lastTick = 0
var path = new Path();
path.strokeColor = 'white';
path.smooth({ type: 'continuous' });

function onFrame() {
  var coordinates = points.map(function(point) {
    return point.point
  })
  path.removeSegments()
  path.addSegments(coordinates)
  path.smooth({ type: 'continuous' });


  for (var i = 0; i < points.length - 1; i++) {
    for (var j = i + 1; j < points.length; j++) {
      points[i].react(points[j])
    }
  }
  for (var i = 0, l = points.length; i < l; i++) {
    points[i].update()
  }

  // code that runs every second
  if (lastTick < Date.now() - 1000) {
    // dead objects from the array
    points = points.filter(function (cell) {
      return !cell.isDead
    })

    lastTick = Date.now()

  }

}

