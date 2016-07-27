def importJIRATasks(actionContext):
	from TimeCockpit.Data import EntityObject, DataContextType
	dc = actionContext.DataContext

	if dc.DataContextType != DataContextType.Server:
		raise ArgumentException("Action can only be executed on a server data context.")

	clr.AddReference("TimeCockpit.Common")
	from System.Collections.Generic import List
	from System.Globalization import CultureInfo
	from TimeCockpit.Common import Logger, LogLevel
	from System import DateTime, String, Array, Convert
	from System.Text import Encoding

	clr.AddReference("System.Core")
	import System
	clr.ImportExtensions(System.Linq)

	# JIRA API
	class Issue(object):
		def __init__(self, key=None, type=None, summary=None, link=None, status=None, updated=None, timeOriginalEstimate=None, subTaskKeys=None):
			self.Key = key
			self.Type = type
			self.Summary = summary
			self.Link = link
			self.Status = status
			self.Updated = updated
			self.TimeOriginalEstimate = timeOriginalEstimate
			self.SubTaskKeys = subTaskKeys

	class Jira(object):
		def __init__(self, repository, username, password):
			from System import Uri
			self.repository = Uri(repository)
			self.username = username
			self.password = password
			self.requestedFields = [ "summary", "issuetype", "status", "updated", "timeoriginalestimate", "subtasks" ]

		def search(self, jql):
			clr.AddReference("System.Web")
			from System.Web import HttpUtility
			from System.Net import HttpWebRequest
			from System.IO import StreamReader
			clr.AddReference("Newtonsoft.Json")
			from Newtonsoft.Json import JsonTextReader
			from Newtonsoft.Json.Linq import JObject
			from System import Decimal
			import Newtonsoft.Json
			clr.ImportExtensions(Newtonsoft.Json.Linq)
			usernamepw = Convert.ToBase64String(Encoding.UTF8.GetBytes(String.Format("{0}:{1}", self.username, self.password)))

			fieldsparam = String.Join(",", self.requestedFields)
			requestUri = String.Format("{0}rest/api/2/search?jql={1}&fields={2}", self.repository.AbsoluteUri, HttpUtility.UrlEncode(jql), fieldsparam)
			Logger.Write(LogLevel.Verbose, "Jira.Search: {0}", requestUri)

			request = HttpWebRequest.Create(requestUri)
			request.ContentType = "application/json"

			request.Headers.Add("Authorization", "Basic " + usernamepw)

			request.Method = "GET"
			with request.GetResponse() as response:
				with StreamReader(response.GetResponseStream()) as sr:
					with JsonTextReader(sr) as jr:
						result = JObject.Load(jr)
						issues = result["issues"]

						items = list()
						for issue in issues:
							item = Issue()
							item.Key = Newtonsoft.Json.Linq.Extensions.Value[String](issue["key"])
							fields = issue["fields"]
							item.Updated = Newtonsoft.Json.Linq.Extensions.Value[DateTime](fields["updated"])

							# transform seconds to hours
							estimate = Newtonsoft.Json.Linq.Extensions.Value[System.Object](fields["timeoriginalestimate"])

							if estimate is not None:
								estimate = Newtonsoft.Json.Linq.Extensions.Value[Decimal](fields["timeoriginalestimate"])
								estimate = estimate / (60.0 * 60.0)

							item.TimeOriginalEstimate = estimate
							status = fields["status"]
							item.Status = Newtonsoft.Json.Linq.Extensions.Value[String](status["name"])
							item.Summary = Newtonsoft.Json.Linq.Extensions.Value[String](fields["summary"])
							type = fields["issuetype"]
							item.Type = Newtonsoft.Json.Linq.Extensions.Value[String](type["name"])
							item.Link = self.repository.ToString() + "browse/" + item.Key

							subTasks = fields["subtasks"]
							item.SubTaskKeys = System.Linq.Enumerable.Cast[JObject](subTasks).Select(lambda t: Newtonsoft.Json.Linq.Extensions.Value[String](t["key"])).ToArray[String]()
							items.Add(item)

						return items;
	
	commit = True
	timeDelta = 0.01

	jira = Jira("https://....atlassian.net/", "...", "...")
	jiraProjects = dc.Select("From P In Project Where :IsNullOrEmpty(P.JiraProject) = False Select P")

	for jiraProject in jiraProjects:
		dc.BeginTransaction()
		try:
			jiraName = jiraProject.JiraProject
			Logger.Write(LogLevel.Information, "JiraImport: Handling project '{0}'", jiraName)
			projectUuid = jiraProject.ProjectUuid

			lastUpdated = dc.SelectSingleWithParams({ "Query": "From T In Task Where T.Project = @ProjectUuid Select New With { .LastUpdated = Max(T.JiraUpdated) }", "@ProjectUuid": projectUuid }).LastUpdated
			if lastUpdated is None:
				lastUpdated = DateTime(1970, 1, 1)
			
			jqlAdditionalCondition = String.Format(" and updated >= '{0}' order by updated asc", lastUpdated.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture))
			jql = String.Format("project='{0}'{1}", jiraName, jqlAdditionalCondition)
			issues = jira.search(jql).ToDictionary(lambda i: i.Key)

			if issues.Any():
				query = String.Format("From T In Task.Include(*) Where T.Project = @ProjectUuid And T.Code In ({0}) Select T", String.Join(", ", issues.Select(lambda i: String.Format('"{0}"', i.Key)).ToArray()))
				tasks = dc.SelectWithParams({ "Query": query, "@ProjectUuid": projectUuid }).GroupBy(lambda t: t.Code).ToDictionary(lambda g: g.Key, lambda g: g.Single())
	
				newIssues = issues.Keys.Except(tasks.Keys).ToArray()
				updatedIssues = issues.Keys.Except(newIssues).ToArray()
			
				Logger.Write(LogLevel.Information, "JiraImport: {0} new issues, {1} updated issues for query {2}", newIssues.Length, updatedIssues.Length, jql)
			
				for key in newIssues:
					issue = issues[key]
					task = dc.CreateTask()
					task.APP_BudgetInHours = issue.TimeOriginalEstimate
					task.APP_Code = issue.Key
					task.APP_Project = jiraProject
					task.USR_JiraLink = issue.Link
					task.USR_JiraStatus = issue.Status
					task.USR_JiraType = issue.Type
					task.USR_JiraUpdated = issue.Updated
					task.APP_Description = issue.Summary
					Logger.Write(LogLevel.Information, "JiraImport: Adding task {0}", key)
					dc.SaveObject(task)

				for key in updatedIssues:
					changed = False
					task = tasks[key]
					issue = issues[key]

					if task.APP_BudgetInHours <> issue.TimeOriginalEstimate:
						if (task.APP_BudgetInHours is None and issue.TimeOriginalEstimate is not None) or (task.APP_BudgetInHours is not None and issue.TimeOriginalEstimate is None) or (abs(task.APP_BudgetInHours - issue.TimeOriginalEstimate) > timeDelta):
							Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "TimeOriginalEstimate")
							task.APP_BudgetInHours = issue.TimeOriginalEstimate
							changed = True
					if task.USR_JiraLink <> issue.Link:
						Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "Link")
						task.USR_JiraLink = issue.Link
						changed = True
					if task.USR_JiraStatus <> issue.Status:
						Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "Status")
						task.USR_JiraStatus = issue.Status
						changed = True
					if task.USR_JiraType <> issue.Type:
						Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "Type")
						task.USR_JiraType = issue.Type
						changed = True
					if task.USR_JiraUpdated <> issue.Updated:
						Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "Updated")
						task.USR_JiraUpdated = issue.Updated
						changed = True
					if task.APP_Description <> issue.Summary:
						Logger.Write(LogLevel.Verbose, "JiraImport: Changed property for task {0}: {1}", key, "Summary")
						task.APP_Description = issue.Summary
						changed = True

					if changed:
						Logger.Write(LogLevel.Information, "JiraImport: Updating task {0}", key)
						dc.SaveObject(task)
					else:
						Logger.Write(LogLevel.Information, "JiraImport: Skipping unchanged task {0}", key)

			if commit:
				dc.TryCommitTransaction()
			else:
				dc.TryRollbackTransaction()
		except System.Exception, e:
			dc.TryRollbackTransaction()
			Logger.Write(LogLevel.Warning, "JiraImport: Exception while handling {0}: {1}\r\n{2}", jiraProject.JiraProject, e.Message, e.StackTrace)
