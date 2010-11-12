//
//  application.js
//
//  This would be a lot easier with jQuery, but I'm trying 
//  to keep things quick
//

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

function hasFlash() {
  var flashType = 'application/x-shockwave-flash';
  var flash = false;
  var types = navigator.mimeTypes;
  for (var i in types) {
    var type = types[i];
    if (type.type == flashType) {
      flash = true;
      break;
    }
  }
  return flash;
}

// http://faq.nucleuscms.org/item/104
function externalLinks() {
   if (!document.getElementsByTagName) {
      return;
   }
   var anchors = document.getElementsByTagName('a');
   for (var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      if (anchor.getAttribute('rel')) {
         var rel = anchor.getAttribute('rel');
         var external = false;
         if (rel.indexOf(" ") > 0) {
            while (rel.indexOf(" ") > 0 && external == false) {
               if (rel.substr(0, rel.indexOf(' ')) == 'external') {
                  external = true;
               }
               rel = rel.substr(rel.indexOf(' ') + 1, rel.length - rel.indexOf(' ') + 1);
            }
         }
         if (rel == 'external') {
            external = true;
         }
         if (anchor.getAttribute('href') && external == true) {
            anchor.target = '_blank';
         }
      }
   }
}

// Replace video embeds with <video> if possible
function substituteFlashVideos() {
  var userAgent = navigator.userAgent.toLowerCase();
  
  // If they have flash or have Firefox, stop since Flash does a better job playing
  // the video and Firefox doesn't support Vimeo's <video>
  if (hasFlash() || (userAgent.indexOf('firefox') != -1)) {
    return;
  }
  
  var videos = document.getElementsByClassName('video'),
    l = videos.length;
  
  // Stop if there are no videos
  if (l == 0) {
    return;
  }
  
  var disabledMessage = '<p style="text-align:center"><strong>Sorry, but you need Flash to watch this video.</strong></p><p style="text-align:center">I hate that as much as you do.</p>',
    iPhone = (userAgent.indexOf('iphone') != -1 || userAgent.indexOf('ipod') != -1),
    iOS = (iPhone || userAgent.indexOf('ipad') != -1),
    vimeoObjectRegex = new RegExp('[?&]clip_id(?:=([^&]*))?', 'i'),
    vimeoIframeRegex = new RegExp('http://player.vimeo.com/video/([^&?]*)\?', 'i'),
    i = 0,
    video, width, height, match;
  
  // Loop through videos
  for (; i < l; i++) {
    video = videos[i];
    
    // Vimeo video
    if (video.className.indexOf('vimeo') != -1) {
      
      var objects = video.getElementsByTagName('object'),
        iframes = video.getElementsByTagName('iframe'),
        clipId;
      
      // Old <object> embed style
      if (objects.length == 1) {
        var object = objects.item(0),
          embed = object.getElementsByTagName('embed').item(0),
          match = vimeoObjectRegex.exec(embed.getAttribute('src'));
          width = object.getAttribute('width');
          height = object.getAttribute('height');
      }
      
      // New <iframe> embed style
      else if (iframes.length == 1) {
        var iframe = iframes.item(0);
        match = vimeoIframeRegex.exec(iframe.getAttribute('src'));
        width = iframe.getAttribute('width');
        height = iframe.getAttribute('height');
      }
      
      if (match != null) {
        clipId = match[1];
      
        if (iPhone) {
          width = 260;
          height = (video.className.indexOf('wide') != -1) ? 146 : 195;
        }
      
        video.innerHTML = '<video src="http://www.vimeo.com/play_redirect?clip_id=' + clipId + '" controls="controls" width="' + width + '" height="' + height + '"></video>';

        var js = document.createElement('script');
        js.setAttribute('src', 'http://www.vimeo.com/api/oembed.json?url=' + encodeURIComponent('http://vimeo.com/' + clipId));
        document.getElementsByTagName('head').item(0).appendChild(js);
      } else {
        video.innerHTML = disabledMessage;
      }
    }
    
    // All other videos
    else {
      // Leave YouTube videos alone on iOS
      if (iOS && video.className.indexOf('youtube') == -1) {
        video.innerHTML = disabledMessage;
      }
    }
  }
}

// Pop out of frames (I'm looking at you Denver Airport)
if (top.frames.length != 0) {
  top.location = self.document.location;
}

// On DOM load, change external links to open in a new window
addLoadEvent(externalLinks);

// On DOM load, update videos if no flash
addLoadEvent(substituteFlashVideos);
