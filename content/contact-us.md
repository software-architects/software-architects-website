---
layout: page
title: Contact Us
permalink: /contact-us/
---

<div class="tc-contact">
	<div class="tc-container tc-container-white">
		<div class="tc-container-image"></div>
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<h1>Contact Us</h1>
					<p>Do you want to know more about time cockpit? Or would you like to see it in action in an online demo? Email us any questions that you might have. We would love to hear from you.</p>
	
					<form name="form" action="https://formspree.io/jovan@timecockpit.com" method="POST">
						<p>
							<label>E-Mail Adress</label>
							<input name="email" id="email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required />
							<span data-message-for="email" class="tc-error">Your E-Mail Adress is invalid</span>
						</p>

						<p class="confirmationField">
							<label>Please do not write in this field</label>
							<span><input name="emailConfirmation" type="text" id="emailConfirmation" data-empty-required /></span>
						</p>

						<p>
							<label>Message</label>
							<textarea type="text" name="message" rows="2" cols="20" id="message" required></textarea>
							<span data-message-for="message" class="tc-error">Please write a message in this field</span>
						</p>

						<p class="text-right"> 
							<a onclick="sendForm(event)" class="linkButtonMain">Send Message<span class="glyphicon glyphicon-circle-arrow-right" aria-hidden="true"></span>
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="tc-container tc-container-white">
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<h2>Adress</h2>
					<p>
						software architects gmbh<br />
						Welser Straße 26<br />
						Austria - 4060 Leonding<br />
						VAT identification number: ATU65831825<br /><br />
						+43 732 673575<br />
						<a href="mailto:support@timecockpit.com">support@timecockpit.com</a><br />
						<a href="http://twitter.com/timecockpit" target="_blank">follow us on twitter</a><br/>
						<a href="http://eepurl.com/oIeBT" target="_blank">subscribe to our newsletter</a>
					</p>
	
					<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2655.6622155619393!2d14.2685138!3d48.270874600000006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477396549be9de91%3A0xc6cf9a4b5fa51f37!2sWelser+Stra%C3%9Fe+26%2C+4060+Leonding!5e0!3m2!1sde!2sat!4v1406874724324" width="100%" height="400" frameborder="0" style="border:0"></iframe>
				</div>
			</div>
		</div>
	</div>
</div>