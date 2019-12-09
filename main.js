window.onload = function() {
	var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
var client = new HttpClient();
    window.getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    window.getIdFromVideo = function(url) {
        if (url.includes("://")&&url.includes("youtube")) {
            var jsoon = window.getParameterByName("v",url);
            return jsoon;
            console.log(jsoon);
        } else if(url.includes("youtu.be")){
	    return url.replace("https://youtu.be/","");
	}else {
            return url;
        }
    }
    window.quitFromModal = function(){
        window.logm("",false);
        document.getElementById("video-content").style.display = "block";
        document.getElementById("done").style.display = "none";
        document.getElementById("hc").innerHTML = "Converting your video";
        document.getElementById("errorimg").style.display="none";
        document.getElementById("loaderimg").style.display="block";
        document.getElementById("downloadprogress").style.display = "none";
        document.getElementById("done").innerHTML ="";
        if(window.xmlreq){
            window.xmlreq.abort();
        }
    }
    window.broken = false;
    window.logm = function(txt,error){
        if(!window.broken){
            document.getElementById("whileloading").innerHTML = "";
            if(error){
                window.broken = true;
                document.getElementById("whileloading").innerHTML ='<div class ="w3-animate-opacity w3-red">'+txt+'</div>'
            }else{
                document.getElementById("whileloading").innerHTML ='<div class ="w3-animate-opacity">'+txt+'</div><br>'
            }
        }
    }
    window.downloadhtml5 = function(event,source){
        document.getElementById("downloadprogress").style.display = "none";
        event.preventDefault();
        if(window.xmlreq){
            window.xmlreq.abort();
        }
	    console.log(source);

  	var mac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	if(mac){
		window.logm("Right-click on the video and select download",false);
	}else{
		window.logm("Click the 3 dots on the bottom-right of the video and select download",false);
	}
        	
        document.getElementById("done").innerHTML = '<video style="width:70%;" controls><source src="'+source.url+'" type="'+source.mimeType.split(";")[0]+'"></video>';
    }
    window.downloadFromSource = function(event,sourceid){
        window.logm("Fetching data from Youtube...",false);
        event.preventDefault();
        var source = window.allsources[sourceid];
        window.source = source;
        var x=new XMLHttpRequest();
        window.xmlreq = x;
	window.downloadhtml5(event,source);
	    document.getElementById("progress").style.display = 'none';
	    document.getElementById("downloadprogress").style.display = "none";
        //document.getElementById("whileloading").innerHTML+="<button onclick='window.downloadhtml5(event,source)' class ='w3-button w3-red w3-round' style='width:80%;'>Download using html5 video (faster for most browsers)</button>";
	    console.log(source.url);
	    x.open("GET", "https://rich-collard.glitch.me/"+source.url, true);
	    x.responseType = 'blob';
	    x.addEventListener("progress", updateProgress);
	    document.getElementById("downloadprogress").style.display = "block";
	    function updateProgress (oEvent) {
            if (oEvent.lengthComputable) {
                var percentComplete = oEvent.loaded / oEvent.total * 100;
                document.getElementById("progress").style.width =percentComplete+"%";
                document.getElementById("progress").innerHTML =Math.round(percentComplete)+"%";
                // ...
            } else {
                window.logm("Downloading. If download does not pop up within 30 seconds please contact support and reload the page.",false);
                document.getElementById("downloadprogress").style.display = "none";
                // Unable to compute progress information since the total size is unknown
            }
        }
    }
    window.allsources = [];
    
    window.convert = function() {
        window.broken = false;
        window.allsources = [];
        window.logm("Finding your video",false);
        var youtubeId = window.getIdFromVideo(document.getElementById("videourl").value);
        //console.log(getIdFromVideo("whttps://www.youtube.com/watch?v=EVBsypHzF3U&list=RDEVBsypHzF3U&start_radio=1"));
        //console.log(YoutubeVideo.decodeQueryString("https://www.youtube.com/watch?v=EVBsypHzF3U&list=RDEVBsypHzF3U&start_radio=1"));
        var servers = ["https://maple3142-ytdl-demo.glitch.me/api?id=","https://maple3142-ytdl-1.glitch.me/api?id=","https://maple3142-ytdl-2.glitch.me/api?id=","https://maple3142-ytdl-3.glitch.me/api?id="]
	var hour = new Date().getUTCHours()||4;
	var server = servers[Math.floor(Math.random()*servers.length)];
	client.get(server+""+youtubeId,function(video){
	    video = JSON.parse(video);
	    if(video.name&&video.name=="HTTPError"){
	        console.log(server+" is down")
	        window.convert();
	        return;
	    }
            window.logm("connecting to youtube",false);
            if(!video["stream"]){
                window.logm("Error: your video could not be found. Make sure the url is correct. <br><br>Also make sure there is no copyright-claimed material, such as music",true);
                document.getElementById("loaderimg").style.display="none";
                document.getElementById("errorimg").style.display="block";
                //document.getElementById("video-content").innerHTML = "<img src ='error.png' class='w3-animate-opacity' style='color:red;font-size:100px;'>";
            }
            //var webm = video.getSource("video/webm", "medium");
            //var mp4 = video.getSource("video/mp4", "1080p");
            //$("<video controls='controls'/>").attr("src", webm.url).appendTo("done");
            setTimeout(function(){
                if(!window.broken){
                    document.getElementById("whileloading").innerHTML = "";
                    window.logm("Select your perfered quality to download",false);
		    
                    var parseSource = function(source){
                        window.allsources.push(source);
                       // window.allsources[(window.allsources.length-1)].title = video.title;
                        document.getElementById("whileloading").innerHTML +="<button onclick = 'window.downloadFromSource(event,"+(window.allsources.length-1)+")' class ='w3-button w3-red w3-round' style='width:80%;'> type: "+source.mimeType.split(";")[0]+" quality: "+source["quality"]+"</button><br><br>";
                    }
		    for(var i in video["stream"]){
			parseSource(video["stream"][i]);
		    }
		    document.getElementById("whileloading").innerHTML +="<a href = 'https://ytdl-core-server.glitch.me/mp3?v="+youtubeId+"' class ='w3-button w3-purple w3-round' style='width:80%;'> type: audio/mp3 (beta)"+" quality: "+"126 kbps"+"</a><br><br>";
                    document.getElementById("video-content").style.display = "none";
                    document.getElementById("hc").innerHTML = "Preparing download";
                    document.getElementById("done").style.display = "block";
                    //https://www.youtube.com/watch?v=N9qYF9DZPdw
                    //document.getElementById("done").innerHTML = '<video style="width:70%;" controls><source src="'+mp4.url+'" type="video/mp4"></video>'

                }
            },1000);
            
        });
    }
    if(window.getParameterByName("v",document.location.href)){
	document.getElementById('id01').style.display='block';
	document.getElementById("videourl").value = window.getParameterByName("v",document.location.href);
    	window.convert();
    }
}
