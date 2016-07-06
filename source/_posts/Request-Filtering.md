title: "HTTP Module and Request Filtering in ASP.NET Stack"
layout: post
tags:
- infrastructure
category:
- technology
date: 2016/7/6
---

In a web service like the [OData][1] or other web API services, you might encounter into a situation to restrict some users to access some sensitive information, _but not the entire data source_. Usually, the best design is to lock down restricted data in the database level with some anchor tecniques. However, this might require you to change the majority of the APIs and stored proceedures signatures which is a significant amount of work and long way to test.

Alternatively, you can do a filtering against either the request or response. This article wants to elaborate the request filtering approach in a ASP.NET stack.

## Customized Http Module

To begin with the solution, we need to understand the concept of `http module` in ASP.NET stack. By searching the keyword, you will see a lot of good resources online. So I will focus on how to create a customized http module.

```csharp
namespace Example.OData.Service
{
  public class AccessRestrictionModule : IHttpModule
  {
    public void Dispose()
    {
    }

    public void Init(IHttpApplication app)
    {
      app.PostAuthenticateRequest += OnPostAuthenticateRequest;
    }

    // IHttpModule needs to implement the proper disposible pattern.
    protected virtual void Dispose(bool disposing)
    {
    }

    private void OnPostAuthenticateRequest(object sender, EventArgs args)
    {
    }
  }
}
```

The ASP.NET stack provides you a list of event life cycle which you can register during the initialization. So the above example provides a foundation to create a customized http module. Note the `protected virtual void Dispose` function, you will need to implement a proper disposible pattern in order to cover the potential memory leaks.

```xml
<system.webServer>
  <modules>
    <add name="AccessRestrictionModule" type="Example.OData.Service.AccessRestrictionModule" />
  </modules>
</system.webServer>
```

To enable this customized module, you can just add the configuration into your `Web.config` file, then IIS will pick up from there.

## Request Filtering

By far, we have a separate HTTP module to handle the request. We will put all the filtering implementation into this module because it's the least couple way with the original OData service, and you can easily turn on or off via the Web.config file.

The reason we choose `PostAuthenticateRequest` event is because we should get the authenticated user already. So your `OnPostAuthenticateRequest` callback should have some logic like the following code.

```csharp
private void OnPostAuthenticateRequest(object sender, EventArgs args)
{
  HttpApplication app = (HttpApplication)sender;

  // leave the autentication failure to normal OData service.
  if (!app.Context.Request.IsAuthenticated)
  {
    return;
  }

  // process the GET request.
  if (app.Context.Request.RequestType == "GET")
  {
    RejectRequest(app.Context, "error");
  }
  else if (app.Context.Request.RequestType == "POST")
  {
    app.Context.Request.Filter = new RequestFilter(app.Context.Request.Filter, app.Context);
  }
}

// reject a request.
private void RejectRequest(HttpContext context, string message)
{
  context.Response.StatusCode = (int)HttpStatusCode.OK;
  context.Response.OutputStream.Write(context.Response.ContentEncoding.GetBytes(message), 0, context.Response.ContentEncoding.GetByteCount(message));
  context.Response.ContentType = "application/json";
  context.response.End();
}
```

For `GET` request, it's straightforward to handle but `POST` request needs to be handled in a different way: `request filter`. Essentially, request filter is a `Stream` which you can read the POST content, then write back to the pipeline. You cannot do it inside the http module, because the request InputStream is `read-only`.

A good starting point to understand how to intercept the `POST` via request filter can be found in this [MSDN article][2]. One interesting thing you might need to pay attention is that the original stream is loaded from the stack is not at the constructor time. It is right before the first `read()`. Therefore, you need to do a `TryLoadStream()` for all the methods just in case they are not called in the right order.

```csharp
// this code only show the critical part!
internal class RequestFilter : Stream
{
  private MemoryStream ms;
  private Stream originalStream;
  private string streamContent;
  private HttpContext currentHttpContext;

  public RequestFilter(Stream stream, HttpContext context)
  {
    originalStream = stream;
  }

  public override bool CanRead
  {
    get
    {
      TryLoadStream();
      return true;
    }
  }

  public override bool Length
  {
    get
    {
      TryLoadStream();
      return ms.Length;
    }
  }

  public override int Read(byte[] buffer, int offset, int count)
  {
    TryLoadStream();
    // process your content..
    ProcessStreamContent();
    return ms.Read(buffer, offset, count);
  }

  private void TryLoadStream()
  {
    if (String.IsNullOrEmpty(streamContent))
    {
      StreamReader sr = new StreamReader(originalStream, currentHttpContext.Request.ContentEncoding);
      streamContent = sr.ReadToEnd();
      ms = new MemoryStream();
      byte[] bytes = currentHttpContext.Request.ContentEncoding.GetBytes(streamContent);
      ms.Write(bytes, 0, bytes.Length);
      ms.Seek(0, SeekOrigin.Begin);
    }
  }

  private void ProcessStreamContent()
  {
    RejectRequest(currentHttpContext, "test");
  }
}
```

Now you can apply your filtering rules to both `GET` and `POST` requests. The overhead it brings to your web services is minimal as long as you keep your rule simple and straightforward.

[1]: http://www.odata.org/
[2]: https://msdn.microsoft.com/en-us/library/system.web.httprequest.filter(v=vs.110).aspx