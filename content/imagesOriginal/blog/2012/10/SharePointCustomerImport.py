clr.AddReference('System.Core')
clr.AddReference('System.Xml.Linq')
from System.Net import WebRequest, CredentialCache
from System.Xml.Linq import XDocument, XNamespace
from System.Collections.Generic import List, Dictionary
import System
clr.ImportExtensions(System.Linq)
dc = Context

# configuration
customerUrl = 'http://sps2010/ImportDemo/_vti_bin/listdata.svc/Customer'
credentials = CredentialCache.DefaultCredentials
# /configuration

nsD = clr.Convert('http://schemas.microsoft.com/ado/2007/08/dataservices', XNamespace)
nsM = clr.Convert('http://schemas.microsoft.com/ado/2007/08/dataservices/metadata', XNamespace)

# get XDocument from sharepoint
def getDocument(listUrl, credentials):
	request = WebRequest.Create(listUrl)
	request.Method = "GET"
	request.Credentials = credentials
	with request.GetResponse() as response:
		with response.GetResponseStream() as stream:
			return XDocument.Load(stream)

# extract named value from xml node
def getValue(startNode, name, valueConverter, valueNodeFallback):
	try:
		node = startNode.Descendants(nsD + name).SingleOrDefault()
		
		# fallback for choice strings
		if node is None:
			if valueNodeFallback:
				node = startNode.Descendants(nsD + (name + "Value")).Single()
			else:
				raise Exception(String.Format("Could not find node {0}", name))
			
		nullAttribute = node.Attribute(nsM + "null")
		if nullAttribute is not None and Convert.ToBoolean(nullAttribute.Value):
			return None
		else:
			return valueConverter(node.Value)
	except Exception, e:
		raise Exception(String.Format("Could not get value for {0}.", name), e)

# extract named string value from xml node
def getString(startNode, name, trim):
	value = getValue(startNode, name, Convert.ToString, True)
	if trim and not String.IsNullOrEmpty(value):
		return value.Trim()
	else:
		return value

# create Customer EntityObject from xml sub-tree
def getCustomer(node, dc, countries):
	code = getString(node, "Title", True)
	name = getString(node, "Name", True)
	countryCode = getString(node, "Country", True)
	customer = dc.CreateCustomer()
	customer.Code = code
	customer.CompanyName = name
	if not String.IsNullOrEmpty(countryCode):
		customer.Country = countries[countryCode]
	return customer

# get all customers from xml document
def getCustomers(doc, dc, countries):
	customers = doc.Descendants(nsM + "properties").Select(lambda n: getCustomer(n, dc, countries))
	return customers.ToDictionary(lambda c: c.Code, lambda c: c)

# determine new/updated customers (no deletion once imported)
def getUpdateBatch(existingCustomers, sharepointCustomers):
	result = List[EntityObject]()

	for key in sharepointCustomers.Keys.Except(existingCustomers.Keys):
		result.Add(sharepointCustomers[key])
	
	for key in existingCustomers.Keys.Intersect(sharepointCustomers.Keys):
		customer = sharepointCustomers[key]
		existing = existingCustomers[key]
	
		if customer.CompanyName != existing.CompanyName or customer.Country != existing.Country:
			existing.CompanyName = customer.CompanyName
			existing.Country = customer.Country
			result.Add(existing)

	return result

# get existing data from time cockpit
existingCustomers = dc.Select("From C In Customer.Include(*) Select C").ToDictionary(lambda c: c.Code, lambda c: c)
existingCountries = dc.Select("From C In Country Select C").ToDictionary(lambda c: c.IsoCode, lambda c: c)

# get customers from sharepoint
sharepointCustomersDoc = getDocument(customerUrl, credentials)
sharepointCustomers = getCustomers(sharepointCustomersDoc, dc, existingCountries)

# save changes
dc.BeginTransaction()
try:
	for customer in getUpdateBatch(existingCustomers, sharepointCustomers):
		Logger.Write(LogLevel.Verbose, "Saving {0}", customer.Code)
		dc.SaveObject(customer)
	dc.TryCommitTransaction()
except:
	dc.TryRollbackTransaction()
	raise