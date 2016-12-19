theParent = document.querySelector("body");
theKid = document.createElement("div");

theKid.setAttribute('id','svgHolder');

// prepend theKid to the beginning of theParent
theParent.insertBefore(theKid, theParent.firstChild);


var request = new XMLHttpRequest();
request.open('GET', '../fonts/svgAssets.svg', true);
request.onreadystatechange = function (anEvent) {
   if (request.readyState == 4) {
      if(request.status == 200) {
         document.querySelector("#svgHolder").innerHTML = request.responseText;
      }
   }
};
request.send(null);