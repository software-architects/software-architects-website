---
layout: blog
title: BASTA 2013 -  Android Development with Xamarin, C#, and Azure Mobile Services
excerpt: The Xamarin and Mono tools enable C# developers to use their existing knowledge and experience to write apps for Android and iOS. At the BASTA 2013 conference I did a session about that topic. During the session I showed a sample that used SQLite on the phone and Windows Azure Mobile Service as its backend in the cloud. In this blog article I publish my slides as well as the sample code.
author: Rainer Stropek
date: 2013-09-24
bannerimage: 
bannerimagesource: 
lang: en
tags: [.NET,Android,Azure,Visual Studio]
ref: 
permalink: /devblog/2013/09/24/BASTA-2013-Android-Development-with-Xamarin-C-and-Azure-Mobile-Services
---

<p>The Xamarin and Mono tools enable C# developers to use their existing knowledge and experience to write apps for Android and iOS. At the BASTA 2013 conference I did a session about that topic. During the session I showed a sample that used SQLite on the phone and <a href="http://www.windowsazure.com/en-us/develop/mobile/" target="_blank">Windows Azure Mobile Services</a> as its backend in the cloud. In this blog article I publish my slides as well as the sample code.</p><h2>Photos of the Session</h2>

<div class="row tc-image-gallery">
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 1.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 1.jpg" /></a></div>
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 2.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 2.jpg" /></a></div>
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 3.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 3.jpg" /></a></div>
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 4.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 4.jpg" /></a></div>
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 5.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 5.jpg" /></a></div>
    <div class="col-xs-6 col-sm-4 col-md-4"><a data-lightbox="gab" href="/content/images/blog/2013/09/Basta2013Xamarin/BASTA 2013 Xamarin klein 6.jpg"><img src="/content/images/blog/2013/09/BASTA2013Xamarin/BASTA 2013 Xamarin klein 6.jpg" /></a></div>
</div>

<h2>Slides</h2><iframe src="http://www.slideshare.net/slideshow/embed_code/26489078?rel=0" width="512" height="421" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen"></iframe><div style="margin-bottom:5px" data-mce-style="margin-bottom: 5px;">
  <strong>
    <a href="https://de.slideshare.net/rstropek/basta-2013-xamarin-26489078" title="Developing Android and iOS Apps With C#, .NET, Xamarin, Mono, and Windows Azure" target="_blank">Developing Android and iOS Apps With C#, .NET, Xamarin, Mono, and Windows Azure</a>
  </strong> from <strong><a href="http://www.slideshare.net/rstropek" target="_blank">Rainer Stropek</a></strong></div><p>If you prefer PDF, you can <a href="{{site.baseurl}}/content/images/blog/2013/09/BASTA 2013 - Xamarin.pdf" target="_blank">download the slide deck here</a>.</p><h2>Sourcecode</h2><p>The slidedeck contains a step-by-step description of how to build the sample. However, it does not include the complete sourcecode as I did not write it manually during the session. People who are interested in playing with the sample can <a href="{{site.baseurl}}/content/images/blog/2013/09/BeeBook.MobileAssets.zip" target="_blank">download the source code files</a> here. If you don't want to download the entire sample you can also take a look at the most important pieces of code below. BTW - the sample is about managing honey bee hives. The reason why I have chosen this example is because honey bees are my hobby. If you want to know more you can check out my <a href="http://bienenimgarten.wordpress.com" target="_blank">private blog</a> (German).</p><h3>Platform-Independent Data Access Layer</h3><p>In my example I wanted to demonstrate the cross-platform usage of ADO.NET (with its <em>Task</em>-based async API) for building a simple data access layer. I wanted my bee hive management app to be offline-enabled. Therefore it uses this layer to access a SQLite database on the phone. However, it could be used e.g. on the server as a data access layer for an web app or web API, too.</p>
  {% highlight c# %}using System;
using System.Collections.Generic;
using System.ComponentModel.Composition.Hosting;
using System.Data;
using System.Data.Common;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace BeeBook.Mobile
{
    public abstract class BeeBookDatabase : IDisposable
    {
        private bool disposed = false;

        ~BeeBookDatabase()
        {
            this.Dispose(false);
            GC.SuppressFinalize(this);
        }

        protected DbConnection Connection { get; set; }

        private static BeeBookDatabase current;
        public static BeeBookDatabase Current 
        {
            get
            {
                if (current == null)
                {
                    // Lazy create and open global database
                    BeeBookDatabase.current = GlobalContainer.Container.GetExportedValue<BeeBookDatabase>();
                    BeeBookDatabase.current.CreateOrOpenDatabaseAsync();
                }

                return BeeBookDatabase.current;
            }
        }

        public abstract string DatabaseFileLocation { get; }

        public abstract Task CreateOrOpenDatabaseAsync();

        protected abstract string GenerateSqlHiveTableCreate();
        protected abstract IReadOnlyList<string> GenerateSqlDemoDataInserts();
        protected virtual string GenerateSqlNumberOfHives()
        {
            return "SELECT COUNT(*) FROM Hive;";
        }
        protected virtual string GenerateSqlGetAllHives()
        {
            return "SELECT * FROM Hive;";
        }
        protected virtual string GenerateSqlGetHiveById(int hiveId)
        {
            return string.Format("SELECT * FROM Hive WHERE Id = {0};", hiveId);
        }

        public async Task CreateOrUpdateSchema()
        {
            using (var command = this.Connection.CreateCommand())
            {
                command.CommandText = this.GenerateSqlHiveTableCreate();
                command.CommandType = CommandType.Text;
                await command.ExecuteNonQueryAsync();
            }
        }

        public async Task GenerateDemodata()
        {
            using (var command = this.Connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = this.GenerateSqlNumberOfHives();
                var numberOfHives = (long)await command.ExecuteScalarAsync();
                if (numberOfHives == 0)
                {
                    foreach (var stmt in this.GenerateSqlDemoDataInserts())
                    {
                        command.CommandText = stmt;
                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
        }

        public async Task<IReadOnlyList<Hive>> GetAllHives()
        {
            var result = new List<Hive>();
            using (var command = this.Connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = this.GenerateSqlGetAllHives();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    var idOrdinal = reader.GetOrdinal("Id");
                    var hiveNameOrdinal = reader.GetOrdinal("hiveName");
                    var latOrdinal  = reader.GetOrdinal("lat");
                    var longOrdinal = reader.GetOrdinal("long");
                    while (await reader.ReadAsync())
                    {
                        result.Add(new Hive()
                        {
                            Id = (int)reader.GetInt64(idOrdinal),
                            HiveName = reader.GetString(hiveNameOrdinal),
                            Lat = reader.GetDouble(latOrdinal),
                            Long = reader.GetDouble(longOrdinal)
                        });
                    }
                }
            }

            return result;
        }
        public async Task<Hive> GetHiveById(int hiveId)
        {
            Hive result = null;
            using (var command = this.Connection.CreateCommand())
            {
                command.CommandType = CommandType.Text;
                command.CommandText = this.GenerateSqlGetHiveById(hiveId);
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        var idOrdinal = reader.GetOrdinal("Id");
                        var hiveNameOrdinal = reader.GetOrdinal("hiveName");
                        var latOrdinal = reader.GetOrdinal("lat");
                        var longOrdinal = reader.GetOrdinal("long");
                        result = new Hive()
                        {
                            Id = reader.GetInt32(idOrdinal),
                            HiveName = reader.GetString(hiveNameOrdinal),
                            Lat = reader.GetDouble(latOrdinal),
                            Long = reader.GetDouble(longOrdinal)
                        };
                    }
                }
            }

            return result;
        }

        public void CloseDatabase()
        {
            this.CheckDisposed();

            if (this.Connection != null)
            {
                this.Connection.Close();
                this.Connection.Dispose();
                this.Connection = null;
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }

        public void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.CloseDatabase();
            }

            this.disposed = true;
        }

        protected void CheckDisposed()
        {
            if (this.disposed)
            {
                throw new ObjectDisposedException(this.ToString());
            }
        }
    }
}{% endhighlight %}<p>And this is the sample implementation (derived from the class above) for SQLite on the Android phone.</p>{% highlight c# %}using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Mono.Data.Sqlite;
using System.ComponentModel.Composition;
using System.Collections.Generic;

namespace BeeBook.Mobile
{
    [Export(typeof(BeeBookDatabase))]
    [PartCreationPolicy(CreationPolicy.Shared)]
    public class BeeBookDatabaseMobile : BeeBookDatabase
    {
        public override string DatabaseFileLocation
        {
            get
            {
                this.CheckDisposed();
                return Path.Combine(
                    System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal),
                    "hives.db3");
            }
        }

        public override async Task CreateOrOpenDatabaseAsync()
        {
            this.CheckDisposed();

            // If database is already open, close it
            if (this.Connection != null)
            {
                this.CloseDatabase();
            }

            // Create database file if it does not exist
            var dbFileName = this.DatabaseFileLocation;
            if (!File.Exists(dbFileName))
            {
                SqliteConnection.CreateFile(dbFileName);
            }

            // Create connection and open it async
            this.Connection = new SqliteConnection(string.Format("Data Source={0}", this.DatabaseFileLocation));
            await this.Connection.OpenAsync();
        }

        protected override string GenerateSqlHiveTableCreate()
        {
            return "CREATE TABLE IF NOT EXISTS Hive ( Id INTEGER CONSTRAINT PK_Hive PRIMARY KEY ASC AUTOINCREMENT, hiveName TEXT, lat REAL, long REAL );";
        }

        protected override IReadOnlyList<string> GenerateSqlDemoDataInserts()
        {
            return new[] {
                "INSERT INTO Hive ( hiveName, lat, long ) values ( 'Nähe Rapsfeld', 48.279381, 14.239203 )",
                "INSERT INTO Hive ( hiveName, lat, long ) values ( 'Kürnbergerwald', 48.285819, 14.2355 )"
            };
        }

        protected override string GenerateSqlNumberOfHives()
        {
            return "SELECT COUNT(*) FROM Hive;";
        }
        protected override string GenerateSqlGetAllHives()
        {
            return "SELECT * FROM Hive;";
        }
        protected override string GenerateSqlGetHiveById(int hiveId)
        {
            return string.Format("SELECT * FROM Hive WHERE Id = {0};", hiveId);
        }

    }
}{% endhighlight %}<h3>Adapter (Data Source for <em>ListView</em>)</h3><p>The Data Access Layer is used by an adapter which acts as the data source for the main activity:</p>{% highlight c# %}using Android.Content;
using Android.Views;
using Android.Widget;
using BeeHive.Mobile;
using System.Collections.Generic;

namespace BeeBook.Mobile
{
    public class HiveAdapter : BaseAdapter<Hive>
    {
        private IReadOnlyList<Hive> items = new List<Hive>();
        private readonly LayoutInflater inflater;

        public HiveAdapter(Context context)
        {
            this.inflater = (LayoutInflater)context.GetSystemService(Context.LayoutInflaterService);
            this.RefreshAsync();
        }

        public override bool HasStableIds { get { return true; } }
        public override int Count { get { return this.items.Count; } }
        public override Hive this[int position] { get { return this.items[position]; } }
        public override long GetItemId(int position) { return this.items[position].Id; }

        public override View GetView(int position, View convertView, ViewGroup parent)
        {
            var item = this.items[position];

            var view = this.inflater.Inflate(Resource.Layout.HiveItem, null);
            var itemTextView = view.FindViewById<TextView>(Resource.Id.ItemText);
            itemTextView.Text = item.HiveName;

            itemTextView.Click += (o, e) =>
            {
                var hiveDetailsActivity = new Intent(this.inflater.Context, typeof(HiveDetails));
                hiveDetailsActivity.PutExtra("Id", item.Id);
                this.inflater.Context.StartActivity(hiveDetailsActivity);
            };

            return view;
        }

        public async void RefreshAsync()
        {
            this.items = await BeeBookDatabase.Current.GetAllHives();
            this.NotifyDataSetChanged();
        }
    }
}{% endhighlight %}<h3>Main Activity</h3><p>The main activity simply displays a list of bee hives. The data is read from the adapter shown above. Note that the main activity uses an action bar menu item to display a <em>Sync</em> option. If the user clicks on this menu item, the data from the phone's SQLite database is transferred into the cloud using Windows Azure Mobile Services.</p>
{% highlight c# %}using Android.App;
using Android.OS;
using Android.Views;
using BeeBook.Mobile;
using Microsoft.WindowsAzure.MobileServices;
using System.Linq;
using System.Threading.Tasks;

namespace BeeHive.Mobile
{
    [Activity(Label = "BeeHive.Mobile", MainLauncher = true)]
    public class MainActivity : ListActivity
    {
        private static readonly MobileServiceClient MobileService =
            new MobileServiceClient("https://myaccount.azure-mobile.net/", "mykey");

        protected override async void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            // Activate the action bar
            this.RequestWindowFeature(WindowFeatures.ActionBar);

            var db = BeeBookDatabase.Current;
            await db.CreateOrUpdateSchema();
            await db.GenerateDemodata();

            this.ListAdapter = new HiveAdapter(this);
        }

        public override bool OnCreateOptionsMenu(Android.Views.IMenu menu)
        {
            var inflater = this.MenuInflater;
            inflater.Inflate(Resource.Menu.MainMenu, menu);
            return true;
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            if (item.ItemId == Resource.Id.menu_sync)
            {
                Task.Run(async () =>
                    {
                        var hivesInLocalDb = await BeeBookDatabase.Current.GetAllHives();

                        var table = MainActivity.MobileService.GetTable<Hive>();
                        var hivesInRemoteDb = await table.ToListAsync();

                        foreach (var missingHive in hivesInLocalDb.Where(h => hivesInRemoteDb.Count(hRemote => hRemote.HiveName == h.HiveName) == 0).ToArray())
                        {
                            missingHive.Id = 0;
                            await table.InsertAsync(missingHive);
                        }
                    });

                return true;
            }
            else
            {
                return base.OnOptionsItemSelected(item);
            }
        }
    }
}{% endhighlight %}<h3>Hive Details With Google Maps Activation</h3>
{% highlight c# %}using Android.App;
using Android.OS;
using Android.Views;
using BeeBook.Mobile;
using Microsoft.WindowsAzure.MobileServices;
using System.Linq;
using System.Threading.Tasks;

namespace BeeHive.Mobile
{
    [Activity(Label = "BeeHive.Mobile", MainLauncher = true)]
    public class MainActivity : ListActivity
    {
        private static readonly MobileServiceClient MobileService =
            new MobileServiceClient("https://youraccount.azure-mobile.net/", "yourkey");

        protected override async void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            // Activate the action bar
            this.RequestWindowFeature(WindowFeatures.ActionBar);

            var db = BeeBookDatabase.Current;
            await db.CreateOrUpdateSchema();
            await db.GenerateDemodata();

            this.ListAdapter = new HiveAdapter(this);
        }

        public override bool OnCreateOptionsMenu(Android.Views.IMenu menu)
        {
            var inflater = this.MenuInflater;
            inflater.Inflate(Resource.Menu.MainMenu, menu);
            return true;
        }

        public override bool OnOptionsItemSelected(IMenuItem item)
        {
            if (item.ItemId == Resource.Id.menu_sync)
            {
                Task.Run(async () =>
                    {
                        var hivesInLocalDb = await BeeBookDatabase.Current.GetAllHives();

                        var table = MainActivity.MobileService.GetTable<Hive>();
                        var hivesInRemoteDb = await table.ToListAsync();

                        foreach (var missingHive in hivesInLocalDb.Where(h => hivesInRemoteDb.Count(hRemote => hRemote.HiveName == h.HiveName) == 0).ToArray())
                        {
                            missingHive.Id = 0;
                            await table.InsertAsync(missingHive);
                        }
                    });

                return true;
            }
            else
            {
                return base.OnOptionsItemSelected(item);
            }
        }
    }
}{% endhighlight %}

<p>If a user clicks on a bee hive row in the main activity's <em>ListView</em>, the hive's details are displayed. The detail form contains a butten which should show the location of the bee hive in Google maps. Here is the code for the hive detail activity:</p>{% highlight c# %}using Android.App;
using Android.Content;
using Android.OS;
using Android.Widget;
using BeeHive.Mobile;

namespace BeeBook.Mobile
{
    [Activity(Label = "Hive Details")]
    public class HiveDetails : Activity
    {
        protected override async void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);
            this.SetContentView(Resource.Layout.HiveDetails);

            var hiveId = this.Intent.GetIntExtra("Id", -1);
            if (hiveId != (-1))
            {
                var hive = await BeeBookDatabase.Current.GetHiveById(hiveId);
                if (hive != null)
                {
                    this.FindViewById<EditText>(Resource.Id.HiveNameText).Text = hive.HiveName;
                    this.FindViewById<EditText>(Resource.Id.LongitudeText).Text = hive.Long.ToString();
                    this.FindViewById<EditText>(Resource.Id.LatitudeText).Text = hive.Lat.ToString();
    
                    this.FindViewById<Button>(Resource.Id.DisplayLocation).Click += (s, e) =>
                        {
                            var uriString = string.Format("https://maps.google.com/maps?q=loc:{0}+{1}", hive.Lat, hive.Long);
                            var uri = Android.Net.Uri.Parse(uriString);
                            var intent = new Intent(Intent.ActionView, uri);
                            this.StartActivity(intent);
                        };
                }
            }
        }
    }
}{% endhighlight %}