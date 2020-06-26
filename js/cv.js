var canvas2 = document.getElementById("cv-window");
var ctx2 = canvas2.getContext("2d");
canvas2.width = 720;
canvas2.height = 1018;

// CV Image
cvImage = new Image ();

var loop2 = function(){
	if (completed==0){cvImage.src = "imgs/cv/cv-img-1.png"};
	if (completed==1){cvImage.src = "imgs/cv/cv-img-2.png"};
	if (completed==2){cvImage.src = "imgs/cv/cv-img-3.png"};
	if (completed==3){cvImage.src = "imgs/cv/cv-img-4.png"};
	if (completed==4){cvImage.src = "imgs/cv/cv-img-5.png"};
	
	ctx2.drawImage(cvImage, 0, 0);
};

setInterval(loop2, 1000/10);