---
layout: blog
title: Cloud Computing - was bringt's? (German)
excerpt: Am 27. September 2012 durfte ich gemeinsam mit Thomas Rümmler von AIT einen Vortrag zum oben genannten Thema auf dem 2. Symposium für Software Architektur und effiziente Entwicklung variantenreicher Systeme der Technischen Akademie Esslingen (Stuttgart) halten. In diesem Blogartikel finden Sie die Slides und den Text für das Tagungshandbuch)
author: Rainer Stropek
date: 2012-10-02
bannerimage: 
lang: en
tags: [Azure]
permalink: /devblog/2012/10/02/Cloud-Computing---was-bringts-German
---

<div>
  <p>
    <strong>Am 27. September 2012 durfte ich gemeinsam mit Thomas Rümmler von AIT einen Vortrag zum oben genannten Thema auf dem <a href="http://www.tae.de/de/kolloquien-symposien/informationstechnologie/2-symposium-software-architektur-2012.html" title="Homepage des Symposiums" target="_blank">2. Symposium für Software Architektur und effiziente Entwicklung variantenreicher Systeme</a> der <a href="http://www.tae.de/" title="Homepage Technische Akademie Esslingen" target="_blank">Technischen Akademie Esslingen</a> (Stuttgart) halten. Die Slides für unseren Vortrag finden Sie unten. Der Text wurde im Tagungshandbuch (ISBN 978-3-943563-01-6) veröffentlicht.</strong>
  </p>
  <iframe src="http://www.slideshare.net/slideshow/embed_code/14551589?rel=0" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen"></iframe>
  <div style="margin-bottom:5px" data-mce-style="margin-bottom: 5px;">
    <strong>
      <a href="http://www.slideshare.net/rstropek/cloud-computing-was-bringts" title="Cloud computing was bringt's" target="_blank">Cloud computing was bringt's</a>
    </strong> from <strong><a href="http://www.slideshare.net/rstropek" target="_blank">rstropek</a></strong></div>
  <h2>Autoren</h2>
  <p>Thomas Rümmler<br /><a href="http://www.aitgmbh.de/" title="Homepage AIT GmbH" target="_blank">AIT GmbH &amp; Co. KG</a>, Stuttgart</p>
  <p>Rainer Stropek<br /><a href="http://www.timecockpit.com" title="Homepage of time cockpit">software architects gmbh</a>, Linz, Österreich</p>
  <h2>Zusammenfassung</h2>
  <p>Ist Cloud Computing für Sie sinnvoll? Sollten Sie auf Platform-as-a-Service bei Ihrer Softwareentwicklung setzen? Entsteht durch Cloud Computing für Ihr Unternehmen ein Mehrwert?</p>
  <p>Beim Einsatz einer Cloud-Plattform, wie z.B. Windows Azure, können sich Vorteile für Ihre Softwareentwicklung und Ihr Unternehmen ergeben. Es gibt verschiedene Einsatzszenarien, in denen Cloud Computing besonders geeignet ist. Die Wahl des Abstraktionsniveaus (SaaS, PaaS, IaaS) in Verbindung mit den richtigen Designentscheidungen sind richtungsweisend.</p>
  <p>Die Projekte <a href="http://www.timecockpit.com" title="Homepage of time cockpit">time cockpit</a> und <a href="http://www.tfm-now.com" title="Hompage of TFM" target="_blank">TFM</a> stellen exemplarisch die Unterschiede im Softwareentwicklungs- und Betriebsprozess bei SaaS Lösungen in der Cloud im Vergleich zur klassischen Softwareentwicklung für den Vorortbetrieb dar. Die beiden Produkte waren zwei der ersten Lösungen aus dem deutschsprachigen Raum, die von Grund auf für SaaS und Cloud konzipiert wurden.</p>
  <h2>1. Grundlagen</h2>
  <h3>1.1 Einführung in Cloud Computing</h3>
  <p>Die Top Ten IT-Trends für das Jahr 2012 der Analysten Gartner, Forrester, PAC, IDC und Experton Group beinhalten Cloud Computing. (vgl. Kurzlechner, 2011, S. o.A.) Armbrust et al. bewerten den Einfluss von Cloud Computing wie folgt: „Cloud Computing is likely to have the same impact on software that foundries have had on the hardware industry.“<a href="#_ftn1">[1]</a> (Armbrust et al., 2009, S. 2–3) Laut Benlian et al. werden die aktuellen Entwicklungen der großen Unternehmen in der IT-Branche, wie Microsoft oder SAP, als „[…] Basis für neue, ‚as-a-Service‘-basierte Software-Ecosysteme gelegt.“ (Benlian et al., 2010, S. 58)</p>
  <p>
    <em>Die Cloud</em> scheint zu verändern. Diesen Eindruck bestätigt auch Gunter Dueck, der in seiner Kolumne DUECK-β-INSIDE, welche regelmäßig im Informatik Spektrum<a href="#_ftn2">[2]</a> veröffentlicht wird, einen Artikel namens Cloudwirbel verfasst hat. Direkt in der Einleitung formuliert er die Auswirkungen auf die IT wie folgt: „Die Cloud beginnt, unsere ganze IT durcheinander zu wirbeln!“ (Dueck, 2011, S. 309)</p>
  <p>Doch was steckt dahinter? Welcher Mehrwert ergibt sich für Softwarehersteller und welche Auswirkungen hat das auf die Architektur?</p>
  <p>In Deutschland gibt es noch keine eindeutige, standardisierte Definition von Cloud Computing. Derzeit arbeitet das Deutsche Institut für Normung e.V. (DIN)<a href="#_ftn3">[3]</a> im Arbeitsausschuss für Verteilte Anwendungsplattformen und Dienste des Normenausschusses für Informationstechnik und Anwendungen an der Normierung des Begriffs. (vgl. DIN, 2011, S. 1) Jedoch gibt es noch weitere, unterschiedliche Ansätze, den Begriff zu erläutern.</p>
  <p>So veröffentlicht beispielsweise das Fraunhofer Institut auf seiner Website eine Erklärung zu Cloud Computing. Nachfolgend ein Auszug daraus: „Cloud Computing bezeichnet […] ein IT-Modell, das weit über das reine Computing - also die Nutzung von Rechenleistung - hinaus geht. Im Wesentlichen bezeichnet Cloud Computing die Auslagerung von IT-Diensten an externe Dienstleister. Diese kann neben Rechenleistung und Speicherkapazitäten (Infrastructure-as-a-Service) auch die Bereitstellung von Plattformen mit Mehrwertdiensten wie Sicherheitslösungen und Abrechnungsdiensten oder […] die Nutzung von Software-as-a-Service in vielen verschiedenen Ausprägungen umfassen.“ (Fraunhofer-Allianz Cloud Computing, 2011, S. o.A.)</p>
  <p>Auch der Bundesverband Informationswirtschaft, Telekommunikation und neue Medien e.V. (BITKOM)<a href="#_ftn4">[4]</a> beschäftigt sich mit dem Thema. In seinem Leitfaden <em>Cloud Computing</em> ist folgende Erläuterung zu finden: „Cloud Computing ist eine Form der bedarfsgerechten und flexiblen Nutzung von IT-Leistungen. Diese werden in Echtzeit als Service über das Internet bereitgestellt und nach Nutzung abgerechnet. Damit ermöglicht Cloud Computing den Nutzern eine Umverteilung von Investitions- zu Betriebsaufwand.“ (BITKOM, 2009, S. 9)</p>
  <p>Alternativ kann sich auf die formal festgeschriebene Definition des National Institute of Standards and Technology <a href="#_ftn5">[5]</a> (NIST) stützen, einer Behörde, die zum US-amerikanischen Handelsministerium gehört.</p>
  <p>Die Definition von Cloud Computing des NIST<a href="#_ftn6">[6]</a> beginnt wie folgt: „Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (e.g., networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction. This cloud model is composed of five essential characteristics, three service models, and four deployment models.“ <a href="#_ftn7">[7]</a>(Mell &amp; Grance, 2011, S. 2)</p>
  <p>Das NIST listet in seiner Definition fünf grundlegende Eigenschaften auf: <em>On-demand self-service</em>, <em>Broad network access</em>, <em>Resource pooling</em>, <em>Rapid elasticity</em> sowie <em>Measured service</em>. (vgl. Mell &amp; Grance, 2011, S. 2) Gartner <a href="#_ftn8">[8]</a> hingegen stellt folgende fünf Kriterien von Cloud Computing besonders heraus: <em>Service-Based</em>, <em>Scalable and Elastic</em>, <em>Shared, Metered by Use</em> sowie <em>Uses Internet Technologies</em>. (vgl. Gartner, 2009, S. o.A.) Die wohl bekannteste Eigenschaft ist bei Gartner als <em>Metered by Use</em> gekennzeichnet. Bei der NIST Definition hingegen ist diese Eigenschaft nicht separat aufgelistet. Hier verbirgt sich das Merkmal hinter drei anderen Aspekten.</p>
  <h3>1.2 Anbieter</h3>
  <p>Aus Sicht der ISVs sind Anbieter von <em>Platform as a Service</em> von besonderem Interesse. Dieses Angebot zielt speziell auf Softwareentwickler und bietet ihnen eine Plattform, auf deren Basis Software hergestellt werden kann (vgl. 3.1).</p>
  <p>Für eine Cloud-Plattform gibt es aktuell vier große Anbieter. Es handelt sich dabei um Amazon, Google, Microsoft und Salesforce. (vgl. Meir-Huber, 2010, S. 79, 118, 151, 161) Amazon tritt mit seinem Produkt <em>Amazon Web Services</em><a href="#_ftn9">[9]</a> am Markt auf. Google nennt seine Plattform <em>Google App Engine</em><a href="#_ftn10">[10]</a>. Microsofts Cloud-Plattform ist unter dem Namen <em>Windows Azure Platform</em><a href="#_ftn11">[11]</a> zu finden und Salsforce hat die Plattform <em>force.com</em><a href="#_ftn12">[12]</a> rund um sein CRM-System erstellt.</p>
  <p>Anbieter von Cloud-Plattformen sind in Ihrer Anzahl deutlich geringer am Markt vertreten, als Anbieter von <em>Infrastructure as a Service</em> (vgl. 3.1). Dies liegt darin begründet, dass der Plattformenmarkt ein junger Markt ist, während Anbieter im Bereich Infrastructure as a Service auf die Erfahrungen aus Hostingangeboten zurückgreifen können. Eine Auswahl und Klassifikation der großen Managed Hosting Provider in Europa steht in der Studie <em>Managed hosting in Europe</em> des Marktforschungsunternehmens Quocirca <a href="#_ftn13">[13]</a> zur Verfügung (vgl. Tarzey &amp; Longbottom, 2009, S. 7)</p>
  <h2>2. Hosting vs. Cloud</h2>
  <h3>2.1 Abgrenzung</h3>
  <p>Hostingangebot und Cloud-Dienstleistungen lassen sich eindeutig von einander unterscheiden. Dazu dienen folgende Abgrenzungsfaktoren:</p>
  <p>
    <strong>Abgrenzungsfaktor <em>Abstraktion</em>:</strong> Plattformorientiertes Cloud Computing arbeitet auf einem höheren Abstraktionslevel als Hosting.</p>
  <p>Eine Parallele der Abstraktion lässt sich zwischen Hosting und <em>Infrastructure as a Service</em> ziehen. Eine Cloud-Plattform bietet seinen Kunden Dienste auf einer höheren logischen Ebene, als reine Verwaltungsdienste. Dem Anwendungsentwickler wird eine Entwicklungsumgebung bereitgestellt, die bereits spezielle APIs zur Abstraktion der darunterliegenden Schicht anbietet. Der Zugriff auf das darunterliegende Betriebssystem bleibt in diesem Fall verwehrt. (vgl. Meir-Huber, 2010, S. 44)</p>
  <p>Die Abstraktion ruft Einschränkungen hervor, die zu geringerer Flexibilität führen. Beispielsweise kann die Anwendung mit niedrigeren Berechtigungen ausgeführt werden, wodurch der Schreibzugriff auf das lokale Dateisystem unterbunden werden kann. (vgl. Krishnan, 2010, S. 8)</p>
  <p>Auf der anderen Seite bietet die Abstraktion die Möglichkeit, Dienste zu nutzen, ohne sie selbst implementieren zu müssen (vgl. Abbildung 1). „Platform providers also provide abstractions around services (such as email, distributed chaches, structured storage) […]“ <a href="#_ftn14">[14]</a> (Krishnan, 2010, S. 8)</p>
  <p>Abbildung 1: Plattformkomponenten</p>
  <p>In der Abbildung 1 ist zu erkennen, dass eine entwickelte Anwendung lediglich über ein API gekapselt auf die eigentlichen Ressourcen zugreifen kann, ebenso auf Zusatzdienste wie E-Mail. Der Vorteil liegt hierbei in der Kapselung der eigentlichen Implementierung. Der Entwickler kann diese Dienste als fertige Bausteine verwenden.</p>
  <p>
    <strong>Abgrenzungsfaktor <em>Entwicklungsplattform</em>:</strong> Eine Cloud-Plattform dient als Betriebs- und Entwicklungsplattform.</p>
  <p>Bei PaaS wird eine Anwendung nicht nur gehostet. Eine Anwendung wird für die Plattform entwickelt, um deren API inklusive zusätzlicher Dienste nutzen zu können. Dies soll am Beispiel eines Speichermediums verdeutlicht werden. Ein Datenspeicher kann ein Dateiserver sein, auf den über Netzwerkfreigaben zugegriffen wird. In einer PaaS-Umgebung hingegen kann es einen Speicherdienst geben, der folgende zusätzliche Eigenschaften hat:</p>
  <ul>
    <li>Sicherung der Daten durch Redundanz</li>
    <li>Bereitstellung einer automatischen Ausfallsicherung</li>
    <li>Verteilen von Daten übers Internet</li>
  </ul>
  <p>Diese Merkmale werten einen Speicherdienst im Gegensatz zu einem Dateiserver auf. (vgl. Pallmann, 2011, S. 42)</p>
  <p>
    <strong>Abgrenzungsfaktor <em>Zielgruppe</em>:</strong> Cloud-Plattformen adressieren nicht IT-Dienstleister, sondern ISVs.</p>
  <p>Die Zielgruppe unterscheidet sich von der bei IaaS bzw. Hosting. PaaS-Leistungen nehmen bevorzugt Softwareentwickler in Anspruch, um darauf aufbauend Ihre Lösung zu erstellen. Dabei werden die Funktionen von PaaS als technisches Framework verwendet. „Es stellt als Basis die Entwicklungs- oder Applikationsplattform für darauf aufsetzende SaaS-Angebote[<a href="#_ftn15">[15]</a>] bereit.“ (Fröschle &amp; Reinheimer, 2010, S. 10)</p>
  <p>
    <strong>Abgrenzungsfaktor <em>Zusatzdienste</em>:</strong> Eine Cloud-Plattform stellt auf der einen Seite eine Infrastruktur bereit, auf der ein System betrieben wird. Auf der anderen Seite bringt sie noch weitere Dienste mit, die durch die Anwendung verwendet werden können.</p>
  <p>Beispiele dafür sind Abrechnungsservices für den Software as a Service Betrieb, Authentifizierungsdienste, Benachrichtigungssysteme, Caching und Überwachung. Selbst beim Vertrieb der entwickelten Anwendung kann eine Cloud-Plattform in Form digitaler Marktplätze unterstützen.</p>
  <h3>2.2 Architektur</h3>
  <p>Die Betriebsart ist deshalb bei der Entwicklung einer Software basierend auf <em>Platform as a Service</em> nicht frei wählbar. Es kann kein Setup an den Kunden ausgeliefert werden, welches auf einem Client installiert und die Software dann betrieben wird. Da PaaS eine Entwicklungs- und Betriebsplattform zugleich ist, schreibt sie den Betrieb auf der Plattform vor, auf der eine Software entwickelt wird.</p>
  <p>Die Entscheidung für eine bestimmte Plattform hat Einfluss auf die Laufzeitumgebung, Entwicklungswerkzeuge sowie den Entwicklungsprozess. Sie kann eine starke Abhängigkeit des Softwareentwicklers vom Plattform-Anbieter erzeigen. (vgl. Tietz et al., 2011, S. 353) Dem kann jedoch durch Einhaltung von bereits bestehenden Konzepten einer guten Software-Architektur entgegengewirkt werden.</p>
  <p>So sollte man beispielsweise bei der Anbindung der Datenhaltungsschicht einer Anwendung nicht auf proprietäre Protokolle und Verfahren eines Anbieters aufbauen. Vielmehr ist es ratsam, auf Standards, wie z.B. ODATA, welche von verschiedenen Cloud-Plattform-Anbietern unterstützt werden, zu setzen.</p>
  <p>Eine andere Form der Sicherstellung von Unabhängigkeit ist die konsequente Kapselung von Zugriffen. Wenn man an bestimmten Stellen auf plattformanbieterspezifische Komponenten zugreifen muss, so kann über durchgängige Kapselung der Wechsel auf eine andere Plattform mit gut kalkulierbarem Aufwand durchgeführt werden. Da in diesem Fall bestimmte Bibliotheken plattformspezifisch ausgelegt sind, müssen diese bei einem Wechsel ausgetauscht werden.</p>
  <p>Die Bindung an einen Anbieter kann jedoch unter Ausnutzung der plattformspezifischen Vorteile auch ganz bewusst erfolgen. Eine Generalisierung durch zusätzliche Schichten bedeutet in der Regel einen höheren Aufwand. Bei Zielumgebungen, die das App-Konzept, also der Einbettung von Anwendungen in eine Basisapplikation, verfolgen, kann eine enge Bindung durchaus gewünscht sein. Auch wenn das soziale Netzwerk facebook <a href="#_ftn16">[16]</a> nicht zu den typischen Cloud-Plattformen zählt, so gibt es gewisse Parallelen. Es erscheint jedoch im Kosten-Nutzen-Verhältnis wenig sinnvoll, den Zugriff auf die einzelnen facebook-Funktionen durch zusätzliche Schichten zu abstrahieren, um die Anwendung auch außerhalb von facebook betreiben zu können.</p>
  <h2>3. Mehrwert der Cloud</h2>
  <h3>3.1 Unterschiedliche Abstraktionsniveaus</h3>
  <p>Cloud Computing wird in drei Bereiche unterteilt. In der Definition des NIST sind dies die Servicemodelle <em>Infrastructure as a Service</em>, <em>Platform as a Service</em> sowie <em>Software as a Service</em>. (vgl. Mell &amp; Grance, 2011, S. 2–3)</p>
  <p>IaaS ist in seiner Struktur einer lokalen IT-Infrastruktur ähnlich. Vom Anbieter werden virtuelle Server (die Infrastruktur), zur Verfügung gestellt. Dadurch spart sich der Kunde die Anschaffung und den Betrieb von Hardware in eigenen Rechenzentren, da sie vom Service Provider on-demand angeboten wird.</p>
  <p>Es wird deutlich, dass es eine Verwandtschaft von IaaS zu traditionellem Hosting gibt. Bei IaaS kann man jedoch regelmäßig auf einfache Art Instanzen hinzufügen oder entfernen. Dabei kommt dem Self-Service eine besondere Bedeutung zu. Außerdem ist man nicht langfristig durch Verträge an den Anbieter gebunden ist.</p>
  <p>
    <em>Platform as a Service</em> stellt die nächst höhere Abstraktionsschicht dar. Die Abstraktion ruft Einschränkungen hervor, die zu geringerer Flexibilität führen. Beispielsweise kann die Anwendung mit niedrigeren Berechtigungen ausgeführt werden, wodurch der Schreibzugriff auf das lokale Dateisystem unterbunden werden kann. (vgl. Krishnan, 2010, S. 8)</p>
  <p>Auf der anderen Seite bietet die Abstraktion die Möglichkeit, Dienste zu nutzen, ohne sie selbst implementieren zu müssen. „Platform providers also provide abstractions around services (such as email, distributed chaches, structured storage) […]“ <a href="#_ftn17">[17]</a> (Krishnan, 2010, S. 8)</p>
  <p>
    <em>Software as a Service</em> ist die abstrakteste Form von Cloud Computing und repräsentiert die Möglichkeit, eine Software über das Internet bei Bedarf zur Verfügung zu stellen. (vgl. Meir-Huber, 2010, S. 46) „[O]nlinefähige Standardanwendungen [werden] dem Kunden skalierbar angeboten […]. Diese können im Unternehmenskontext betrieben werden und bedürfen lediglich grundlegender unternehmensindividueller Einstellungen.“ (Fröschle &amp; Reinheimer, 2010, S. 11)</p>
  <p>In der Rolle des Softwareentwicklers bzw. ISVs wird die Wahl in der Regel auf den Einsatz einer Cloud-Plattform fallen. Es gibt Fälle, z.B. bei der Verwendung von Legacy-Anwendugen, bei denen die Vorteile einer Plattform nicht genutzt werden, in denen man sich auf IaaS beschränkt. Auch hybride Ansätze bei denen beide Varianten gemischt werden, sind denkbar. SaaS ist ein mögliches Ergebnis, welches der ISV erbringen kann aber nicht muss.</p>
  <p>Je nach Wahl des Abstraktionsniveaus kann der Cloud-Provider mehr oder weniger zur Veredelung in der Wertschöpfung des Softwareentwicklungsprozesses beitragen.</p>
  <h3>3.2 Services</h3>
  <p>Die Zusatzdienste, die eine Cloud-Platform bereithält sind sehr vielfältig. Nachfolgend werden exemplarisch zwei dieser Dienste näher beleuchtet.</p>
  <p>
    <em>Authentifizierung in der Cloud (ACS)</em>
  </p>
  <p>Eine Software, die öffentlich über das Internet zugänglich ist, benötigt in der Regel einen Mechanismus zur Authentifizierung. Eine Cloud-Plattform kann hierfür bereits einen Dienst bereitstellen der die Identitätsprüfung eines Nutzers übernimmt. Dabei kommen im Internet verfügbare Identity Provider zum Einsatz, z.B. Windows Live Id, Facebook Id, Yahoo oder Google Account. Amazon, Google und Microsoft stellen je einen Authentifizierungsdienst zur Verfügung. In Windows Azure wird dieser Service durch den AppFabric Access Control Service (ACS) angeboten. Dahinter steht die Windows Identity Foundation, ein Teilbereich des .NET Frameworks <a href="#_ftn18">[18]</a>. (vgl. Microsoft, S. 1)</p>
  <p>
    <em>Storage</em>
  </p>
  <p>Bei der Verwendung von Storage-Systemen wird der Mehrwert einer Cloud-Plattform besonders deutlich. Während man bei einer lokal betriebenen Anwendung in der Regel eine relationale Datenbank selbst betreibt, bieten die Cloud-Provider dafür fertige Dienste an. Auch eine Mischform ist denkbar, also dass man aus einer lokalen Anwendung heraus eine Datenbank in der Cloud verwendet. Dabei ändern sich die Anforderungen an die Anwendungsarchitektur.</p>
  <p>Bei den meisten Anwendungen, die ohne eine Cloud-Plattform entwickelt werden, spielt es keine große Rolle, wie viele Daten exakt in einer relationalen Datenbank gespeichert werden. Insbesondere wenn diese Datenbank auf bestehender Hardware bereits vorhanden ist, steht ein gewisses Speicherkontingent zur Verfügung, welches mehr oder weniger ausgenutzt werden kann.</p>
  <p>Dies ändert sich bei dem Einsatz von Storage-Diensten in der Cloud. Diese werden unterschiedlich abgerechnet, nach Übertragungsmenge, nach verwendetem Speicherplatz oder beidem. Relationale Datenbankdienste sind nicht für alle Daten gleich gut geeignet. Muss man sehr große Datenmengen verwalten, die lediglich abgerufen, nicht jedoch weiter verarbeitet werden müssen, können diese in statischen Speicherdiensten abgelegt werden, bei denen der Speicherplatz günstiger ist als bei relationalen Datenbankdiensten.</p>
  <p>Der Softwarearchitekt von morgen (bzw. heute) muss also mehr denn je den Kostenaspekt im Auge behalten. <em>Design to cost</em> gewinnt zunehmend an Bedeutung.</p>
  <h2>4. Geschäftsmodelle im Wandel von Lizenzgeschäft hin zu SaaS</h2>
  <h3>4.1 SaaS aus Kunden- und Anbietersicht</h3>
  <p>Kaufen oder mieten – Software as a Service (SaaS) auf diese Frage zu reduzieren, wäre zu kurz gegriffen. Als Kunde von SaaS geht es nicht nur um eine alternative Finanzierungsform, also um die Verschiebung von CAPEX zu OPEX. Die guten SaaS Angebote sind eine Art Sorglospaket. Der Kunde muss keine Infrastruktur aufbauen, sich nicht um die Wartung kümmern und kann sich darauf verlassen, dass die benötigte Software verfügbar ist, wann immer er sie braucht. Die Erfolge, die beispielsweise Microsoft mit ihrer SaaS-Variante von Office feiert, beweisen, dass das Konzept von Kunden auf der ganzen Welt angenommen wird.</p>
  <p>Wie sieht es auf der Anbieterseite aus? Softwarehersteller, egal ob groß oder klein, möchten auf den SaaS-Zug aufspringen. Das Distributionsmodell erscheint ihnen aus mehreren Gründen attraktiv: Aus dem Kunden wird ein Klient, der für regelmäßigen, planbaren Umsatz sorgt. Dazu kommt, dass der Vertriebsprozess einfacher wird, da die Komplexität der IT-Infrastruktur für den Kunden großteils unsichtbar bleibt. Cloud Computing ist dabei ein wichtiger Katalysator. Durch die Cloud können auch kleine und mittlere Softwarehersteller den Schritt in Richtung SaaS wagen. Sie beziehen selbst die Plattform oder Infrastruktur als Service, vermeiden dadurch riskante Anfangsinvestitionen und können mit steigendem Erfolg bedarfsgerecht wachsen. SaaS, scheinbar eine eierlegende Wollmilchsau, die Kunden und Anbieter glücklich macht? Für Softwarehersteller, die über Jahre mit Lizenzgeschäft groß geworden sind, folgt jedoch nach wenigen Schritten in Richtung SaaS oft ein bitteres Erwachen aus diesem Traum. Ob SaaS funktioniert, bestimmen maßgeblich folgende drei Faktoren:</p>
  <ol>
    <li>Softwarearchitektur</li>
    <li>Kosten- und Preismodell</li>
    <li>Geschäftsprozesse</li>
  </ol>
  <h3>4.2 Softwarearchitektur</h3>
  <p>Lassen Sie uns mit der Softwarearchitektur beginnen. Das Zauberwort heißt hier „Multi-Tenancy“. Damit man als SaaS-Anbieter eine große Anzahl an Kunden (=Tenants) kosteneffizient bedienen kann, muss eine gemeinsam genutzte Infrastruktur auf die Kunden aufgeteilt werden. Warum nicht analog zu früher jedem Kunden seinen eigenen Server und seine eigene Datenbank? Dieses Konzept hat bei SaaS und Cloud ausgedient. Egal welchen Cloud-Anbieter Sie wählen, die Grundkosten für einen Server liegen monatlich im mittleren bis oberen zweistelligen Eurobereich. Gleiches gilt für die Datenbank. Wollen Sie als Hersteller mit SaaS nicht gerade die große Anzahl kleiner und mittlerer Kunden anlocken? Wenn Sie nicht in der Lage sind, mehrere Tenants gleichzeitig in einer gemeinsamen Infrastruktur zu betreiben, stehen sie schnell vor Mindestkosten von einigen hundert Euro pro Tenant und Monat und ihr schöner Traum vom attraktiven SaaS-Preismodell zerplatzt wie eine Seifenblase. Hier nur exemplarisch einige der Fragestellungen, die Multi-Tenancy für Softwarearchitekturen mitbringt:</p>
  <ul>
    <li>Mehrere Tenants teilen sich eine Infrastruktur – wie schottet man die Tenants voneinander ab?</li>
    <li>Nicht-triviale Softwareprodukte verlangen meistens kundenspezifische Anpassungen – wie geht man damit um, wenn es für alle Kunden eine gemeinsame Umgebung gibt?</li>
    <li>Kann man alle Kunden zwingen, gleichzeitig Versionswechsel mitzumachen? Falls nicht, wie löst man Versionierung vor dem Hintergrund von Multi-Tenancy?</li>
    <li>Wie sorgt man dafür, dass die zugrunde liegende Infrastruktur je nach Anzahl der aktiven Tenants elastisch skalieren kann – und das ohne Ausfall oder Neustart?</li>
  </ul>
  <p>Die Qualität der Umsetzung von Multi-Tenancy stellt bei SaaS einen wichtigen Wettbewerbsvorteil dar. In der Cloud sind die Kosten variabel. Man bezahlt das, was man nutzt und kann je nach Bedarf nach oben und unten skalieren. Im lokalen Rechenzentrum mag Sie eine Auslastung von 10% ruhig schlafen lassen, da das Spielraum für Lastspitzen bedeutet. In der Cloud ist sie ein Alarmsignal. Je besser Sie Ressourcen ausnutzen, je elastischer Sie auf Änderungen der Anzahl und Aktivität der Tenants reagieren, desto niedriger sind die Kosten.</p>
  <h3>4.3 Kosten- und Preismodell</h3>
  <p>Ein gutes Verständnis über die Kostentreiber bestimmt maßgeblich den Erfolg eines SaaS Anbieters. Steigen die Kosten mit der Anzahl an Benutzern oder gibt es andere Faktoren, welche die Kosten in die Höhe treiben (z. B. Anzahl der Transaktionen, Speicherbedarf, Fixkosten für monatliche Zahlungsabwicklung über Kreditkarten, etc.)? Eine wichtige Kennzahl, an der es ständig zu arbeiten gilt, ist „Cost per Revenue Generating Unit“ (z. B. Kosten pro Benutzer oder pro Transaktion). Ausgehend von ihr gilt es, ein attraktives Preismodell zu entwickeln. Wie geben Sie die Kosten mit entsprechendem Aufschlag an Kunden weiter? Setzen Sie ganz auf PAYG („Pay as you go“) oder bieten Sie ergänzend Paketangebote an?</p>
  <p>Das Design einer SaaS Lösung beginnt im Excel in Form des Geschäftsmodells. Im Sinne von „Design to Cost“ beeinflusst es nicht nur Marketing und Vertrieb sondern reicht bis hinein in die Softwarearchitektur. Ikea hat den Slogan „We design the price tag first“ bekannt gemacht. Als SaaS Anbieter sollten Sie sich ein Beispiel daran nehmen. Bei jeder Entscheidung betreffend Softwaredesign müssen Sie sich die Frage stellen, welche Auswirkungen sie für die operativen Kosten und damit indirekt auch für den Preis hat.</p>
  <h3>4.4 Geschäftsprozesse</h3>
  <p>Der dritte Faktor neben Architektur und Preismodell sind die Geschäftsprozesse. Viele Unternehmen unterschätzen zunächst die Revolution, die SaaS in dieser Hinsicht bedeutet. Während typische Lizenzverkäufer es gewohnt sind, wenige große Rechnungen zu schreiben, ähnelt der Verrechnungsprozess bei größeren SaaS Systemen mehr dem von Mobilfunkanbietern. Nutzungsdaten müssen bewertet werden („Rating“). Hunderte, vielleicht sogar tausende Rechnungen sind zu generieren („Billing“) und die nachfolgenden Zahlungen abzuwickeln („Payment“). Kunden erwarten heutzutage, dass das alles praktisch in Echtzeit erfolgt, da sie jederzeit abfragen wollen, wie viel Geld sie bereits verbraucht haben. Selbst wenn dieses Service nicht geboten wird, ist laufendes Rating wahrscheinlich für die Überwachung von Fair-Use Regeln oder Pre-Paid Nutzungsgrenzen notwendig.</p>
  <p>Der Wechsel vom großen Scheck beim Lizenzverkauf zum Einwurf kleiner Münzen bei SaaS zieht in Sachen Prozesse noch weitere Kreise. Gängige Vertriebsstrukturen müssen beispielsweise überdacht werden. Umsatzabhängige Boni müssen sich mehr am CLV („Customer Lifetime Value“) orientieren anstatt nur auf die Höhe einer Kundenbestellung abzuzielen. In dualen Lizenzsystemen, bei denen Kunden die Wahl zwischen Lizenzkauf und SaaS haben, gilt es, Strukturen zu finden, die einen Konkurrenzkampf der beiden Strategien und damit Kannibalisierungseffekte verhindern.</p>
  <h2>5. Fazit</h2>
  <p>Cloud Computing ist ein wichtiges Thema für die IT-Industrie. Durch Abgrenzungsfaktoren, wie Abstraktionsniveau, Bereitstellung einer Entwicklungsplattform sowie Zusatzdienste, unterscheidet sich plattformorientiertes Cloud Computing von Hosting.</p>
  <p>Zusammenfassend kann man sagen, dass der Wechsel zu SaaS für etablierte Unternehmen eine Herausforderung darstellt. Junge, aufstrebende Teams, die alle Aspekte von SaaS von Anfang an verinnerlichen, haben eine echte Chance, den Markt aufzumischen. Die Cloud ebnet dabei das Spielfeld, sodass die Größe eines Anbieters keinen entscheidenden Vorteil, manchmal sogar einen Nachteil wegen mangelnder Flexibilität mit sich bringt.</p>
  <h2>6. Literaturverzeichnis</h2>
  <p>Armbrust, M., Fox, A., Griffith, R., Joseph, A. D., Katz, R. H., Konwinski, A. et al. (2009). <em>Above the Clouds: A Berkeley View of Cloud Computing.</em> Zugriff am 06.01.2012. Verfügbar unter <a href="http://www.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-28.pdf">http://www.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-28.pdf</a>.</p>
  <p>Benlian, A., Hess, T. &amp; Buxmann, P. (Hrsg.). (2010). <em>Software-as-a-Service: Anbieterstrategien, Kundenbedürfnisse und Wertschöpfungsstrukturen</em> (1. Aufl.). Wiesbaden: Gabler.</p>
  <p>BITKOM (BITKOM Bundesverband Informationswirtschaft, T. u. n. M. e., Hrsg.). (2009). <em>Cloud Computing - Evolution in der Technik, Revolution im Business: BITKOM-Leitfaden.</em> Zugriff am 17.12.2011. Verfügbar unter <a href="http://www.bitkom.org/files/documents/BITKOM-Leitfaden-CloudComputing_Web.pdf">http://www.bitkom.org/files/documents/BITKOM-Leitfaden-CloudComputing_Web.pdf</a>.</p>
  <p>DIN. (2011). <em>Cloud Computing ready for practice?: Wolken greifbar machen,</em> DIN. Zugriff am 15.18.2012. Verfügbar unter <a href="http://www.nia.din.de/sixcms_upload/media/2397/Einladung%20und%20Agenda%20DIN-Workshop%20Cloud%20Computing.pdf">http://www.nia.din.de/sixcms_upload/media/2397/Einladung%20und%20Agenda%20DIN-Workshop%20Cloud%20Computing.pdf</a>.</p>
  <p>Dueck, G. (2011). Cloudwirbel: DUECK-BETA-INSIDE, <em>Informatik Spektrum</em> (34, Heft 3, S. 309–313). Berlin [u.a.]: Springer.</p>
  <p>Fraunhofer-Allianz Cloud Computing (Fraunhofer-Gesellschaft, Hrsg.). (2011). Was ist die Cloud? Zugriff am 15.08.2012. Verfügbar unter <a href="http://www.cloud.fraunhofer.de/de/faq/cloud.html">http://www.cloud.fraunhofer.de/de/faq/cloud.html</a>.</p>
  <p>Fröschle, H.-P. &amp; Reinheimer, S. (Hrsg.). (2010). <em>Cloud computing &amp; SaaS</em>. Heidelberg: dpunkt.</p>
  <p>Gartner, I. (2009). <em>Gartner Highlights Five Attributes of Cloud Computing: Gartner's Cloud Computing Special Report Examines the Realities and Risks of Cloud.</em> Zugriff am 21.12.2011. Verfügbar unter <a href="http://www.gartner.com/it/page.jsp?id=1035013">http://www.gartner.com/it/page.jsp?id=1035013</a>.</p>
  <p>Krishnan, S. (2010). <em>Programming Windows Azure</em> (1st). Beijing [u.a.]: O'Reilly.</p>
  <p>Kurzlechner, W. (CIO Magazin, Hrsg.). (2011). <em>Die Top-10-Listen der IT-Trends 2012: Gartner, Forrester, IDC &amp; Co.,</em> IDG Business Media GmbH. Zugriff am 04.01.2012. Verfügbar unter <a href="http://www.cio.de/strategien/2298020/">http://www.cio.de/strategien/2298020/</a>.</p>
  <p>Meir-Huber, M. (2010). <em>Cloud Computing: Praxisratgeber und Einstiegsstrategien</em>. Frankfurt am Main: Entwickler.press.</p>
  <p>Mell, P. &amp; Grance, T. (National Institute of Standards and Technology, Hrsg.). (2011). <em>The NIST Definition of Cloud Computing: Recommendations of the National Institute of Standards and Technology.</em> Zugriff am 19.12.2011. Verfügbar unter <a href="http://csrc.nist.gov/publications/nistpubs/800-145/SP800-145.pdf">http://csrc.nist.gov/publications/nistpubs/800-145/SP800-145.pdf</a>.</p>
  <p>Microsoft: How to Authenticate Web Users with Windows Azure Access Control Service. Online verfügbar unter http://www.windowsazure.com/en-us/develop/net/how-to-guides/access-control/, zuletzt geprüft am 15.08.2012.</p>
  <p>Pallmann, D. (2011). <em>The Windows Azure Handbook: Volume 1: Planning &amp; Strategy</em>. Charleston: CreateSpace.</p>
  <p>Tarzey, B. &amp; Longbottom, C. (Quocirca Ltd., Hrsg.). (2009). <em>Managed hosting in Europe: A review of the managed hosting market and suppliers in Europe.</em> Zugriff am 29.12.2011. Verfügbar unter <a href="http://www.quocirca.com/media/reports/062009/16/Quocirca_-_Managed_Hosting_in_Europe_-_June_2009.pdf">http://www.quocirca.com/media/reports/062009/16/Quocirca_-_Managed_Hosting_in_Europe_-_June_2009.pdf</a>.</p>
  <p>Tietz, V., Blichmann, G. &amp; Hübsch, G. (2011). Cloud-Entwicklungsmethoden: Überblick, Bewertungen und Herausforderungen, <em>Informatik Spektrum</em> (34, Heft 4, S. 345–354). Berlin [u.a.]: Springer.</p>
</div><div>
  <div>
    <p>
      <a id="_ftn1">[1]</a> Cloud Computing hat wahrscheinlich den gleichen Einfluss auf Software wie die Gießereien auf die Eisenwarenindustrie gehabt hat.</p>
  </div>
  <div>
    <p>
      <a id="_ftn2">[2]</a> Wissenschaftliche IT-Zeitschrift, herausgegeben vom Springer-Verlag</p>
  </div>
  <div>
    <p>
      <a id="_ftn3">[3]</a>
      <a href="http://www.din.de">http://www.din.de</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn4">[4]</a>
      <a href="http://www.bitkom.org">http://www.bitkom.org</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn5">[5]</a>
      <a href="http://www.nist.gov">http://www.nist.gov</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn6">[6]</a> Die vollständige Definition ist unter <a href="http://csrc.nist.gov/publications/nistpubs/800-145/SP800-145.pdf">http://csrc.nist.gov/publications/nistpubs/800-145/SP800-145.pdf</a> verfügbar.</p>
  </div>
  <div>
    <p>
      <a id="_ftn7">[7]</a> Cloud Computing ist ein Modell zur Bereitstellung von allgegenwärtigem, nachfragebasiertem Netzwerkzugang zu geteilten, konfigurierbaren Computing-Ressourcen (z.B. Netzwerken, Servern, Speicher, Anwendungen und Diensten). Diese können schnell erweitert sowie reduziert werden. Dabei sind kaum Verwaltungsaufwand bzw. Handeln des Service Providers erforderlich. Dieses Modell ist durch fünf Charakteristika, drei Servicemodelle und vier Bereitstellungsmodelle gekennzeichnet.</p>
  </div>
  <div>
    <p>
      <a id="_ftn8">[8]</a>
      <a href="http://www.gartner.com">http://www.gartner.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn9">[9]</a>
      <a href="http://aws.amazon.com">http://aws.amazon.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn10">[10]</a>
      <a href="http://code.google.com/appengine">http://code.google.com/appengine</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn11">[11]</a>
      <a href="http://www.windowsazure.com">http://www.windowsazure.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn12">[12]</a>
      <a href="http://www.force.com">http://www.force.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn13">[13]</a>
      <a href="http://www.quocirca.com">http://www.quocirca.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn14">[14]</a> Plattform Provider bieten auch Abstraktion von Services an (wie E-Mail, verteilte Caches, strukturierter Speicher).</p>
  </div>
  <div>
    <p>
      <a id="_ftn15">[15]</a> SaaS ist die Abkürzung für Software as a Service, vgl. Kapitel 3.1.3.</p>
  </div>
  <div>
    <p>
      <a id="_ftn16">[16]</a>
      <a href="http://facebook.com">http://facebook.com</a>
    </p>
  </div>
  <div>
    <p>
      <a id="_ftn17">[17]</a> Plattform Provider bieten auch Abstraktion von Services an (wie E-Mail, verteilte Caches, strukturierter Speicher).</p>
  </div>
  <div>
    <p>
      <a id="_ftn18">[18]</a> Softwareentwicklungsplattform von Microsoft, weitere Informationen auf der Microsoft-Webseite unter http://msdn.microsoft.com/en-us/netframework</p>
  </div>
</div>