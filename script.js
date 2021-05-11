video = document.getElementById('video');

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
	faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
	faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
	faceapi.nets.faceExpressionNet.loadFromUri('/models')]).then(startVideo);

function startVideo(){
	navigator.getUserMedia(
	{video: {} },
	stream => video.srcObject = stream,
	err => console.error(err))
}
let i = 0;
let happiness = 0;
video.addEventListener('play', ()=>{
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas);
	const displaySize = {width: video.width, height: video.height}
	faceapi.matchDimensions(canvas, displaySize);
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, 
		new faceapi.TinyFaceDetectorOptions()).
		withFaceLandmarks().withFaceExpressions()
		const resizedDetections = faceapi.resizeResults(detections, displaySize);
		canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
		// faceapi.draw.drawDetections(canvas, resizedDetections);
		// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
		// faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
		const expressions = detections[0].expressions;
		Object.entries(expressions).forEach(([key, value]) => {
			if(key==='happy' && value > 0.9){
				console.log('Youre happy!');
				happiness++;
			}
			if(happiness>=10){
				window.location.href = 'newPage.html';

			}
			});
			
		
	}, 100)
});