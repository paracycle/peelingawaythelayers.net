---
title: Application
description: A look at the top layers of the network stack. How can we encode our application concerns inside the data packets that we send over the network?
tags: RailsConf 2020, Blogpost, Talk
---

# Part 6 - Finally the Application Layer

As we noted at the end of the previous part, the final 3 layers of the OSI model most commonly don't exist as separate layers. At least in the TCP/IP stack, the responsibility of the Session Layer is handed off to the Transport Layer and Presentation Layer becomes a part of the Application Layer.

Thus, we will directly skip over Session and Presentation layers into Layer 7, the Application Layer.

:::{.layer .application}
## Layer 7 - Application Layer

This layer is the top most layer of the OSI model and is the layer where protocols that are closest to the user are defined. The reason this layer is called the Application Layer is because the messages that this layer deals with come directly from applications running on a computer system.

Common examples of application layer protocols that run on the TCP/IP stack are:

- Domain Name System (DNS)
- File Transfer Service (FTP)
- Hypertext Transfer Service (HTTP)
- Simple Mail Transport Service (SMTP)

The protocol that we, as web developers, are most interested in is obviously HTTP, but before we go on to talk about HTTP, we will take a small tour around DNS which is also very important for modern systems.

### DNS

So far, when talking about communication between different computers on the network we talked about using MAC addresses on the local network and then using IP addresses when communicating over different networks. Thanks to Address Resolution Protocol, we don't have to be concerned with MAC addresses and can just use IP addresses when making connections.

However, IP addresses are 32-bit numbers and people are really bad with numbers. If every site on the internet had to be addressed using its IP address, it would not have the popularity it has today. Would uyou rather connect to a website with the address `35.185.82.132` or `shopify.com`? Which one is easier to remember?

Obviously, names are easier to remember but out network stack does not operate using names. How can we solve this problem?

Domain Name System (DNS) is the solution to that problem. DNS is a simple UDP based protocol through which clients can query the IP address that corresponds to a certain domain name. For example, you can send a DNS query to your DNS server of choice for the IP address of `shopify.com`. The request travels to the DNS server as a UDP packet that has the data appropriate for a DNS query and contains the string `shopify.com` in the packet. When the DNS server receives the request, it looks up its table, if it can find an IP address for `shopify.com` in its table, it returns it immediately. If not, then the DNS server makes a request to another DNS server, until ultimately the request is received by the authoritative DNS server for `shopify.com`. Then the responses are sent back in turn to the DNS servers and the DNS server we queried returns the result back to us.

The result of our query is also a UDP packet in DNS protocol format and contains the IP address (or addresses) for `shopify.com`. We receive a response like `35.185.82.132`.

Thus, the DNS protocol and all the infrastructure that serves that protocol acts like the Contacts application on your phone. You probably don't know all your friends' phone numbers, you open up your Contacts app and lookup a person by name and the app shows you the numbers you have for them.

DNS is similar to a Contacts app but operates across the Internet and can lookup any domain that exists and has proper records. For efficiency, when some endpoint receives a DNS lookup response, it caches the result for a given amount of time and does not do further DNS look ups in that window.

In summary, when we try to send a request to a website like `shopify.com`, we need to first lookup the IP address that serves that domain name so that we can start sending TCP/IP messages to that IP address. DNS provides that for us.

### HTTP

Finally, we come to the HTTP protocol that we all love and cherish. HTTP is a text-based, request-response, TCP protocol that operates on the application layer. By text-based protocol, we mean that the data that we send in HTTP does not get encoded in a weird binary encoding when placed in a TCP packet. Instead, the actual ASCII values of the protocol string are placed in TCP segments. Thus, it is easy to see and debug HTTP messages as they are being transmitted on the network.

HTTP is a request-response protocol, since an HTTP application waits for requests to be made to it and will respond with a response for the request.

In HTTP, each request starts with a request line with a `Verb`, a `Resource Path` and a version number. Then some headers follow the request line. Following an empty line after the headers, an optional request body (of a known length indicated in a header) might also be transmitted.

Once the HTTP server decides the request is finished, it processes the request and generates a response which starts with a status line that includes a `Status Code` and `Reason` message. Then some response headers follow the response line, and, similar to the request, following an empty line after the headers, an optional response body is sent back to the client.

HTTP is a resource-oriented protocol, thus all the requests are actually requests to perform a specific action (that is specified by the `Verb` in the request line) or the given resource (that is specified by the `Resource Path`).

To make this concrete, let's work through a case where Alice wants to get a list of all widgets provided by Bob via HTTP. Alice would have to know the domain name of Bob's HTTP server and the resource path for the widgets as hosted on Bob's HTTP server. We can represent the two things using a single identifier we call the URL, though.

Thus, Alice enters the URL `http://bobwidgets.myshopify.com/widgets` in her browser. Her browser realises that the domain name is `bobwidgets.myshopify.com`, so makes a DNS lookup to translate that to an IP address. Suppose, the returned IP address is `35.185.82.132`.

Then, the browser makes starts a TCP connection with the server at address `35.185.82.132` on port `80` (the default port for HTTP). Provided that the three-way TCP handshake completes successfully, Alice's browser sends the following data in a TCP segment:

{% highlight http %}
GET /widgets HTTP/1.1
Host: bobwidgets.myshopify.com
{% endhighlight %}

This request has the verb `GET` and requests the resource `/widgets` on the HTTP server as indicated by the URL Alice input in her browser. Alice also sends the host name she is making a request for, in case the same HTTP server responds to requests made for different hosts. Moreover, this request does not include a body, since Alice's request has not specified a length for a body.

Now that Bob's HTTP server has received the request, it does some processing and returns an HTTP response that contains the widget list that Alice asked for. The response might look something like this:

{% highlight http %}
HTTP/1.1 200 OK
Date: Fri, 10 Apr 2020 23:00:00 UTC
Content-Type: text/html; charset=UTF-8
Content-Length: 239

<html>
  <head>
    <title>Bob's Widgets</title>
  </head>
  <body>
    <h1>Welcome to Bob's Widgets</h1>
    <ol>
      <li><a href="/widgets/1">Widget 1</a></li>
    </ol>
    <a href="/widgets/new">Add a new Widget</a>
  </body>
</html>
{% endhighlight %}

This response states that the request was processed successfully (`200` is a status code that means that and `OK` is the textual representation of it). It also send back the date on the server when this response was generated, the type of the content that is being sent in the body and the length of the body in bytes.

When Alice's browser receives the TCP segments that hold this response data, it processes the HTML result returned and renders a page that looks like this:

![Welcome to Bob's Widgets](https://i.imgur.com/cY53iin.png)

Now, Alice can click on the link that says `Widget 1` to fetch the resource for `/widgets/1` on the same server and she can click the `Add a new Widget` link to fetch the resource for `/widgets/new` resource. The latter would most probably return a form for Alice to fill.

If Alice fills the form on `/widgets/new` and submits, her browser will make a request like the following:

{% highlight http %}
POST /widgets HTTP/1.1
Host: bobwidgets.myshpify.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 36

name=My%20Widget&color=blue&stock=20
{% endhighlight %}

and Bob's server will receive the request, process it, possibly write it to the database and respond with something like:

{% highlight http %}
HTTP/1.1 201 Created
Location: /widgets/42
{% endhighlight %}

In this example, Alice's request has a `POST` verb operating on the `/widgets` resource. And Alice is sending data to Bob along with this request represented in the form urlencoded type. Bob's server responds by saying that a new resource was created and points Alice's browser to the location of the new created resource.

## Nginx, Puma, Rack, Rails

Now that we understand the whole network stack from the bottom up, we can encode HTTP messages that get placed in TCP segments which get placed in IP packets, which gets placed in Ethernet frames and sent over some physical connection to a distant computer, which parses the Ethernet frame, extracts the IP packet, extracts the TCP segments and finally extracts the HTTP request data.

What happens with that data, though? Which application does it get sent to and how is it processed?

## Web Server - Nginx / Apache

First, we need a web server on the destination computer that listens to port 80 on the server. When new messages are received on port 80, the message data is passed directly to the web server. The web server is responsible for parsing the HTTP message and understanding what the request is and how it should be handled.

There are many web servers that one can use but most common ones are Nginx and Apache. Either can listen on port 80 and process incoming requests. Based on their configuration, they decide what to do with the incoming requests.

For example, if your web server is configured to look for requests to resources on disk first, and then, if a file is not found, to send the request off to another web server, it will perform that for every incoming HTTP request.

For Alice's first `GET /widgets` request, for example, your web server would look for `widgets.html` in a webroot folder. If it finds it, the webserver would return the content of that file to Alice. No more processing is necessary.

However, `POST` requests need different handling, since data is being sent to the web server for processing. Thus a static file lookup won't work. We need to configure our webserver to pass the request to another server that knows how to deal with it.

## Application Server - Puma / Thin / Unicorn

For Rails applications, this next server is what is called an "application server" and is usually Puma, Thin or Unicorn. These application servers know how to run your Rails application, pass incoming requests from the web server into your Rails application and respond with the response from your Rails application. Their sole purpose is to provide a process for your application to run on. The application server is also what boots your Rails application.

## Rack

The way an application server talks to a Rails application, or to any Ruby application, for that matter, is standardized in the Rack server interface protocol.

When an application server receives a request, like Alice's `POST /widgets` request, the application server parses all the parts of the request, places them in Ruby `Hash` called the `Environment` and passes it to the Ruby application that the application server has booted.

For the Ruby application, this is a method call with the `env` variable passed in. The Ruby application does whatever processing it needs to do and returns the result as a Ruby `Array` of three entries: a `status`, `headers` and the `body`.

In the case of Alice's `POST /widgets` example, the data passed to the Ruby application's handler function would look like this:

{% highlight ruby %}
{
  "REQUEST_METHOD" => "POST",
  "PATH_INFO" => "/widgets",
  "QUERY_STRING" => "",
  "SERVER_NAME" => "bobswidgets.myshopify.com",
  "HTTP_CONTENT_TYPE" => "application/x-www-form-urlencoded",
  "HTTP_CONTENT_LENGTH" => 36,
  "rack.input" => "name=My%20Widget&color=blue&stock=20"
}
{% endhighlight %}

As you can see, this completely describes the HTTP request in a Ruby Hash object!

When the Ruby handler processes this request, it returns a response like the following:

{% highlight ruby %}
[
  201,
  {
    "Location" => "/widgets/42"
  },
  [""]
]
{% endhighlight %}

Notice, again, how this completely determines what the response should be. This result from the Ruby handler method gets passed to the application server, which renders it as a proper HTTP response and send it back to the web server.

## Rails

Finally, Rails. Rails is framework that is built on top of Rack and is layers and layers of abstraction that makes it super easy and fun to work with incoming HTTP messages. For more information on how exactly Rails processes the Rack data that gets passed in, you can take a look at the talk ["Inside Rails: The Lifecycle of a Request"](https://www.youtube.com/watch?v=eK_JVdWOssI) from RailsConf 2019.
:::

# Next Steps

In the [next and final part of this series]({% link _pages/part7.md %}), we will recap all the things we covered throughout these series, talk a little bit about why all of this is important and provide links to some tools you might want to use if and when you want to dive deep into these layers.
