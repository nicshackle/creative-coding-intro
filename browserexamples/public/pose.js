var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject=stream;
    video.play();
  });
}

function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(video, 0, 0, document.getElementById("video").width, document.getElementById("video").height);
  ctx.fillStyle = "#ff0000";
  ctx.fillStyle = 'pink';
  ctx.font = "12pt Helvetica";
  ctx.shadowBlur = 2;
  ctx.textAlign = "center";
  ctx.shadowColor = "#000000";
  ctx.shadowOffs = 0;
  // if using a video file as source and not webcam
  //video.play()
  //video.playbackRate = 0.2;
  // We can call both functions to draw all keypoints
  drawKeypoints();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on('pose', gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready")
  poseNet.multiPose(video)
}

function getCompliment(part){
  //convert helloWorld to hello world
  return part.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2").toLowerCase()
}

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is high enough
      if (keypoint.score > 0.7) {
        ctx.beginPath();
        // exclude labels that clutter the face
        //if(!["rightEye","leftEye","rightEar","leftEar"].includes(keypoint.part)) {
          ctx.fillText("I love your", keypoint.position.x, keypoint.position.y)
          ctx.fillText(getCompliment(keypoint.part), keypoint.position.x, keypoint.position.y + 16);
        //}
        ctx.closePath();
      }
    }
  }
}

