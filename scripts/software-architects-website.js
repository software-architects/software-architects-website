/// <reference path="../typings/jquery/jquery.d.ts" />
var currentPage = 1;
var numberOfPages = 1;
var startElement = 0;
var endElement = 9;
var elements = null;
function subscribeToNewsletterWithEmail(email) {
    if (isEmailValid(email)) {
        var input = { email: { email: email } };
        $.ajax({
            method: "GET",
            url: "https://timecockpit.us5.list-manage.com/subscribe/post-json?u=f628a14a6f934bf75e14ef1c3&id=f4e09e442c&EMAIL=" + email + "&c=?",
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data["result"] != "success") {
                    ga("send", "event", "Subscribe to newsletter button", "Error occurred");
                    showErrorMessage(data["msg"]);
                }
                else {
                    ga("send", "event", "Subscribe to newsletter button", "Subscribed successfully");
                    $("#successModal").modal();
                }
                var input = $("#newletterEmail,#mce-EMAIL");
                input.each(function (element) {
                    this.value = "";
                });
            }
        });
    }
    else {
        ga("send", "event", "Subscribe to newsletter button", "Email not valid");
        var error = document.getElementById("mce-ERROR");
        if (error) {
            error.value = "Please enter a valid email address.";
        }
        else {
            showErrorMessage("Please enter a valid email address.");
        }
    }
}
function showErrorMessage(text) {
    $(".tc-error-message").empty();
    $(".tc-error-message").append(text);
    $("#errorModal").modal();
}
function subscribeToNewsletter() {
    var email = document.getElementById("mce-EMAIL");
    subscribeToNewsletterWithEmail(email.value);
}
function isEmailValid(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (email && re.test(email)) {
        return true;
    }
    return false;
}
function sendForm(eventData) {
    var form = $(eventData.target).parents("form").first();
    var requiredVar = "input[required], select[required], textarea[required]";
    var emptyrequiredVar = "input[data-empty-required], select[data-empty-required], textarea[data-empty-required]";
    if (form.find(requiredVar).filter(function (index, elem) { return !elem.value; }).length > 0) {
        return false;
    }
    if (form.find(emptyrequiredVar).filter(function (index, elem) { return elem.value; }).length > 0) {
        return false;
    }
    form.submit();
    return true;
}
//$(document).ready(function () {
//    // add error handling for forms
//    //$("input,select,textarea").blur((eventObject: JQueryEventObject) => {
//    //    $(eventObject.target).addClass("tc-touched");
//    //    if ($(eventObject.target).is(":invalid")) {
//    //        $("span[data-message-for='" + eventObject.target.id + "']").addClass("tc-error-visible");
//    //    }
//    //    else {
//    //        $("span[data-message-for='" + eventObject.target.id + "']").removeClass("tc-error-visible");
//    //    }
//    //});
//    // add table of contents to blog articles
//    var result = $(".tc-toc");
//    var setUl = false;
//    if (result.length > 0) {
//        var text = "<ul>";
//        var title = $(".col-sm-8").find("h2, h3, h4");
//        title.each((index: number, value: Element) => {
//            if (index + 1 < title.length) {
//                text += "<li> <a id='link" + index + "' href='#title" + index + "'>" + value.innerHTML + "</a>  </li>";
//                value.setAttribute("id", "title" + index);
//                if (title[index + 1].tagName != "H2") {
//                    if (!setUl) {
//                        setUl = true;
//                        text += "<ul>";
//                    }
//                } else {
//                    if (setUl) {
//                        text += "</ul>";
//                        setUl = false;
//                    }
//                }
//            }
//        });
//        text += "</ul>";
//        result.append(text);
//        //setting top and bottom for affix
//        //$("#summaryAffix").affix({
//        //    offset:
//        //    {
//        //        top: $(".header").outerHeight(true),
//        //        bottom: $(".tc-container.tc-container-lightblue.tc-related-posts-container").outerHeight(true) + $(".footer").outerHeight(true)
//        //    }
//        //});
//    }
//});
(function (i, s, o, g, r, any, a, m) {
    i["GoogleAnalyticsObject"] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");
var impressionTrackerOptions = {
    elements: [
        {
            id: "tc-related-posts-container",
            threshold: 0.5
        }
    ] };
ga("create", "UA-3324842-1", "auto");
ga("require", "outboundLinkTracker");
ga("require", "linkid");
ga("require", "eventTracker");
ga("require", "impressionTracker", impressionTrackerOptions);
ga("send", "pageview");
