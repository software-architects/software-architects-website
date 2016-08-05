function subscribeToNewsletterWithEmail(e){if(isEmailValid(e)){$.ajax({method:"GET",url:"https://timecockpit.us5.list-manage.com/subscribe/post-json?u=f628a14a6f934bf75e14ef1c3&id=f4e09e442c&EMAIL="+e+"&c=?",dataType:"jsonp",contentType:"application/json; charset=utf-8",success:function(e){"success"!=e.result?(ga("send","event","Subscribe to newsletter button","Error occurred"),showErrorMessage(e.msg)):(ga("send","event","Subscribe to newsletter button","Subscribed successfully"),$("#successModal").modal());var t=$("#newletterEmail,#mce-EMAIL");t.each(function(e){this.value=""})}})}else{ga("send","event","Subscribe to newsletter button","Email not valid");var t=document.getElementById("mce-ERROR");t?t.value="Please enter a valid email address.":showErrorMessage("Please enter a valid email address.")}}function showErrorMessage(e){$(".tc-error-message").empty(),$(".tc-error-message").append(e),$("#errorModal").modal()}function subscribeToNewsletter(){var e=document.getElementById("mce-EMAIL");subscribeToNewsletterWithEmail(e.value)}function isEmailValid(e){var t=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;return!(!e||!t.test(e))}function sendForm(e){var t=$(e.target).parents("form").first(),r="input[required], select[required], textarea[required]",a="input[data-empty-required], select[data-empty-required], textarea[data-empty-required]";return!(t.find(r).filter(function(e,t){return!t.value}).length>0)&&(!(t.find(a).filter(function(e,t){return t.value}).length>0)&&(t.submit(),!0))}var currentPage=1,numberOfPages=1,startElement=0,endElement=9,elements=null;$(document).ready(function(){$("input,select,textarea").blur(function(e){$(e.target).addClass("tc-touched"),$(e.target).is(":invalid")?$("span[data-message-for='"+e.target.id+"']").addClass("tc-error-visible"):$("span[data-message-for='"+e.target.id+"']").removeClass("tc-error-visible")});var e=$(".tc-toc"),t=!1;if(e.length>0){var r="<ul>",a=$(".col-sm-8").find("h2, h3, h4");a.each(function(e,s){e+1<a.length&&(r+="<li> <a id='link"+e+"' href='#title"+e+"'>"+s.innerHTML+"</a>  </li>",s.setAttribute("id","title"+e),"H2"!=a[e+1].tagName?t||(t=!0,r+="<ul>"):t&&(r+="</ul>",t=!1))}),r+="</ul>",e.append(r),$("#summaryAffix").affix({offset:{top:$(".header").outerHeight(!0),bottom:$(".tc-container.tc-container-lightblue.tc-related-posts-container").outerHeight(!0)+$(".footer").outerHeight(!0)}})}}),function(e,t,r,a,s,n,i,o){e.GoogleAnalyticsObject=s,e[s]=e[s]||function(){(e[s].q=e[s].q||[]).push(arguments)},e[s].l=1*new Date,i=t.createElement(r),o=t.getElementsByTagName(r)[0],i.async=1,i.src=a,o.parentNode.insertBefore(i,o)}(window,document,"script","https://www.google-analytics.com/analytics.js","ga");var impressionTrackerOptions={elements:[{id:"tc-related-posts-container",threshold:.5}]};ga("create","UA-3324842-1","auto"),ga("require","outboundLinkTracker"),ga("require","linkid"),ga("require","eventTracker"),ga("require","impressionTracker",impressionTrackerOptions),ga("send","pageview");ata-message-for='" + eventObject.target.id + "']").removeClass("tc-error-visible");
        }
    });
    // add table of contents to blog articles
    var result = $(".tc-toc");
    var setUl = false;
    if (result.length > 0) {
        var text = "<ul>";
        var title = $(".col-sm-8").find("h2, h3, h4");
        title.each(function (index, value) {
            if (index + 1 < title.length) {
                text += "<li> <a id='link" + index + "' href='#title" + index + "'>" + value.innerHTML + "</a>  </li>";
                value.setAttribute("id", "title" + index);
                if (title[index + 1].tagName != "H2") {
                    if (!setUl) {
                        setUl = true;
                        text += "<ul>";
                    }
                }
                else {
                    if (setUl) {
                        text += "</ul>";
                        setUl = false;
                    }
                }
            }
        });
        text += "</ul>";
        result.append(text);
        //setting top and bottom for affix
        $("#summaryAffix").affix({
            offset: {
                top: $(".header").outerHeight(true),
                bottom: $(".tc-container.tc-container-lightblue.tc-related-posts-container").outerHeight(true) + $(".footer").outerHeight(true)
            }
        });
    }
});
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
