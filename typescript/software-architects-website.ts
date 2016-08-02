/// <reference path="../typings/jquery/jquery.d.ts" />
declare var ga: any;

var currentPage: number = 1;
var numberOfPages: number = 1;
var startElement: number = 0;
var endElement: number = 9;
var elements: JQuery = null;

function subscribeToNewsletterWithEmail(email: string) {
	if (isEmailValid(email)) {
		var input = { email: { email: email } };

		$.ajax({
			method: "GET",
			url: "https://timecockpit.us5.list-manage.com/subscribe/post-json?u=f628a14a6f934bf75e14ef1c3&id=f4e09e442c&EMAIL=" + email + "&c=?",
			dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
			success: function (data: any) {
				if (data["result"] != "success") {
					ga("send", "event", "Subscribe to newsletter button", "Error occurred");
					alert(data["msg"]);
				} else {
					ga("send", "event", "Subscribe to newsletter button", "Subscribed successfully");
					alert("Thanks for your registration! You are almost finished. We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.");
				}

				var input = $("#newletterEmail,#mce-EMAIL");
				input.each(function (element) {
					this.value = "";
				});
			}
		});
	} else {
		ga("send", "event", "Subscribe to newsletter button", "Email not valid");
		var error = <any>document.getElementById("mce-ERROR");
		if (error) {
			error.value = "Please enter a valid email address.";
		} else {
			alert("Please enter a valid email address.");
		}
	}
}

function subscribeToNewsletter() {
	var email = <any>document.getElementById("mce-EMAIL");
	subscribeToNewsletterWithEmail(email.value);
}

function isEmailValid(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if (email && re.test(email)) {
		return true;
	}

	return false;
}

function sendForm(eventData: any) {
    var form = $(eventData.target).parents("form").first();

    var requiredVar = "input[required], select[required], textarea[required]";
    var emptyrequiredVar = "input[data-empty-required], select[data-empty-required], textarea[data-empty-required]";

    if (form.find(requiredVar).filter((index: number, elem: Element) => { return !(<any>elem).value; }).length > 0) {
        return false;
    }

    if (form.find(emptyrequiredVar).filter((index: number, elem: Element) => { return (<any>elem).value; }).length > 0) {
        return false;
    }

    form.submit();
    return true;
}

$(document).ready(function () {
	// add error handling to forms
    $("input,select,textarea").blur((eventObject: JQueryEventObject) => {
        $(eventObject.target).addClass("tc-touched");

        if ($(eventObject.target).is(":invalid")) {
            $("span[data-message-for='" + eventObject.target.id + "']").addClass("tc-error-visible");
        }
        else {
            $("span[data-message-for='" + eventObject.target.id + "']").removeClass("tc-error-visible");
        }
    });

	// add table of contents to blog articles
    var result = $(".tc-toc");
    var setUl = false;

    if (result.length > 0) {
        var text = "<ul>";
        var title = $(".tc-blog-content").find("h2, h3, h4");

        title.each((index: number, value: Element) => {
            if (index + 1 < title.length) {

                text += "<li> <a id='link" + index + "' href='#title" + index + "'>" + value.innerHTML + "</a>  </li>";
                value.setAttribute("id", "title" + index);

                if (title[index + 1].tagName != "H2") {
                    if (!setUl) {
                        setUl = true;
                        text += "<ul>";
                    }
                } else {
                    if (setUl) {
                        text += "</ul>";
                        setUl = false;
                    }
                }
            }
        });

        text += "</ul>";
        result.append(text);
    }
});

(function (i: any, s: any, o: any, g: any, r: any: any, a: any, m: any) {
i["GoogleAnalyticsObject"] = r; i[r] = i[r] || function () {
	(i[r].q = i[r].q || []).push(arguments)
}, i[r].l = 1 * new Date(); a = s.createElement(o),
	m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

var impressionTrackerOptions = {
	elements: [
		{
			id: "tc-related-posts-container",
			threshold: 0.5
		}
	]};

ga("create", "UA-3324842-1", "auto");
ga("require", "outboundLinkTracker");
ga("require", "linkid");
ga("require", "eventTracker");
ga("require", "impressionTracker", impressionTrackerOptions);
ga("send", "pageview");

