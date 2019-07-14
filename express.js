var express = require("express");
var app = express();

app.get("/", function(request, response){
    response.send("<h2>Привет Express!</h2>");
});

app.listen(80);
