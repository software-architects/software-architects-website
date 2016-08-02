def importTFSTasks(actionContext):
	from TimeCockpit.Data import EntityObject, DataContextType
	dc = actionContext.DataContext
	commit = True

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

	# Simple TFS API wrapper
	class TFS(object):
		def __init__(self, uri):
			from System import Uri
			self.uri = Uri(uri)
			self._connected = False
	
		def connect(self):
			import clr
			clr.AddReferenceToFileAndPath(r"C:\Program Files (x86)\Microsoft Visual Studio 11.0\Common7\IDE\ReferenceAssemblies\v2.0\Microsoft.TeamFoundation.dll")
			clr.AddReference("Microsoft.TeamFoundation.Client.dll")
			clr.AddReference("Microsoft.TeamFoundation.VersionControl.Client.dll")
			clr.AddReference("Microsoft.TeamFoundation.WorkItemTracking.Client.dll")
			from Microsoft.TeamFoundation.Client import WindowsCredential, TfsClientCredentials, TfsTeamProjectCollection
			tfsCreds = TfsClientCredentials(WindowsCredential(), True)
			self.server = TfsTeamProjectCollection(self.uri, tfsCreds)
			if self.server is None:
				raise InvalidOperationException("Could not get TFS server for " + self.uri + ".")

			self.server.EnsureAuthenticated();

			if not self.server.HasAuthenticated:
				raise InvalidOperationException("TFS could not authenticate.")
		
			self._connected = True
	
		def query_work_items(self, projectName, fromDate):
			from Microsoft.TeamFoundation.WorkItemTracking.Client import WorkItemStore
			from System.Collections.Generic import Dictionary

			if not self._connected:
				raise InvalidOperationException("TFS not connected.")
			
			workItemStore = self.server.GetService(clr.GetClrType(WorkItemStore))

			if workItemStore is None:
				raise InvalidOperationException("Could not get WorkItemStore.")

			parameters = Dictionary[String, String]()
			parameters.Add("Project", projectName)
			query = "Select [Id], [Title], [Changed Date] From WorkItems Where [System.TeamProject] = @Project"
			if fromDate is not None:
				query = query + " And [Changed Date] >= '" + fromDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) + "'"

			query = query + " Order By [Changed Date] Asc"

			return workItemStore.Query(query, parameters)

	# get all projects relevant to the TFS import
	tfsProjects = dc.Select("From P In Project Where :IsNullOrEmpty(P.TfsServer) = False And :IsNullOrEmpty(P.TfsProject) = False Select P")

	# get all the different TFS servers used in the projects
	projectsByServer = tfsProjects.GroupBy(lambda p: p.TfsServer)

	for serverProjects in projectsByServer:
		tfs = TFS(serverProjects.Key)
		tfs.connect()
		for project in serverProjects:
			dc.BeginTransaction()
			try:
				updatedItems = tfs.query_work_items(project.TfsProject, project.TfsLastUpdate)
				if updatedItems.Count == 0:
					Logger.Write(LogLevel.Verbose, "No updates for project '{0}'.", project.Code)
					continue

				lastUpdate = project.TfsLastUpdate;
				maxUpdate = project.TfsLastUpdate

				for item in updatedItems:
					id = str(item.Id)
					if lastUpdate is None or item.ChangedDate >= lastUpdate:

						# try to retrieve existing task from time cockpit
						task = dc.SelectSingleWithParams({ "Query": "From T In Task Where T.Project = @ProjectUuid And T.Code = @Code Select T", "@Code": id, "@ProjectUuid": project.ProjectUuid })
						if task is None:
							Logger.Write(LogLevel.Information, "Creating task '{0}' for project '{1}'.", id, project.Code)
							task = dc.CreateTask()
							task.Code = id
							task.Project = project

						if task.Description != item.Title:
							Logger.Write(LogLevel.Information, "Updating title of task '{0}' for project '{1}' from '{2}' to '{3}'.", id, project.Code, task.Description, item.Title)
							task.Description = item.Title
						
						dc.SaveObject(task)

					if maxUpdate is None or item.ChangedDate > maxUpdate:
						maxUpdate = item.ChangedDate

				# update the latest known update timestamp for the project
				if project.TfsLastUpdate != maxUpdate:
					Logger.Write(LogLevel.Information, "Updating project update date for '{0}' from '{1}' to '{2}'.", project.Code, project.TfsLastUpdate, maxUpdate)
					project.TfsLastUpdate = maxUpdate
					dc.SaveObject(project)
				if commit:
					dc.TryCommitTransaction()
				else:
					dc.TryRollbackTransaction()
			except Exception, e:
				dc.TryRollbackTransaction()
				Logger.Write(LogLevel.Error, "Error while handling '{0}': {1}", project.TfsProject, e.message)
