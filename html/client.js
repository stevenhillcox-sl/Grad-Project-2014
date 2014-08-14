var ws = new WebSocket("ws://grad-project-2014-dev-c9-shillcox.c9.io");

ws.onopen = function()
{
    console.log("Connection established");
}

ws.onclose = function()
{
    console.log("Connection closed");
}

ws.onerror = function()
{
    console.log("Problem with connection");
}

ws.onmessage = function(message)
{
    console.log("MESSAGE: " + message.data);
}