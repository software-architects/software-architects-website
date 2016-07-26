---
layout: blog
title: Sourcecode Review Criteria
teaser: Customers regularly hire me to do code reviews for software projects. Over the years I put together my personal checklist. In this blog article I share a summary of it with you. Note that the checklist is in German. However, the article contains a link to auto-translate it in English.
author: Rainer Stropek
date: 2013-11-05
bannerimage: 
lang: en
tags: [.NET,C#,Project Management,Visual Studio]
permalink: /blog/2013/11/05/Sourcecode-Review-Criteria
---

<p>
  <a href="http://translate.google.com/translate?sl=de&amp;tl=en&amp;js=n&amp;prev=_t&amp;hl=de&amp;ie=UTF-8&amp;u=http%3A%2F%2Fwww.software-architects.com%2Fdevblog%2F2013%2F11%2F05%2FSourcecode-Review-Criteria" target="_blank">Auto-translate this article in English using Google Translate.</a>
</p><p>Ich werde regelmäßig von Kunden engagiert, um Reviews für Softwareentwicklungsprojekte speziell in Verbindung mit Microsoft-Technologie durchzuführen. Im Lauf der Jahre habe ich meine persönliche Checkliste erarbeitet. In diesem Blogartikel möchte ich eine Zusammenfassung der Checkliste zeigen. Die Detailfragestellungen in der Checkliste sind nur einige Beispiele. Jedes Kundenprojekt ist anders - man muss sie auf jeden Fall je nach Situation anpassen und erweitern. Fehlt etwas? Kommentare? Ich freue mich über Feedback im Kommentarbereich unten.</p><p>Hinweis: Kundenspezifisch angepasste Versionen dieser Review-Checkliste verwende ich für reine Code Reviews. Für Architektur-Reviews habe ich andere Checklisten.</p><ol>
  <li>
    <strong>Sourcecode-Review</strong>
    <ol type="a">
      <li>Automatische Qualitätsprüfung

<ol type="i"><li>Kompiliert der Sourcecode fehlerfrei?</li><li>Kompiliert der Sourcecode ohne Compiler-Warnungen?</li><li>Gibt es auffällige Warnungen von <a href="http://msdn.microsoft.com/en-us/library/3z0aeatx.aspx" target="_blank">Visual Studio Code Analysis</a> (Analyse IL-Code)?</li><li>Gibt es auffällige Warnungen von Quellcodeanalysetools (z.B. <a href="https://stylecop.codeplex.com/" target="_blank">StyleCop</a>, <a href="http://www.jslint.com/" target="_blank">JSLint</a>, <a href="http://www.jshint.com/" target="_blank">JSHint</a>, etc.)?</li></ol></li>
      <li>Manuelle Qualitätsprüfung

<ol type="i"><li>Werden die von Microsoft ausgegebenen Richtlinien für Framework Design eingehalten (siehe z.B. <a href="http://www.amazon.de/gp/product/0321545613/ref=as_li_ss_tl?ie=UTF8&amp;camp=1638&amp;creative=19454&amp;creativeASIN=0321545613&amp;linkCode=as2&amp;tag=timecockpit-21" target="_blank">Framework Design Guidelines</a>)? Beispielkriterien:

<ol><li>Sinnvolle Namensvergabe</li><li>Exception Handling</li><li>Memory Management (z.B. IDisposable)</li><li>Einhaltung von best Practices in Sachen Klassendesign</li><li>Etc.</li></ol></li><li>Ist der Code sinnvoll dokumentiert (C# Codedokumentation, Dokumentation in längeren Methode, etc.)?

<ol><li>Wird API Dokumentation aus der Codedokumentation generiert (z.B. Sandcastle)?</li></ol></li><li>Auf welchem Stand ist der geschriebene C# Code? Beispiele:

<ol><li>Werden C# 3 Strukturen wie Lambdas und Linq verwendet wo sinnvoll?</li><li>Werden C# 4 bzw. 5 Funktionen wie TPL, async/await verwendet wo sinnvoll?</li><li>Welche Version von ASP.NET MVC wird eingesetzt?</li><li>Welche Version von .NET wird verwendet?</li><li>Werden aktuelle Versionen der eingesetzten Drittanbieterkomponenten verwendet?</li><li>Werden aktuelle Kommunikationsstandards genutzt (z.B. REST vs. SOAP, Tokenformate, etc.)?</li></ol></li><li>Ist die Gliederung der Projekte und Solutions in Ordnung?

<ol><li>Ist das Projekt nachvollziehbar in Projekte gegliedert?</li><li>Gibt es offensichtliche Schwächen in Sachen Abhängigkeitsmanagement (z.B. klare Trennung der Anwendungsschichten in Projekte mit entsprechenden Projektreferenzen)?</li><li>Wird NuGet für gemeinsame Bibliotheken verwendet?</li></ol></li><li>Folgt die Anwendung den von Microsoft definierten Best Practices für Cluster-Systeme (u.A. auch in <a href="http://www.windowsazure.com/en-us/" target="_blank">Windows Azure</a>)? Beispiele:

<ol><li>Umgang mit Web Sessions</li><li>Retry-Logik bei Zugriff auf DB-Cluster</li></ol></li></ol></li>
      <li>Prüfung der Vollständigkeit

<ol type="i"><li>Gibt es Unit Tests?

<ol><li>Verteilung Unit Tests vs. Integrationstests?</li><li>Laufen die Unit Tests erfolgreich durch?</li><li>Welche Code Coverage wird erreicht?</li><li>Enthalten die Unit Tests sinnvolle Prüfungen (Asserts)?</li><li>Ist die Laufzeit der automatisierten Tests akzeptabel?</li><li>Ist der geschriebene Code testbar (z.B. Möglichkeiten für Mocking, klare Trennung von UI und Logik durch MV* Patterns, etc.)?</li><li>Sind die Unit Tests dokumentiert?</li></ol></li><li>Sind die Projekte zur Erstellung der Azure-Pakete enthalten?</li><li>Gibt es einen automatisierten Build?

<ol><li>Funktioniert der automatisierte Build?</li><li>Sind die Unit Tests integriert?</li><li>Ist die Erstellung der API-Dokumentation integriert?</li><li>Werden die Azure-Pakete automatisch erstellt?</li><li>Ist ein automatisiertes Azure-Deployment im Build bzw. mit Scripts (z.B. PowerShell) vorgesehen?</li><li>Gibt es ausreichende Vorkehrungen für Versionsmanagement (z.B. Versionsnummernvergabe, Labeling, etc.)?</li></ol></li><li>Gibt es eine ausreichende Dokumentation der Architektur (über reine Codedokumentation hinaus)?</li></ol></li>
      <li>Gibt es offensichtliche Schwächen in Sachen Sicherheit? Beispiele:

<ol type="i"><li>Anfälligkeit für SQL Injections?</li><li>Ist die eingesetzte Absicherung (Authentifizierung, Authorisierung) der Webseiten und Webservices passend?</li><li>Verwenden Webseiten und Webservices SSL?</li><li>Ist die Verarbeitung sicherheitskritischer Daten (z.B. Tokens in Web APIs) in Ordnung?</li><li>Erfolgt die Speicherung kritischer Daten verschlüsselt? Beispiele:

<ol><li>Zugangsdaten zu Datenbanken in Konfigurationsdateien</li><li>Kritische Felder in Datenbanktabellen (z.B. Payment-relevante Daten, personenbezogene Daten)</li></ol></li><li>Wie erfolgt die Verwaltung von Verschlüsselungsschlüssel, Zertifikaten, etc.?</li><li>Sind die Assemblies signiert und/oder strong named?</li></ol></li>
    </ol>
  </li>
  <li>
    <strong>DB-Review</strong>
    <ol type="a">
      <li>Erscheint die DB-Struktur robust?

<ol type="i"><li>Namensgebung</li><li>Vergabe von Schlüsseln (Primary Keys, Foreign Keys)</li><li>Etc.</li></ol></li>
      <li>Ist das DB-Design konsistent?</li>
      <li>Gibt es Indizes (über die von Primary Keys hinaus)?</li>
      <li>Gibt es Business Logik in der DB (z.B. Trigger, Stored Procedures, Functions, etc.)? Wenn ja, werden ähnliche Review-Kriterien darauf angewandt, wie oben bei "Sourcecode Review" erwähnt.</li>
      <li>Ist die Authentifizierung der Anwendungen gegenüber der DB passend?</li>
    </ol>
  </li>
  <li>
    <strong>Analyse des Laufzeitverhaltens</strong>
    <ol type="a">
      <li>Performanceanalyse mit .NET Profiler (z.B. <a href="http://www.red-gate.com/products/dotnet-development/ants-performance-profiler/" target="_blank">ANTS Profiler</a>, <a href="http://www.microsoft.com/en-us/download/details.aspx?id=28567" target="_blank">PerfView</a>, etc.)

<ol type="i"><li>Gibt es offensichtliche Performancekiller (Methoden, Algorithmen, Module)?</li><li>Welchen Einfluss hat der Garbage Collector?</li><li>Wie ist die Performance unter Last (aufwendiger Test; möglicherweise erst in einem zweiten Schritt zu machen)?</li></ol></li>
      <li>Memoryanalyse mit .NET Memory Profiler (z.B. ANTS Memory Profiler, etc.)

<ol type="i"><li>Gibt es offensichtliche Memory Leaks?</li><li>Wie speicherintensiv ist die Anwendung?</li></ol></li>
      <li>Analyse des DB-Verhaltens

<ol type="i"><li>Gibt es einzelne, offensichtlich langsame DB-Abfragen?</li><li>Gibt es idente DB-Abfragen, die extrem häufig ausgeführt werden?</li><li>Hat das Kommunikationsverhalten der Anwendung mit der DB offensichtliche Schwächen (z.B. Performanceverlust durch Lazy Loading eines OR-Mappers)?</li></ol></li>
    </ol>
  </li>
  <li>
    <strong>Sonstiges, das im Rahmen des Reviews gemacht werden könnte/sollte</strong>
    <ol type="a">
      <li>Erfolgt regelmäßig ein Check-in des Sourcecodes in Team Foundation Server oder ein anderes Quellcodeverwaltungssystem?</li>
      <li>Analyse der Umgebungen für Dev, Test, Prod</li>
    </ol>
  </li>
</ol>