---
layout: blog
title: SQL Champ - Quiz
excerpt: We invite you to prove your knowledge about certain subjects concerning Microsoft .NET technology by participating in a monthly quiz. This month the quiz is about SQL Server. In this article you can reread the questions. Additionally you get background information about the correct answers.
author: Rainer Stropek
date: 2009-10-13
bannerimage: 
bannerimagesource:
lang: en
tags: [SQL]
ref: 
permalink: /devblog/2009/10/13/SQL-Champ---Quiz
redirect_from:
- /TechnicalArticles/Quiz/tabid/82/language/en-US/Default.aspx/index.html
---

<div id="dnn_ctr424_ContentPane" class="ContentPane DNNAlignleft">
  <div id="dnn_ctr424_ModuleContent" class="DNN_HTMLContent">
    <div id="dnn_ctr424_HtmlModule_lblContent" class="Normal">
      <p>We invite you to prove your knowledge about certain subjects concerning Microsoft .NET technology by participating in a monthly quiz. This month the quiz is about SQL Server. In this article you can reread the questions. Additionally you get background information about the correct answers.</p>
      <p>Here is a list of all questions included in the quiz. Use the hyperlinks to jump to the topic you are interested in:</p>
      <ul>
        <li>Question 1 - A Simple One To Start</li>
        <li>Question 2 - Data Type</li>
        <li>Question 3 - Date and Time Handling</li>
        <li>Question 4 - Aggregation</li>
        <li>Question 5 - SQLCLR</li>
        <li>Question 6 - Database Snapshots</li>
        <li>Question 7 - TOP Clause</li>
      </ul>
      <h2 class="Head">
        <a id="Q1" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q1"></a>Question 1 - A Simple One To Start</h2>
      <p class="Abstract">
        <strong>You want to access a SQL Server instance that is not in your domain. The only network protocol you can use is TCP/IP. Which ports do you need to open on the firewall that is between your computer and the server running SQL Server?</strong>
      </p>
      <p>1. SQL Server uses a random port.<br /> 2. 1433<br /> 3. 1433 and 1434<br /> 4. It depends; the port can be chosen by an administrator</p>
      <p class="DecoratorRight">
        <img alt="Port settings in SQL Server Configuration Manager" src="{{site.baseurl}}/content/images/blog/2009/10/sqlQuizQuestion1.png" />
        <em>Port settings in SQL Server Configuration Manager</em>
        <br />
      </p>
      <p>The correct answer is <em>It depends; the port can be chosen by an administrator</em>. 1433 is the default port for the default instance of SQL Server (has been assigned by IANA - Internet Assigned Numbers Authority; see <a target="_blank" href="http://www.iana.org/assignments/port-numbers">http://www.iana.org/assignments/port-numbers</a>). Before version 2000 one port was sufficient because on a single server you could only run a single instance of SQL Server. However, since version 2000 there can be multiple instances and therefore an administrator can choose which port is used by which instance.</p>
      <p>The port 1434 (UDP) is used by the SQL Server Browser service. Clients can use this service to query connection information (TCP/IP port or named pipe) about all running SQL Server instances. If you know which port the instance you want to connect to is using you do not need SQL Server Browser at all. Therefore you do not need a connection to port 1434 in this case.</p>
      <h2 class="Head">
        <a id="Q2" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q2"></a>Question 2 - Data Type</h2>
      <p class="Abstract">
        <strong>You want to track date and time of the last write access (INSERT, UPDATE) per row. How can you achieve that?</strong>
      </p>
      <p>1. Add a TIMESTAMP column to the table; SQL Server will automatically track date and time of every change.<br /> 2. Add a DATETIME column to the table and assign <span class="InlineCode">getdate()</span> as the default value.<br /> 3. Add a DATETIME column to the table and write a trigger that sets its value.<br /> 4. Add a UNIQUEIDENTIFIER column to the table and use it with SQL Server's built functions.</p>
      <p class="DecoratorRight">If you just want to record date and time of the last change to identify those rows that have changed since a certain point in time (e.g. for delta load of a DWH) and you are able to use SQL 2008 check out <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/bb933994(SQL.100).aspx">change tracking and data capture</a>. They provide a mechanism for that without having to change the table structure at all.</p>
      <p dir="ltr">The correct answer is <em>Add a DATETIME column to the table and write a trigger that sets its value</em>. TIMESTAMP does not help in this case because it does not record any date or time values. It just offers a way to generate unique binary numbers that are changed whenever the content of a row changes. The following script shows how to use TIMESTAMP:</p>
      
    {% highlight sql %}use tempdb;  

create table ChangeTrackingTest (  
  MyId int primary key,  
  MyDesc varchar(50),  
  MyTimestamp timestamp  
);  

insert into ChangeTrackingTest ( MyId, MyDesc )  
values ( 1, 'Test' );  

select * from ChangeTrackingTest;  

update ChangeTrackingTest  
set MyDesc = 'Test 2'  
where MyId = 1;  

select * from ChangeTrackingTest;{% endhighlight %}

      <p dir="ltr">This is the result of this batch. Note how the value of the TIMESTAMP column changes:</p>

     {% highlight text %}(1 row(s) affected)  
MyId MyDesc MyTimestamp  
--------------------------- 
1 Test 0x00000000000007D4  

(1 row(s) affected)  

(1 row(s) affected)  

MyId MyDesc MyTimestamp  
--------------------------- 
1 Test 2 0x00000000000007D5  

(1 row(s) affected){% endhighlight %}

      <p dir="ltr">The second answer is wrong because this solution would only record date and time when each row was created. The column's content would not change in case of an UPDATE statement. The fourth answer is also wrong simply because there are no such built in functions.</p>
      <h2 class="Head">
        <a id="Q3" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q3"></a>Question 3 - Date and Time Handling</h2>
      <p class="Abstract">
        <strong>What is the result of the following statement:</strong>
        <br />
        <strong>
          <span class="InlineCode">select cast(floor(cast(@MyDateTime as float)) as datetime)</span>
        </strong>
      </p>
      <p dir="ltr">1. Next Sunday relative to <span class="InlineCode">@MyDateTime</span>.<br /> 2. Only date part of <span class="InlineCode">@MyDateTime</span>.<br /> 3. Only time part of <span class="InlineCode">@MyDateTime</span>.<br /> 4. Doesn't work because you cannot cast <span class="InlineCode">float </span> to <span class="InlineCode">datetime</span>.</p>
      <p dir="ltr">The second answer <em>Only date part of <span class="InlineCode">@MyDateTime</span></em> is correct. If you cast a <span class="InlineCode">datetime</span> value to float you get a floating point value representing the number of days since 1<sup>st</sup> January 1900:</p>
      
     {% highlight text %}select cast(cast('1900-01-01 00:00:00' as datetime) as float) 

----------------------  
0  

(1 row(s) affected){% endhighlight %}

      <p dir="ltr">The fractional digits represent the time:</p>
      
{% highlight text %}select cast(cast('1900-01-01 12:00:00' as datetime) as float) 

----------------------  
0,5  

(1 row(s) affected){% endhighlight %}

      <p class="DecoratorRight">In contrast to SQL Server 2005 the version 2008 offers separate data types for date and time. Read more about these new data types in <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/ms180878(SQL.100).aspx">MSDN</a>.</p>
      <p dir="ltr">The statement shown above converts the <span class="InlineCode">datetime</span> variable to <span class="InlineCode">float</span>, removes the fractional digits using <span class="InlineCode">floor</span> and converts the result back to <span class="InlineCode">datetime</span>. Therefore it removes the time part of the <span class="InlineCode">datetime</span> variable.</p>
      <h2 class="Head">
        <a id="Q4" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q4"></a>Question 4 - Aggregation</h2>
      <p class="DecoratorRight">You can try this statement with Microsoft's sample database <em>AdventureWorksDW</em>.</p>
      <p class="Abstract">
        <strong>Does the following statement work in SQL 2005?</strong>
        <br />
        <br />
       
        {% highlight sql %}select CustomerKey,  
       ProductKey,  
       sum(SalesAmount) as SumSalesAmount,  
       sum(SalesAmount) /  
         sum(sum(SalesAmount)) over ( partition by CustomerKey )  
         * 100 as SumSumSalesAmount  
from   dbo.FactInternetSales  
group by CustomerKey,  
       ProductKey  
order by CustomerKey,  
       ProductKey{% endhighlight %}

      </p>
      <p dir="ltr">1. Yes<br /> 2. No, syntax error<br /> 3. No, but SQL 2008 supports this syntax</p>
      <p dir="ltr">This statement works in SQL 2005! You maybe know the keyword <span class="InlineCode">over</span> from <a target="_blank" href="http://web.archive.org/web/20091213061209/http://msdn2.microsoft.com/en-us/library/ms189798.aspx">ranking functions</a>. However, it is not quite commonly known that you can use <span class="InlineCode">over</span> with traditional aggregation functions, too. Our sample shown above generates a sales statistics including the customer, the product and the revenue that each customer has generated with each product. The fourth column calculates the ratio of each product's revenue to the customer's total revenue.</p>
      <h2 class="Head">
        <a id="Q5" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q5"></a>Question 5 - SQLCLR</h2>
      <p class="Abstract">
        <strong>Which classes from the .NET Framework can be used in SQLCLR assemblies with permission set SAFE?</strong>
      </p>
      <p dir="ltr">1. All of them. Permission set SAFE just restricts the use of unmanaged code.<br /> 2. None. To use classes from the .NET Framework in SQL Server you need at least permission set EXTERNAL.<br /> 3. Some of them are tested specifically for the use within SQL Server, they can be used.<br /> 4. Permission sets have nothing to do with SQLCLR. </p>
      <p class="DecoratorRight">A list of assemblies that are loaded from GAC by SQL Server is available on <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/ms403279.aspx">MSDN</a>.</p>
      <p dir="ltr">The correct answer is <em>Some of them are tested specifically for the use within SQL Server, they can be used</em>. There is a hardcoded list of assemblies that SQL Server loads from the file system. These assemblies have undergone an extensive code review to ensure they don't destablize SQL Server.</p>
      <p dir="ltr">However, some assemblies contain both supported and unsupported functions (e.g. mscorlib). For those cases Microsoft introduced the <span class="InlineCode">HostProtectionAttribute</span> attribute. Types and members that are not allowed in SQL Server are decorated with this attribute. You can get a list of disallowed types and members in <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/ms172338.aspx">MSDN</a>.</p>
      <h2 class="Head">
        <a id="Q6" class="FCK__AnchorC FCK__AnchorC FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q6"></a>Question 6 - Database Snapshots</h2>
      <p class="DecoratorRight">
        <img alt="Copy On Write" src="{{site.baseurl}}/content/images/blog/2009/10/CopyOnWrite.gif" class="   " />
        <em>Copy-on-write (Source: <a target="_blank" href="http://msdn2.microsoft.com/en-us/library/ms187054.aspx">MSDN</a>)</em>
        <br />
      </p>
      <p class="Abstract">
        <strong>How long does it approximately take to create a snapshot of a 100GB database on a state-of-the-art Quadcore server using RAID 5?</strong>
      </p>
      <p dir="ltr">1. A few seconds.<br /> 2. Approximately 5 minutes.<br /> 3. Usually approximately one hour; depends on the load on the server.<br /> 4. More than one hour but it is running in the background.</p>
      <p dir="ltr">The correct anser is <em>A few seconds</em>. Database snapshots use sparse files (read more about sparse files in <a target="_blank" href="http://en.wikipedia.org/wiki/Sparse_file">Wikipedia</a>). That means that the database is not copied when the snapshot is created. Data pages are copied immediately before they are modified in the source database. This mechanism is called <em>copy-on-write</em>. Therefore creating a database snapshot is very fast. You have to pay the performance price when you write to the source database.</p>
      <h2 class="Head">
        <a id="Q7" class="FCK__AnchorC FCK__AnchorC mceItemAnchor" name="Q7"></a>Question 7 - TOP Clause</h2>
      <p class="Abstract">
        <strong>In which statements can you use the TOP clause in SQL Server 2005?</strong>
      </p>
      <p dir="ltr">1. SELECT<br /> 2. SELECT, INSERT (if used with INSERT...SELECT syntax)<br /> 3. SELECT, INSERT, UPDATE, DELETE<br /> 4. None. TOP is new in SQL Server 2008</p>
      <p class="DecoratorRight">Parentheses that delimit expression in TOP is required in INSERT, UPDATE, and DELETE statements. For backward compatibility, TOP expression without parentheses in SELECT statements is supported, but Microsoft does not recommend this.</p>
      <p dir="ltr">The correct answer is <em>SELECT, INSERT, UPDATE, DELETE</em>. In SQL Server 2000 TOP was only supported in SELECT statements. Since SQL Server 2005 you can use TOP also with INSERT, UPDATE and DELETE. Here is an example for the use of TOP in a DELETE statement:</p>
      {% highlight sql %}use tempdb;  

create table Orders ( OrderId int, CustId int, Revenue money );  

insert into Orders ( OrderId, CustId, Revenue )  
select 1, 1, 5000 union all  
select 2, 1, 1000 union all  
select 3, 2, 500 union all  
select 4, 2, 100 union all  
select 5, 3, 50 union all  
select 6, 3, 10;  

while exists ( select 1 from Orders where CustId = 1 )  
  delete top(1) from Orders where CustId = 1;  

select * from Orders;{% endhighlight %}
      <p dir="ltr">You may ask yourself why someone would write such a strange script to delete all orders of a certain customer. Imagine the table <span class="InlineCode">Orders</span> containing a very large amount of rows. If you would delete all orders of customer 1 in a single <span class="InlineCode">delete</span> statement this would lead to a very large transaction. It could be hard to handle it (e.g. disk space for transaction log could be critical, stopping the transaction could take a long time, etc.). With <span class="InlineCode">delete top(n)</span> you can split the large transaction into multiple smaller ones.</p>
    </div>
  </div>
</div>