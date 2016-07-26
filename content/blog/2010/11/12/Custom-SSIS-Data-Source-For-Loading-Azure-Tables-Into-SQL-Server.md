---
layout: blog
title: Custom SSIS Data Source For Loading Azure Tables Into SQL Server
teaser: Yesterday the wether in Frankfurt was horrible and so my plane from Berlin was late. I missed my connection flight to Linz and had to stay in a hotel in Frankfurt. Therefore I had some time and I used it for implementing a little sample showing how you can use a customer SSIS data source to easily transfer data from Windows Azure Table Storage to SQL Server databases using the ETL tool "SQL Server Integration Services" (SSIS).
author: Rainer Stropek
date: 2010-11-12
bannerimage: 
lang: en
tags: [Azure]
permalink: /blog/2010/11/12/Custom-SSIS-Data-Source-For-Loading-Azure-Tables-Into-SQL-Server
---

<p>Yesterday the wether in Frankfurt was horrible and so my plane from Berlin was late. I missed my connection flight to Linz and had to stay in a hotel in Frankfurt. Therefore I had some time and I used it for implementing a little sample showing how you can use a customer SSIS data source to easily transfer data from Windows Azure Table Storage to SQL Server databases using the ETL tool "SQL Server Integration Services" (SSIS).</p><p>Here is the <a href="{{site.baseurl}}/content/images/blog/2010/11/TableStorageSsisSource.zip" target="_blank">source code for download</a>.</p><p>
  <strong>
    <em>Please remember</em>
  </strong>:</p><ol>
  <li>This is just a sample.</li>
  <li>The code has not been tested.</li>
  <li>If you want to use this stuff you have to compile and deploy it. Check out the post-build actions in the project to see which DLLs you have to copy to which folders in order to make them run.</li>
</ol><p>Let's start by demonstrating how the resulting component works inside SSIS. For this I have created this very short video:</p><embed width="480" height="385" src="https://www.youtube.com/v/xTgpCZBwUlA?fs=1&amp;hl=de_DE" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" /><p>Now let's take a look at the source code.</p><h2>Reading an Azure Table without a fixed class</h2><p>The first problem that has to be solved is to read data from an Azure table without knowing it's schema at compile time. There is an <a href="http://social.msdn.microsoft.com/Forums/en-US/windowsazure/thread/481afa1b-03a9-42d9-ae79-9d5dc33b9297/" target="_blank">excellent post</a> covering that in the Azure Community pages. I took the sourcecode shown there and extended/modified it a little bit so that it fits to what I needed.</p><p>First class is just a helper representing a column in the table store (Column.cs):</p>{% highlight javascript %}using System;
using Microsoft.SqlServer.Dts.Runtime.Wrapper;

namespace TableStorageSsisSource
{
 public class Column
 {
  public Column(string columnName, string typeName, string valueAsString)
  {
   this.ColumnName = columnName;
   this.ClrType = Column.GetType(typeName);
   this.DtsType = Column.GetSsisType(typeName);
   this.Value = Column.GetValue(this.DtsType, valueAsString);
  }

  public string ColumnName { get; private set; }
  public Type ClrType { get; private set; }
  public DataType DtsType { get; private set; }
  public object Value { get; private set; }

  private static Type GetType(string type)
  {
   switch (type)
   {
    case "Edm.String": return typeof(string);
    case "Edm.Int32": return typeof(int);
    case "Edm.Int64": return typeof(long);
    case "Edm.Double": return typeof(double);
    case "Edm.Boolean": return typeof(bool);
    case "Edm.DateTime": return typeof(DateTime);
    case "Edm.Binary": return typeof(byte[]);
    case "Edm.Guid": return typeof(Guid);
    default: throw new NotSupportedException(string.Format("Unsupported data type {0}", type));
   }
  }

  private static DataType GetSsisType(string type)
  {
   switch (type)
   {
    case "Edm.String": return DataType.DT_NTEXT;
    case "Edm.Binary": return DataType.DT_IMAGE;
    case "Edm.Int32": return DataType.DT_I4;
    case "Edm.Int64": return DataType.DT_I8;
    case "Edm.Boolean": return DataType.DT_BOOL;
    case "Edm.DateTime": return DataType.DT_DATE;
    case "Edm.Guid": return DataType.DT_GUID;
    case "Edm.Double": return DataType.DT_R8;
    default: throw new NotSupportedException(string.Format("Unsupported data type {0}", type));
   }
  }

  private static object GetValue(DataType dtsType, string valueAsString)
  {
   switch (dtsType)
   {
    case DataType.DT_NTEXT: return valueAsString;
    case DataType.DT_IMAGE: return Convert.FromBase64String(valueAsString);
    case DataType.DT_BOOL: return bool.Parse(valueAsString);
    case DataType.DT_DATE: return DateTime.Parse(valueAsString);
    case DataType.DT_GUID: return new Guid(valueAsString);
    case DataType.DT_I2: return Int32.Parse(valueAsString);
    case DataType.DT_I4: return Int64.Parse(valueAsString);
    case DataType.DT_R8: return double.Parse(valueAsString);
    default: throw new NotSupportedException(string.Format("Unsupported data type {0}", dtsType));
   }
  }
 }
}{% endhighlight %}<p>Second class represents a row inside the table store (without strong schema; GenericEntity.cs):</p>{% highlight javascript %}using System.Collections.Generic;
using Microsoft.WindowsAzure.StorageClient;

namespace TableStorageSsisSource
{
    public class GenericEntity : TableServiceEntity
    {
        private Dictionary<string, Column> properties = new Dictionary<string, Column>();

        public Column this[string key]
        {
            get
            {
                if (this.properties.ContainsKey(key))
                {
                    return this.properties[key];
                }
                else
                {
                    return null;
                }
            }

            set
            {
                this.properties[key] = value;
            }
        }

        public IEnumerable<Column> GetProperties()
        {
            return this.properties.Values;
        }

        public void SetProperties(IEnumerable<Column> properties)
        {
            foreach (var property in properties)
            {
                this[property.ColumnName] = property;
            }
        }
    }   
}{% endhighlight %}<p>Last but not least we need a context class that interprets the AtomPub format and builds the generic content objects (GenericTableContent.cs):</p>{% highlight javascript %}using System;
using System.Data.Services.Client;
using System.Linq;
using System.Xml.Linq;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;

namespace TableStorageSsisSource
{
 public class GenericTableContext : TableServiceContext
 {
  public GenericTableContext(string baseAddress, StorageCredentials credentials)
   : base(baseAddress, credentials)
  {
   this.IgnoreMissingProperties = true;
   this.ReadingEntity += new EventHandler<ReadingWritingEntityEventArgs>(GenericTableContext_ReadingEntity);
  }

  public GenericEntity GetFirstOrDefault(string tableName)
  {
   return this.CreateQuery<GenericEntity>(tableName).FirstOrDefault();
  }

  private static readonly XNamespace AtomNamespace = "http://www.w3.org/2005/Atom";
  private static readonly XNamespace AstoriaDataNamespace = "http://schemas.microsoft.com/ado/2007/08/dataservices";
  private static readonly XNamespace AstoriaMetadataNamespace = "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata";

  private void GenericTableContext_ReadingEntity(object sender, ReadingWritingEntityEventArgs e)
  {
   var entity = e.Entity as GenericEntity;
   if (entity != null)
   {
    e.Data
     .Element(AtomNamespace + "content")
     .Element(AstoriaMetadataNamespace + "properties")
     .Elements()
     .Select(p =>
      new
      {
       Name = p.Name.LocalName,
       IsNull = string.Equals("true", p.Attribute(AstoriaMetadataNamespace + "null") == null ? null : p.Attribute(AstoriaMetadataNamespace + "null").Value, StringComparison.OrdinalIgnoreCase),
       TypeName = p.Attribute(AstoriaMetadataNamespace + "type") == null ? null : p.Attribute(AstoriaMetadataNamespace + "type").Value,
       p.Value
      })
     .Select(dp => new Column(dp.Name, dp.TypeName, dp.Value.ToString()))
     .ToList()
     .ForEach(column => entity[column.ColumnName] = column);
   }
  }
 }
}{% endhighlight %}<h2>The Custom SSIS Data Source</h2><p>The custom SSIS data source is quite simple (TableStorageSsisSource.cs):</p>{% highlight javascript %}using System.Collections.Generic;
using Microsoft.SqlServer.Dts.Pipeline;
using Microsoft.SqlServer.Dts.Pipeline.Wrapper;
using Microsoft.WindowsAzure;

namespace TableStorageSsisSource
{
 [DtsPipelineComponent(DisplayName = "Azure Table Storage Source", ComponentType = ComponentType.SourceAdapter)]
 public class TableStorageSsisSource : PipelineComponent
 {
  public override void ProvideComponentProperties()
  {
   // Reset the component.
   base.RemoveAllInputsOutputsAndCustomProperties();
   ComponentMetaData.RuntimeConnectionCollection.RemoveAll();

   // Add output
   IDTSOutput100 output = ComponentMetaData.OutputCollection.New();
   output.Name = "Output";

   // Properties
   var storageConnectionStringProperty = this.ComponentMetaData.CustomPropertyCollection.New();
   storageConnectionStringProperty.Name = "StorageConnectionString";
   storageConnectionStringProperty.Description = "Azure storage connection string";
   storageConnectionStringProperty.Value = "UseDevelopmentStorage=true";

   var tableNameProperty = this.ComponentMetaData.CustomPropertyCollection.New();
   tableNameProperty.Name = "TableName";
   tableNameProperty.Description = "Name of the source table";
   tableNameProperty.Value = string.Empty;
  }

  public override IDTSCustomProperty100 SetComponentProperty(string propertyName, object propertyValue)
  {
   var resultingColumn = base.SetComponentProperty(propertyName, propertyValue);

   var storageConnectionString = (string)this.ComponentMetaData.CustomPropertyCollection["StorageConnectionString"].Value;
   var tableName = (string)this.ComponentMetaData.CustomPropertyCollection["TableName"].Value;

   if (!string.IsNullOrEmpty(storageConnectionString) && !string.IsNullOrEmpty(tableName))
   {
    var cloudStorageAccount = CloudStorageAccount.Parse(storageConnectionString);
    var context = new GenericTableContext(cloudStorageAccount.TableEndpoint.AbsoluteUri, cloudStorageAccount.Credentials);
    var firstRow = context.GetFirstOrDefault(tableName);
    if (firstRow != null)
    {
     var output = this.ComponentMetaData.OutputCollection[0];
     foreach (var column in firstRow.GetProperties())
     {
      var newOutputCol = output.OutputColumnCollection.New();
      newOutputCol.Name = column.ColumnName;
      newOutputCol.SetDataTypeProperties(column.DtsType, 0, 0, 0, 0);
     }
    }
   }

   return resultingColumn;
  }

  private List<ColumnInfo> columnInformation;
  private GenericTableContext context;
  private struct ColumnInfo
  {
   public int BufferColumnIndex;
   public string ColumnName;
  }

  public override void PreExecute()
  {
   this.columnInformation = new List<ColumnInfo>();
   IDTSOutput100 output = ComponentMetaData.OutputCollection[0];

   var cloudStorageAccount = CloudStorageAccount.Parse((string)this.ComponentMetaData.CustomPropertyCollection["StorageConnectionString"].Value);
   context = new GenericTableContext(cloudStorageAccount.TableEndpoint.AbsoluteUri, cloudStorageAccount.Credentials);

   foreach (IDTSOutputColumn100 col in output.OutputColumnCollection)
   {
    ColumnInfo ci = new ColumnInfo();
    ci.BufferColumnIndex = BufferManager.FindColumnByLineageID(output.Buffer, col.LineageID);
    ci.ColumnName = col.Name;
    columnInformation.Add(ci);
   }
  }

  public override void PrimeOutput(int outputs, int[] outputIDs, PipelineBuffer[] buffers)
  {
   IDTSOutput100 output = ComponentMetaData.OutputCollection[0];
   PipelineBuffer buffer = buffers[0];

   foreach (var item in this.context.CreateQuery<GenericEntity>((string)this.ComponentMetaData.CustomPropertyCollection["TableName"].Value))
   {
    buffer.AddRow();

    for (int x = 0; x < columnInformation.Count; x++)
    {
     var ci = (ColumnInfo)columnInformation[x];
     var value = item[ci.ColumnName].Value;
     if (value != null)
     {
      buffer[ci.BufferColumnIndex] = value;
     }
     else
     {
      buffer.SetNull(ci.BufferColumnIndex);
     }
    }
   }

   buffer.SetEndOfRowset();
  }
 }
}{% endhighlight %}