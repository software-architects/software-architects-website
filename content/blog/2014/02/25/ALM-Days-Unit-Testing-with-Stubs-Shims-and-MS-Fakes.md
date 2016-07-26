---
layout: blog
title: ALM Days -  Unit Testing with Stubs, Shims, and MS Fakes
teaser: At ALM Days my second talk is about unit testing with Microsoft Fakes, Stubs, and Shims. Here is the sample that I am going to use.
author: Rainer Stropek
date: 2014-02-25
bannerimage: 
lang: en
tags: [C#,Visual Studio]
permalink: /blog/2014/02/25/ALM-Days-Unit-Testing-with-Stubs-Shims-and-MS-Fakes
---

<p>At <a href="http://alm-days.de/" target="_blank">ALM Days</a> my second talk is about unit testing with <a href="http://msdn.microsoft.com/en-us/library/hh549175.aspx" target="_blank">Microsoft Fakes</a>, Stubs, and Shims. Here is the sample that I am going to use.</p><p class="showcase">A reference implementation of the sample can be found on <a href="https://github.com/rstropek/Samples/tree/master/SudokuBoard" target="_blank">GitHub</a>. During the session coding will be live. Therefore it is likely that the sample shown in the session is not 100% identical with the reference implementation on GitHub.</p><h2>Sample 1: Integration Tests</h2><p>My sample contains a class <a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/BoardStreamRepository.cs"><em>BoardStreamRepository</em></a>. It can handle any kind of stream and uses the interface <a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/IStreamManager.cs"><em>IStreamManager</em></a> to get it. The sample project contains two implementations of this interface: One for local files (<a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/FileStreamManager.cs"><em>FileStreamManager</em></a>) and one for Windows Azure Blob Storage (<a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/CloudBlobStreamManager.cs"><em>CloudBlobStreamManager</em></a>). You could write integration tests for both classes:</p>{% highlight c# %}namespace Samples.Sudoku.Test
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;

    /// <summary>
    /// Integration tests for reading/writing board data.
    /// </summary>
    [TestClass]
    public class BoardReaderWriterIntegrationTests
    {
        public TestContext TestContext { get; set; }

        [TestMethod]
        [TestCategory("Integration")]
        public async Task TestLoadBoardFromFile()
        {
            const string sampleBoardName = "SampleBoard";

            var directory = Path.Combine(this.TestContext.TestDir, "Boards");
            await Task.Run(() => Directory.CreateDirectory(directory));
            using (var stream = new FileStream(Path.Combine(directory, sampleBoardName), FileMode.CreateNew))
            {
                await stream.WriteAsync(BoardSampleData.sampleBoard, 0, BoardSampleData.sampleBoard.Length);
            }

            var board = await BoardReader.LoadFromFileAsync(sampleBoardName, directory);
            Assert.IsTrue(((byte[])board).SequenceEqual(BoardSampleData.sampleBoard));
        }
    }
}{% endhighlight %}{% highlight c# %}namespace Samples.Sudoku.Test
{
    using Microsoft.QualityTools.Testing.Fakes;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
    using Microsoft.WindowsAzure.Storage.Blob;
    using Microsoft.WindowsAzure.Storage.Blob.Fakes;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Fakes;
    using System.Globalization;
    using System.IO;
    using System.IO.Fakes;
    using System.Linq;
    using System.Net;
    using System.Net.Fakes;
    using System.Security.Cryptography;
    using System.Threading;
    using System.Threading.Tasks;

    /// <summary>
    /// Tests for stream manager classes
    /// </summary>
    [TestClass]
    public class StreamManagerTest
    {
        ...

        [TestMethod]
        [TestCategory("Integration")]
        public async Task AzureStorageIntegrationTest()
        {
            const string sampleBlobName = "Testblob";

            // Read configuration settings
            var storageName = ConfigurationManager.AppSettings["StorageName"];
            var storageKey = ConfigurationManager.AppSettings["StorageKey"];
            var containerName = ConfigurationManager.AppSettings["ContainerName"];

            // Create normed sample board in blob storage
            var container = GetContainerReference(storageName, storageKey, containerName);
            await container.CreateIfNotExistsAsync();
            var blob = container.GetBlockBlobReference(sampleBlobName);
            if (!await blob.ExistsAsync())
            {
                await blob.UploadFromByteArrayAsync(BoardSampleData.sampleBoard, 0, BoardSampleData.sampleBoard.Length);
            }

            // Execute test
            await AzureStorageIntegrationTestInternal(storageName, storageKey, containerName, sampleBlobName);
        }

        private CloudBlobContainer GetContainerReference(string storageName, string storageKey, string containerName)
        {
            var credentials = new StorageCredentials(storageName, storageKey);
            var account = new CloudStorageAccount(credentials, true);
            var blobClient = account.CreateCloudBlobClient();
            return blobClient.GetContainerReference(containerName);
        }

        private async Task AzureStorageIntegrationTestInternal(string storageName, string storageKey, string containerName, string boardName)
        {
            var repository = new BoardStreamRepository(
                new CloudBlobStreamManager(GetContainerReference(storageName, storageKey, containerName)));
            var board = await repository.LoadAsync(boardName);

            Assert.IsTrue(BoardSampleData.sampleBoard.SequenceEqual((byte[])board));
        }

        ...
    }
}{% endhighlight %}<h2>Sample 2: Using Stubs</h2><p>
  <em>
    <a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/BoardStreamRepository.cs" target="_blank">BoardStreamRepository</a> </em> and <a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/IStreamManager.cs" target="_blank"><em>IStreamManager</em></a> are a perfect example for using an auto-generated <a href="http://msdn.microsoft.com/en-us/library/hh549174.aspx" target="_blank">Stub</a> to unit-test <em><a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/BoardStreamRepository.cs">BoardStreamRepository</a></em> on its own. Note how I use stubs in <em>SetupBoardStreamRepository</em> in the following code snippet:</p>{% highlight c# %}namespace Samples.Sudoku.Test
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Samples.Sudoku.Fakes;
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Tests for <see cref="Samples.Sudoku.BoardStreamRepository"/>
    /// </summary>
    [TestClass]
    public class BoardStreamRepositoryTest
    {
        [TestMethod]
        [TestCategory("With fakes")]
        public async Task TestLoadBoard()
        {
            // A BoardStreamRepository needs an IStreamManager. Note that we use a
            // stub generated by Microsoft Fakes here.

            // Prepare
            var repository = BoardStreamRepositoryTest.SetupBoardStreamRepository(BoardSampleData.sampleBoard);

            // Execute
            var board = await repository.LoadAsync("DummyBoardName");

            // Assert
            Assert.IsTrue(BoardSampleData.sampleBoard.SequenceEqual((byte[])board));
        }

        [TestMethod]
        [TestCategory("With fakes")]
        public async Task TestLoadBoardFailures()
        {
            var repository = BoardStreamRepositoryTest.SetupBoardStreamRepository(new byte[] { 1, 2 });

            await AssertExtensions.ThrowsExceptionAsync<Exception>(
                async () => await repository.LoadAsync("DummyBoardName"));
        }

        [TestMethod]
        [TestCategory("With fakes")]
        public async Task TestSaveBoard()
        {
            var buffer = new byte[9 * 9];
            var repository = BoardStreamRepositoryTest.SetupBoardStreamRepository(buffer);

            await repository.SaveAsync("DummyBoardName", (Board)BoardSampleData.sampleBoard);

            Assert.IsTrue(BoardSampleData.sampleBoard.SequenceEqual(buffer));
        }

        private static BoardStreamRepository SetupBoardStreamRepository(byte[] buffer)
        {
            var stub = new StubIStreamManager();
            stub.OpenStreamAsyncStringAccessMode = (_, __) =>
                Task.FromResult(new MemoryStream(buffer) as Stream);
            return new BoardStreamRepository(stub);
        }
    }
}{% endhighlight %}<h2>Sample 3: Using Shims</h2><p>If you want to test <a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/FileStreamManager.cs"><em>FileStreamManager</em></a> and <em><a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/CloudBlobStreamManager.cs">CloudBlobStreamManager</a></em> but you do not want to build a complex testing environment with samples files on local storage and in Windows Azure Blob Storage, you can use <a href="http://msdn.microsoft.com/en-us/library/hh549176.aspx" target="_blank">Shims</a> to isolate your code. This also has the big advantage of keeping your unit test fast.<br /></p>{% highlight c# %}[TestMethod]
[TestCategory("With fakes")]
public async Task CloudBlobStreamManagerShimmedLoadTest()
{
    // Note that we use shims from Microsoft Fakes to simulate Windows Azure Blob Storage.
    using (ShimsContext.Create())
    {
        // Setup shims
        ShimCloudBlobContainer.AllInstances.GetBlockBlobReferenceString = (container, blobName) =>
            {
                Assert.AreEqual(dummyContainerUri, container.Uri.AbsoluteUri);
                Assert.AreEqual(dummyBoardName, blobName);
                return new CloudBlockBlob(new Uri(dummyContainerUri));
            };
        ShimCloudBlockBlob.AllInstances.OpenReadAsync = (blob) =>
            Task.FromResult(new MemoryStream(BoardSampleData.sampleBoard) as Stream);

        // Execute
        var repository = new BoardStreamRepository(new CloudBlobStreamManager(
            new CloudBlobContainer(new Uri(dummyContainerUri))));
        var result = await repository.LoadAsync(dummyBoardName);

        // Check result
        Assert.IsTrue(BoardSampleData.sampleBoard.SequenceEqual((byte[])result));
    }
}

[TestMethod]
[TestCategory("With fakes")]
public async Task FileStreamManagerShimmedLoadTest()
{
    using (ShimsContext.Create())
    {
        // Note how we use a shimmed constructor here.
        ShimFileStream.ConstructorStringFileMode = (@this, fileName, __) =>
            {
                Assert.IsTrue(fileName.EndsWith("\\AppData\\Roaming\\Boards\\" + dummyBoardName));
                new ShimFileStream(@this)
                    {
                        ReadAsyncByteArrayInt32Int32CancellationToken = (buffer, ___, ____, _____) =>
                        {
                            BoardSampleData.sampleBoard.CopyTo(buffer, 0);
                            return Task.FromResult(BoardSampleData.sampleBoard.Length);
                        }
                    };
            };

        var repository = new BoardStreamRepository(new FileStreamManager());
        var result = await repository.LoadAsync(dummyBoardName);

        Assert.IsTrue(BoardSampleData.sampleBoard.SequenceEqual((byte[])result));
    }
}{% endhighlight %}<h2>Sample 4: Advanced Shims</h2><p>You might want to test <em><a href="https://github.com/rstropek/Samples/blob/master/SudokuBoard/Samples.Sudoku/CloudBlobStreamManager.cs">CloudBlobStreamManager</a></em> together with the Windows Azure Storage SDK. However, you still might not want to build a test environment in Azure. The solution could be shimming .NET's <em>WebRequest</em> class. The Windows Azure Storage SDK uses it behind the scenes.</p>{% highlight c# %}[TestMethod]
[TestCategory("With fakes")]
public async Task CloudBlobShimmedWebRequestTest()
{
    // Setup blob to simulate
    var simulatedBlobs = new Dictionary<string, byte[]>();
    simulatedBlobs.Add(string.Format("/{0}/{1}", dummyContainerName, dummyBoardName), BoardSampleData.sampleBoard);

    await this.ExecuteWithShimmedWebRequestForBlockBlobsAsync(simulatedBlobs, async () =>
        {
            var storageKey = ConfigurationManager.AppSettings["StorageKey"];

            // Execute existing unit test, but this time with shims instead of real web requests
            await this.AzureStorageIntegrationTestInternal(dummyStorageName, storageKey, dummyContainerName, dummyBoardName);
        });
}

private async Task ExecuteWithShimmedWebRequestForBlockBlobsAsync(Dictionary<string, byte[]> simulatedBlobs, Func<Task> body)
{
    // Note how we create the shims context here
    using (ShimsContext.Create())
    {
        // Azure storage uses IAsyncResult-pattern in the background. Therefore we have to create shims
        // for Begin/EndGetResponse. BTW - you can check the code of Azure Storage Library at
        // https://github.com/WindowsAzure/azure-storage-net
        ShimHttpWebRequest.AllInstances.BeginGetResponseAsyncCallbackObject = (@this, callback, state) =>
        {
            // Check if the request matches on of the blobs that we should simulate
            byte[] requestedBlob;
            if (!simulatedBlobs.TryGetValue(@this.RequestUri.AbsolutePath, out requestedBlob))
            {
                Assert.Fail("Unexpected request for {0}", @this.RequestUri.AbsoluteUri);
            }

            // Setup IAsyncResult; note how we use a stub for that.
            var result = new StubIAsyncResult()
            {
                // Azure Storage Library relies on a wait handle. We give one back that is immediately set.
                AsyncWaitHandleGet = () => new ManualResetEvent(true),

                // We pass on the state 
                AsyncStateGet = () => state
            };

            // We immediately call the callback as we do not have to wait for a real web request to finish
            callback(result);
            return result;
        };

        ShimHttpWebRequest.AllInstances.EndGetResponseIAsyncResult = (@this, __) =>
        {
            // Check if the request matches on of the blobs that we should simulate
            byte[] requestedBlob;
            if (!simulatedBlobs.TryGetValue(@this.RequestUri.AbsolutePath, out requestedBlob))
            {
                Assert.Fail("Unexpected request for {0}", @this.RequestUri.AbsoluteUri);
            }

            // Setup response headers. Read Azure Storage HTTP docs for details
            // (see http://msdn.microsoft.com/en-us/library/windowsazure/dd179440.aspx)
            var headers = new WebHeaderCollection();
            headers.Add("Accept-Ranges", "bytes");
            headers.Add("ETag", "0xFFFFFFFFFFFFFFF");
            headers.Add("x-ms-request-id", Guid.NewGuid().ToString());
            headers.Add("x-ms-version", "2013-08-15");
            headers.Add("x-ms-lease-status", "unlocked");
            headers.Add("x-ms-lease-state", "available");
            headers.Add("x-ms-blob-type", "BlockBlob");
            headers.Add("Date", DateTime.Now.ToString("R", CultureInfo.InvariantCulture));

            // Calculate MD5 hash for our blob and add it to the response headers
            var md5Check = MD5.Create();
            md5Check.TransformBlock(requestedBlob, 0, requestedBlob.Length, null, 0);
            md5Check.TransformFinalBlock(new byte[0], 0, 0);
            var hashBytes = md5Check.Hash;
            var hashVal = Convert.ToBase64String(hashBytes);
            headers.Add("Content-MD5", hashVal);

            // As the headers are complete, we can now build the shimmed web response
            return new ShimHttpWebResponse()
            {
                GetResponseStream = () =>
                {
                    // Simulate downloaded bytes
                    return new MemoryStream(requestedBlob);
                },

                // Status code depends on x-ms-range request header
                // (see Azure Storage HTTP docs for details)
                StatusCodeGet = () => string.IsNullOrEmpty(@this.Headers["x-ms-range"]) ? HttpStatusCode.OK : HttpStatusCode.PartialContent,
                HeadersGet = () => headers,
                ContentLengthGet = () => requestedBlob.Length,
                ContentTypeGet = () => "application/octet-stream",
                LastModifiedGet = () => new DateTime(2014, 1, 1)
            };
        };

        await body();
    }
}{% endhighlight %}<div id="mcepastebin" contenteditable="true" data-mce-bogus="1" style="position: absolute; top: 20px; width: 10px; height: 633px; overflow: hidden; opacity: 0; left: -65535px;">%MCEPASTEBIN%</div>