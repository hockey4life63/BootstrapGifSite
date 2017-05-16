let gifObj = {
    apiKey: "api_key=dc6zaTOxFJmzC",
    url: "https://api.giphy.com/v1/gifs/search?",
    limit: "limit=10&",
    topics: ["Breaking Bad", "Curb Your Enthusiasm", "West Wing", "Longmire",
        "The X-Files", "SNL", "WestWorld", "Better Call Saul", "Archer", "The Office"
    ],
    apiCall: function(query) {
        let search = "q=" + query + "&";
        let queryURL = this.url + this.limit + search + this.apiKey;
        $.ajax({
            url: queryURL,
            method: "get"
        }).done(function(response) {
            for (var i = 0; i < response.data.length; i++) {
                gifObj.buildGif(query, response.data[i]);
            }
            $(".firstDiv").on("click", function() {
                $(this).children().eq(0).toggleClass("rot")
            })

        })

    },
    addButton: function(name) {

        this.topics.push(name);
        this.buildButtons();
        let nameID = "#" + name.replace(/ /g, "-");
        this.apiCall(name);
        $('.nav-tabs a[href="' + nameID + '"]').tab('show').attr("called", "true");
    },
    addGifLisnter: function() {

        $(".gifDisplay").on("click", function() {
            console.log("add Event")
            let img = $(this);
            let state = img.attr("state");
            if (state === "still") {
                img.attr("state", "animated");
                img.attr("src", img.attr("data-animated"));
            } else {
                img.attr("state", "still");
                img.attr("src", img.attr("data-still"));
            }
        })
    },
    buildButtons: function() {
        $("ul").text("");
        $(".tab-content").text("");
        for (var i = 0; i < this.topics.length; i++) {
            let idTExt = this.topics[i].replace(/ /g, "-");
            let item = $("<li>");
            let link = $("<a>");
            link.attr("data-toggle", "tab");
            link.attr("href", "#" + idTExt);
            link.attr("called", "false");
            link.attr("id", idTExt + "Tab");
            link.text(this.topics[i]);
            item.append(link);
            $(".nav-tabs").append(item);
            let newDiv = $("<div>");
            newDiv.attr("id", idTExt);
            newDiv.addClass("tab-pane fade");
            newDiv.append($("<h1>").text(this.topics[i]));
            $(".tab-content").append(newDiv);
        }
        $("a").on("click", function() {
            let called = $(this).attr("called");

            if (called === "false") {
                $(this).attr("called", "true");
                gifObj.apiCall($(this).text());

            }
        })

    },
    buildGif: function(loc, gif) {
        let item = $("<div>");
        item.addClass("gifDiv");
        let rating = $("<p>");
        rating.text("Rating: " + gif.rating);
        rating.addClass("rating");
        let mainDiv = $("<div>").addClass("firstDiv").css({ "width": gif.images.fixed_height.width });
        let innerDiv = $("<div>");
        innerDiv.append($("<img>").attr("src", gif.images.fixed_height_still.url));
        innerDiv.append($("<img>").attr("src", gif.images.fixed_height.url));
        // let img = $("<img>");
        // img.addClass("gifDisplay");
        // img.attr("data-still", gif.images.fixed_height_still.url);
        // img.attr("data-animated", gif.images.fixed_height.url);
        // img.attr("state", "still");
        // img.attr("src", gif.images.fixed_height_still.url);
        // item.append(img);
        mainDiv.append(innerDiv);
        item.append(mainDiv);
        item.append(rating);
        let locID = "#" + loc.replace(/ /g, "-")
        $(locID).append(item);
    },
    cap: function(word) {
        let newWord = "";
        let wasSpace = false;
        let test = word.trim();
        for (var i = 0; i < test.length; i++) {
            if (i === 0) {
                newWord += test[i].toUpperCase();
            } else if (wasSpace && test[i] !== " ") {
                newWord += test[i].toUpperCase();
                wasSpace = false;
            } else if (test[i] === " " && wasSpace !== true) {
                wasSpace = true;
                newWord += " ";
            } else if (wasSpace !== true) {
                newWord += test[i];
            }
        }
        return newWord;
    }
}
$("#addTV").on("click", function() {
    let name = $("#TVinput").val();
    if (name !== "") {
        gifObj.addButton(gifObj.cap(name));
    }
    $("#TVinput").val("");
});
gifObj.buildButtons();
$('.nav-tabs a[href="#' + gifObj.topics[0].replace(/ /g, "-") + '"]').tab('show').attr("called", "true");
gifObj.apiCall(gifObj.topics[0]);
