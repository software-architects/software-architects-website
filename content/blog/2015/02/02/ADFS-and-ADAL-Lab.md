---
layout: blog
title: ADFS and ADAL Lab
teaser: In this blog article I summarize important links you will need when building a lab environment for demonstrating ADAL, ADFS & Co.
author: Rainer Stropek
date: 2015-02-02
bannerimage: 
lang: en
tags: [Azure,Visual Studio]
permalink: /blog/2015/02/02/ADFS-and-ADAL-Lab
---

<p>This week I will do a workshop about authentication/authorization in web and WPF applications. For that workshop I created a lab environment. This blog post summarizes important links and tips for that. I use it for myself as a reference for preparing the demo. However, maybe someone else has to prepare such a workshop too. Therefore I share all the links and tips with you.</p><p>
  <span style="color: rgb(37, 160, 218); font-size: 20px; line-height: 20px;">Technologies</span>
</p><p>Here are the links to the technologies and tools I cover in my auth workshop:</p><ul>
  <li>
    <a href="https://msdn.microsoft.com/en-us/library/bb498017.aspx" target="_blank">WS-Federation</a>
  </li>
  <li>
    <a href="http://oauth.net/2/" target="_blank">OAuth2</a>
  </li>
  <li>
    <a href="http://openid.net/connect/" target="_blank">Open ID Connect</a>
  </li>
  <li>
    <a href="https://technet.microsoft.com/en-us/library/hh831502.aspx" target="_blank">ADFS</a> (<em>Active Directory Federation Services</em>)</li>
  <li>ADAL (<em>Active Directory Authentication Library</em><a href="https://msdn.microsoft.com/en-us/library/azure/jj573266.aspx" target="_blank">for .NET</a> and <a href="https://github.com/AzureAD/azure-activedirectory-library-for-js" target="_blank">for JavaScript</a>)</li>
  <li>
    <a href="http://azure.microsoft.com/en-us/services/active-directory/" target="_blank">AAD</a> (Azure Active Directory)</li>
  <li>
    <a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3" target="_blank">Identity Server 3</a> (see also <a href="http://identityserver.github.io/Documentation/docs/" target="_blank">IDServer3 docs</a>)</li>
</ul><h2>The Lab's Server Environment</h2><p>For the workshop I created the following server environment (everything is running in <a href="http://azure.microsoft.com" target="_blank">Azure</a>):</p><ul>
  <li>
    <a href="http://azure.microsoft.com/en-us/documentation/articles/create-virtual-network/" target="_blank">VNet</a> with <a href="https://msdn.microsoft.com/en-us/library/azure/dn133792.aspx" target="_blank">Point-to-site-VPN</a> (assign all the machines mentioned below to this VNet)</li>
  <li>Azure VM for the <em>Active Directory Domain Controller</em> (see <a href="http://azure.microsoft.com/en-us/documentation/articles/active-directory-new-forest-virtual-machine/" target="_blank">detailed instructions</a>)
<br />
 Note: Install <em>Certificate Services</em> so that we can generate a certificate for ADFS.
<br /><img src="{{site.baseurl}}/content/images/blog/2015/02/ADFS_DC_Config.png" /></li>
  <li>
    <p>Second Azure VM for <em>ADFS</em> (see <a href="https://technet.microsoft.com/en-us/library/dn486775.aspx" target="_blank">detailed instructions</a>; in my scenario the URL is <em>https://adfs.corp.adfssample.com</em>)<br /> Tip: You might need to add the ADFS website to the Local Intranet Zone (see <a href="https://technet.microsoft.com/en-us/library/jj203438.aspx" target="_blank">this MSDN article</a>).</p>
    <p class="showcase">Do <strong>not</strong> use a CNAME record for the ADFS Server, you must <strong>use an A record</strong>.</p>
  </li>
  <li>Windows 8 machine with <em>Visual Studio</em> for code demos (you can use Azure's existing VS VM template to make things easier)</li>
</ul><p>In the workshop I am currently preparing, Azure AD is not relevant (unfortunately). Therefore, I don't setup an <a href="https://technet.microsoft.com/en-us/library/dn554244.aspx" target="_blank">ADFS proxy</a>. This will be a topic for future posts.</p><h2>Samples</h2><h3>OWIN and WS-Federation</h3><p>You can use this sample to demonstrate how simple it is to connect an ASP.NET MVC application with ADFS using <a href="https://msdn.microsoft.com/en-us/library/bb498017.aspx" target="_blank">WS-Federation</a>.</p><p>GitHub Link to the sample: <a href="https://github.com/AzureADSamples/WebApp-WSFederation-DotNet" target="_blank">https://github.com/AzureADSamples/WebApp-WSFederation-DotNet</a></p><p>
  <a href="http://www.cloudidentity.com/blog/2014/04/29/use-the-owin-security-components-in-asp-net-to-implement-web-sign-on-with-adfs/" target="_blank">Vittorio has a description</a> of what to change so that the sample works with ADFS. After the changes described there, your <em>Startup.Auth.cs</em> file will look something like this:</p>{% highlight c# %}using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.WsFederation;
using Owin;
using System.Configuration;

namespace WebApp_WSFederation_DotNet
{
    public partial class Startup
    {
        private static string realm = ConfigurationManager.AppSettings["ida:Wtrealm"];
        private static string metadata = "https://adfs.corp.adfssample.com/federationmetadata/2007-06/federationmetadata.xml";

        public void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            app.UseWsFederationAuthentication(
                new WsFederationAuthenticationOptions
                {
                    Wtrealm = realm,
                    MetadataAddress = metadata                                      
                });
        }
    }
}{% endhighlight %}<p>To make it easier for the audience to follow, consider switching <em>ADFS Authentication Method</em> from <em>Windows Authentication</em> to <em>Forms Authentication</em>. After that change, you have more time talking about URLs and the entire redirect flow.</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2015/02/ADFS_Auth_Methods.png?mw=800" />
</p><h3>OWIN, OAuth2, ADFS, and ADAL</h3><p>The second sample demonstrate the out-of-the-box OAuth2 implementation of ADFS. Currently, ADFS' OAuth2 does only support <a href="http://tools.ietf.org/html/rfc6749#section-4.1" target="_blank">authorization code grant</a>. So your possibilities are limited. The third sample (see below) will show us how to get around this limitation.</p><p>In this sample we start by setting up an OWIN-based web API. We protected it using <em>ADFS Bearer Auth</em> middleware (<em>Microsoft.Owin.Security.ActiveDirectory</em> package):</p>{% highlight c# %}using Microsoft.Owin.Security.ActiveDirectory;
using Owin;
using System.Configuration;
using System.IdentityModel.Tokens;

namespace OWIN_ADAL_ADFS_WebMVC
{
    public partial class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseActiveDirectoryFederationServicesBearerAuthentication(
                new ActiveDirectoryFederationServicesBearerAuthenticationOptions
                {
                    MetadataEndpoint = ConfigurationManager.AppSettings["ida:MetadataEndpoint"],
                    TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidAudience = ConfigurationManager.AppSettings["ida:Audience"]
                    }
                });
        }
    }
}{% endhighlight %}<p>Next, we build a <strong>WPF</strong> (<em>Windows Presentation Foundation</em>) <strong>full client</strong> using Microsoft's ADAL (<em>Active Directory Authentication Library</em>) <a href="https://msdn.microsoft.com/en-us/library/azure/jj573266.aspx">for .NET</a>:</p>{% highlight c# %}private async void Button_Click(object sender, RoutedEventArgs e)
{
    string authority = "https://adfs.corp.adfssample.com/adfs";
    string resourceURI = "https://adfssample.com/OWIN-ADAL-ADFS-WebMVC";
    string clientID = "82A2A9DE-131B-4837-8472-EDE0561A0EF6";
    string clientReturnURI = "http://anarbitraryreturnuri/";

    var ac = new AuthenticationContext(authority, false);
    var ar = await ac.AcquireTokenAsync(resourceURI, clientID, new Uri(clientReturnURI), new AuthorizationParameters(PromptBehavior.Auto, new WindowInteropHelper(this).Handle));

    string authHeader = ar.CreateAuthorizationHeader();
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:44302/api/Values");
    request.Headers.TryAddWithoutValidation("Authorization", authHeader);
    var response = await client.SendAsync(request);
    string responseString = await response.Content.ReadAsStringAsync();

    MessageBox.Show(responseString);
}{% endhighlight %}<p class="showcase">In the code above you find a <em>clientID</em>. Don't forget that you have to create this client in ADFS using <em><a href="https://technet.microsoft.com/en-us/library/dn479319.aspx" target="_blank">Add-AdfsClient</a></em>.</p><p>I recommend looking at the flow of requests using a web debugger like <a href="http://www.telerik.com/fiddler" target="_blank">Fiddler</a>. Note that this will only work if you switch to <em>Forms Authentication</em> (see above).</p><p>
  <img src="{{site.baseurl}}/content/images/blog/2015/02/ADFS_OAuth2_Fiddler.png?mw=800" />
</p><p>Last but not least we look at a demo showing how this works in an <strong>ASP.NET MVC app</strong>:</p>{% highlight c# %}public ActionResult About()
{
    string authorizationUrl = string.Format(
        "https://adfs.corp.adfssample.com/adfs/oauth2/authorize?api-version=1.0&response_type=code&client_id={0}&resource={1}&redirect_uri={2}",
        clientID,
        "https://adfssample.com/OWIN-ADAL-ADFS-WebMVC",
        "https://localhost:44303/Home/CatchCode");

    return new RedirectResult(authorizationUrl);
}

public async Task<ActionResult> CatchCode(string code)
{
    var ac = new AuthenticationContext("https://adfs.corp.adfssample.com/adfs", false);
    var clcred = new ClientCredential(clientID, "asdf");
    var ar = await ac.AcquireTokenByAuthorizationCodeAsync(code, new Uri("https://localhost:44303/Home/CatchCode"), clcred);
            
    string authHeader = ar.CreateAuthorizationHeader();
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:44302/api/Values");
    request.Headers.TryAddWithoutValidation("Authorization", authHeader);
    var response = await client.SendAsync(request);
    string responseString = await response.Content.ReadAsStringAsync();

    this.ViewBag.Message = responseString;

    return View("About");
}{% endhighlight %}<p>Note that in this example the web server does the REST call to the service protected by ADFS.</p><h2>Enter: Identity Server v3</h2><p>As you can see, you can do some interesting things with what Microsoft delivers out-of-the-box. However, a lot is still missing. ADFS does not even implement all OAuth2 flows (e.g. <a href="http://tools.ietf.org/html/rfc6749#section-4.2" target="_blank">implicit grant</a> is missing which would be important for <em>Single Page Apps</em>). ADFS does not implement the new shining star for auth <em>Open ID Connect</em>. Note that you can get all of that by using <em><a href="http://azure.microsoft.com/en-us/services/active-directory/" target="_blank">Microsoft Azure Active Directory</a></em>. However, that's only an option if you are willing to use the public cloud. We have a few large customers who do not want to use offerings like Azure (yet). They need a different solution.</p><a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3">Identity Server v3</a><em>
  <a href="http://identityserver.github.io/Documentation/docs/configuration/identityProviders.html" target="_blank">Identity Provider</a>
</em><br /><h3>The Server</h3><p>Configuring ADFS as an identity provider in IDServer3 isn't complicated:</p>{% highlight c# %}using Microsoft.Owin.Security.WsFederation;
using Owin;
using SelfHost.Config;
using Thinktecture.IdentityServer.Core.Configuration;
using Thinktecture.IdentityServer.Host.Config;

namespace SelfHost
{
    internal class Startup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            var factory = InMemoryFactory.Create(
                users:   Users.Get(), 
                clients: Clients.Get(), 
                scopes:  Scopes.Get());

            var options = new IdentityServerOptions
            {
                IssuerUri = "https://idsrv3.com",
                SiteName = "Thinktecture IdentityServer3 (self host)",

                SigningCertificate = Certificate.Get(),
                Factory = factory,

                AuthenticationOptions = new AuthenticationOptions()
                {
                    EnableLocalLogin = false,
                    IdentityProviders = ConfigureIdentityProviders
                }
            };

            appBuilder.UseIdentityServer(options);
        }

        private void ConfigureIdentityProviders(IAppBuilder app, string signInAsType)
        {
            var adfs = new WsFederationAuthenticationOptions
            {
                AuthenticationType = "adfs",
                Caption = "ADFS",
                SignInAsAuthenticationType = signInAsType,

                MetadataAddress = "https://adfs.corp.adfssample.com/federationmetadata/2007-06/federationmetadata.xml",
                Wtrealm = "urn:idsrv3"
            };
            app.UseWsFederationAuthentication(adfs);
        }
    }
}{% endhighlight %}<p>Note that this code sample disables local login entirely. If you turn off the consent screen for the client, the end user will typically not see anything from IDServer3.</p><p>IDServer3 supports a variety of hosting options including self-hosting in an executable and IIS. You can find samples for many of the options in the <a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3.Samples/tree/master/source" target="_blank">IDServer3 sample GitHub repository</a>.</p><h3>The Client</h3><p>As IDServer3 implements Open ID Connect completely, you are no longer limited to a specific OAuth2 flow. You can use the flow that fits best to your scenario. Samples for different client implementations can be found in the <a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3.Samples/tree/master/source/Clients" target="_blank"><em>Clients</em> folder of IDServer3's sample GitHub repository</a>.</p><p>An interesting sample is for instance the JavaScript client that uses <a href="http://tools.ietf.org/html/rfc6749#section-4.2">implicit grant</a> (<a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3.Samples/blob/master/source/Clients/JavaScriptImplicitClient-Simple/index.html" target="_blank">samplecode on GitHub</a>). If you run it, I recommend looking at the JWT token. You should find AD's claims in there.</p><p>
  <span style="color: rgb(37, 160, 218); font-size: 20px; line-height: 20px;">Further Readings</span>
</p><p>Do you want to dig deeper? Of course you should look at the usual sources (OAuth2 and OIC specs, MSDN, etc.). Additionally, the web is full of valuable blogs. Here are some of my security-related favorites:</p><ul>
  <li>Vittorio Bertocci's blog at <a href="http://www.cloudidentity.com/" target="_blank">http://www.cloudidentity.com/</a>, in particular the following posts: 

<ul><li><a href="http://www.cloudidentity.com/blog/2013/10/25/securing-a-web-api-with-adfs-on-ws2012-r2-got-even-easier/" target="_blank">Securing a Web API with ADFS on WS2012 R2 Got Even Easier</a></li><li><a href="http://www.cloudidentity.com/blog/2014/04/29/use-the-owin-security-components-in-asp-net-to-implement-web-sign-on-with-adfs/" target="_blank">Use the On-Premises Organizational Authentication Option (ADFS) With ASP.NET in Visual Studio 2013</a></li><li><a href="http://www.cloudidentity.com/blog/2014/08/28/use-adal-to-connect-your-universal-apps-to-azure-ad-or-adfs/" target="_blank">Use ADAL to Connect Your Universal Apps to Azure AD or ADFS</a></li><li><a href="http://www.cloudidentity.com/blog/2013/09/12/active-directory-authentication-library-adal-v1-for-net-general-availability/" target="_blank">Active Directory Authentication Library (ADAL) v1 for .NET – General Availability!</a></li></ul></li>
  <li>Watch Vittorio's TechEd 2014 <a href="http://channel9.msdn.com/events/TechEd/Europe/2014/DEV-B322" target="_blank">presentation on Channel9</a>.</li>
  <li>Blogs of Dominick Baier (<a href="http://leastprivilege.com/" target="_blank">http://leastprivilege.com/</a>) and Allen Brock (<a href="http://brockallen.com/" target="_blank">http://brockallen.com/</a>), the main contributors to <a href="https://github.com/IdentityServer/Thinktecture.IdentityServer3">Identity Server 3</a></li>
  <li>Dominick's <a href="https://vimeo.com/search?q=dominick+baier" target="_blank">videos at Vimeo</a></li>
  <li>
    <a href="http://blogs.technet.com/b/askpfeplat/archive/2014/11/03/adfs-deep-dive-comparing-ws-fed-saml-and-oauth-protocols.aspx" target="_blank">ADFS Deep-Dive: Comparing WS-Fed, SAML, and OAuth</a>
  </li>
  <li>
    <a href="http://blogs.msdn.com/b/webdev/archive/2013/09/20/understanding-security-features-in-spa-template.aspx" target="_blank">Understanding Security Features in the SPA Template for VS2013 RC</a>
  </li>
  <li>
    <a href="http://blogs.msdn.com/b/webdev/archive/2014/02/21/using-claims-in-your-web-app-is-easier-with-the-new-owin-security-components.aspx" target="_blank">Using Claims in your Web App is Easier with the new OWIN Security Components</a>
  </li>
</ul>