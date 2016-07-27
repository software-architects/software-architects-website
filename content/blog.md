---
layout: page
title: Time Cockpit Blog - Tips and News from the Time Cockpit Team
permalink: /devblog/
---

<div class="row">
	<div class="col-sm-10">
		<div class="row blog-overview">
		{% assign blogposts = site.pages | where: "layout","blog" | sort: "date" | reverse %}

		{% for page in blogposts %}
			<div class="col-sm-12"><h2>{{ page.title }}</h2></div>
			<div class="col-sm-8">
				<p>{{ page.date | date_to_long_string }}</p>
				<p>{{ page.teaser }}</p>
				<p><a href="{{ page.url | prepend: site.baseurl }}">Read more ...</a></p>
			</div>
			<div class="col-sm-4">
			{% if page.bannerimage != null %}
				<img src="{{ page.bannerimage | prepend: site.baseurl }}" />
			{% endif %}
			</div>
		{% endfor %}
		</div>
	</div>
	<div class="col-sm-2">
		{% include tagcloud.html %}
	</div>
</div>