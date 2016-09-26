$(document).ready(function() {

    var title = $('h1').html();

    function launch(fromRoot) {

        //FROM THE ROOT THRERE IS NOT BACKWARD LINK, ALL LINKS ARE PROCESSED THE SAME WAY

        if (fromRoot) {
            $('.odd a, .even a, .parent a').each(function() {
                if ($(this).attr("href").substr($(this).attr("href").length - 1) == "/") {
                    loadDoc(window.location.href + $(this).attr("href"), $(this), false);
                }
            });
        }
        //IF WE ARE NOT FROM THE ROOT THE PARENT LINK IS PROCESSED DIFFERENTLY BECAUSE IT GOES BACKWARD
        else {

            $('.odd a, .even a, .parent a').each(function(index, value) {

        //THE URL IS CONSTRUCTED BY REMOVING THE LAST BIT OF THE CURRENT URL
                if (index == 0 || index == 1) {
                    var the_arr = window.location.href.split('/');
                    the_arr.pop();
                    the_arr.pop();
                    the_arr = the_arr.join('/');

                    loadDoc(the_arr, $(this), true);
                } else {
                    if ($(this).attr("href").substr($(this).attr("href").length - 1) == "/") {
                        loadDoc(window.location.href + $(this).attr("href"), $(this), false);
                    }
                }
            });
        }
    }

//AJAX REQUEST FUNCTION, SEND THE RESPONSE TO processReponse
    function loadDoc(target, object, isBackward) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                processResponse(this.responseText, object, isBackward);
            }
        };
        xhttp.open("GET", target, true);
        xhttp.send();
    }


    function processResponse(response, object, isBackward) {
        if (response.match(/<!--\swe\sopen[\S\s]*<!--wrapperclose-->/)) {
            var refLink = object.attr("href");
            var wrapperContent = response.match(/<!--\swe\sopen[\S\s]*<!--wrapperclose-->/);
            var titleContent = "";

            wrapperContent = wrapperContent[0];


            if (refLink == "/") {
                titleContent = title;
            } else {
                if (!isBackward)
                    titleContent = window.location.pathname + refLink.substr(0, refLink.length - 1);
                else
                    titleContent = refLink.substr(0, refLink.length - 1);

            }

            object.attr("href", "javascript:void(0)");


            object.click(function() {

                $(".wrapper table").css("opacity", 0);
                $("#title").css("opacity", "0");
                document.getElementById('title').style.display = "none";


                $(".wrapper").html(wrapperContent);
                document.getElementById('title').innerHTML = titleContent;


                $("#title").fadeTo("fast", 1);
                $(".wrapper table").fadeTo("fast", 1);



                if (refLink != "/") {
                    if (!isBackward)
                        window.history.pushState("", "", window.location.href + refLink);
                    else
                        window.history.pushState("", "", "http://" + location.hostname + refLink);

                    launch(false);
                } else {
                    window.history.pushState("", "", "http://" + location.hostname);
                    launch(true);
                }


            });
        } else {

        }
    }

    //LAUNCH FROM ROOT IF THE URL IS NO LONGER THAN "/" OTHERWISE WE LAUNCH FROM ANYWHERE IN THE TREE

    if (window.location.pathname.length > 1)
        launch(false);
    else {
        launch(true);
    }
})
