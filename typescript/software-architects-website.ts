/// <reference path="../typings/jquery/jquery.d.ts" />
var currentPage: number = 1;
var numberOfPages: number = 1;
var startElement: number = 0;
var endElement: number = 9;
var elements: JQuery = null;

function subscribeToNewsletterWithEmail(email: string) {
	ga("_trackEvent", "Newsletter", "Subscribe to newsletter time cockpit");

	if (isEmailValid(email)) {
		var input = { email: { email: email } };

		$.ajax({
			method: "GET",
			url: "https://timecockpit.us5.list-manage.com/subscribe/post-json?u=f628a14a6f934bf75e14ef1c3&id=f4e09e442c&EMAIL=" + email + "&c=?",
			dataType: "jsonp",
			contentType: "application/json; charset=utf-8",
			success: function (data: any) {
				if (data["result"] != "success") {
					alert(data["msg"]);
				} else {
					alert("Thanks for your registration! You are almost finished. We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.");
				}

				var input = $("#newletterEmail,#mce-EMAIL");
				input.each(function (element) {
					this.value = "";
				});
			}
		});
	} else {
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

    $("input,select,textarea").blur(function (eventObject: JQueryEventObject) {
        $(eventObject.target).addClass("tc-touched");

        if ($(eventObject.target).is(":invalid")) {
            $("span[data-message-for='" + eventObject.target.id + "']").addClass("tc-error-visible");
        }
        else {
            $("span[data-message-for='" + eventObject.target.id + "']").removeClass("tc-error-visible");
        }
    });
});

(function (i, s, o, g, r, a, m) {
i["GoogleAnalyticsObject"] = r; i[r] = i[r] || function () {
	(i[r].q = i[r].q || []).push(arguments)
}, i[r].l = 1 * new Date(); a = s.createElement(o),
	m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

ga("create", "UA-3324842-1", "auto");
ga("send", "pageview");

