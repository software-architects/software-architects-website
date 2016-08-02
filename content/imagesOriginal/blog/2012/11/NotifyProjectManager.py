# coding=utf-8

clr.AddReference("System.Core")
import System
from System.Net.Mail import *;
from System.Net import NetworkCredential;
from System.Net.Mime import ContentType;
from System.Text import Encoding;
from System.Linq import Enumerable
from System import Func
clr.ImportExtensions(System.Linq)

def setupSmtpServer():
	smtpServer = SmtpClient();
	smtpServer.Credentials = NetworkCredential("karin#software-architects.at", "sw@rchi1");
	smtpServer.Host = "smtp.software-architects.at";
	smtpServer.Port = 25;
	return smtpServer

def getExceededProjects(thresholdInPercent):
	existingProjects = Context.Select("""From P In Project 
									 Where P.BudgetInHours <> Null 
									 Select New With 
									 { 
									 	P.Code, 
									 	P.Projectmanager,
									 	P.BudgetInHours, 
									 	.SumEffort = (From T In P.Timesheets Where T.NoBilling = False Select New With { .SumEffort = Sum(T.DurationInHours) }) 
									 }""")
	
	return existingProjects.Where(lambda v: (v.SumEffort >= v.BudgetInHours * thresholdInPercent)).ToDictionary(lambda c: c.Code, lambda c: c)
	
def getMailMessage(sender, receiver, subject, body):
	mail = MailMessage(MailAddress("alexander@timecockpit.com"), MailAddress(receiver));

	mail.Subject = subject;
	mimeType = ContentType("text/html");
	alternate = AlternateView.CreateAlternateViewFromString(body, mimeType);
	mail.AlternateViews.Add(alternate);
	return mail
	
try:
	server = setupSmtpServer()
	
	#get projects that got to 80% of the budget
	threshold = 0.5
	projects = getExceededProjects(threshold)
	for p in projects:
		mail = getMailMessage( \
					"manager@contoso.com", \
					p.Value.Projectmanager.Username,  \
					String.Format("{0} reached {1}%", p.Key, threshold * 100),  \
					String.Format("Project <b>{0}</b> reached <b>{1} %</b> of the planned effort. <br/>The budget in hours was {2}. <br/>The actual effort is {3} hours!", p.Key, threshold * 100, p.Value.BudgetInHours, p.Value.SumEffort))
		server.Send(mail);
		
	print "done"
except Exception, e:
	raise
