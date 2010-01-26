var Stream = require("../lib/stream"),
  assert = require("assert"),
  sys = require("sys");

// s1 | s2 | s3

var s1 = new Stream(),
  s2 = new Stream(),
  s3 = new Stream(),
  out = "";
s1.addListener("data", function (chunk) { s2.write(chunk) });
s2.addListener("data", function (chunk) { s3.write(chunk) });
s3.addListener("data", function (chunk) { chunk && (out += chunk + " ") });

s2.addListener("drain", function () { out += "\n--DRAIN--\n" });

function message () {
  out += "-1-";
  s1.write("order");
  s2.pause();
  process.nextTick(function () { out += "-A-" });
  setTimeout(function () { out += "-!-" });
  out += "-2-";
  s1.write("is");
  process.nextTick(function () { out += "-B-" });
  setTimeout(function () { out += "-@-" });
  out += "-3-";
  s1.write("guaranteed");
  out += "-4-";
  process.nextTick(function () { out += "-C-" });
  setTimeout(function () { out += "-#-" });
  s1.write("but");
  out += "-5-";
  process.nextTick(function () { out += "-D-" });
  setTimeout(function () { out += "-$-" });
  s1.write("NOT");
  out += "-6-";
  s1.write("synchronicity\n");
  process.nextTick(function () { out += "-E-" });
  setTimeout(function () { out += "-%-" });
}
message();
setTimeout(message);
setTimeout(function () { s1.close() }, 100);

setTimeout(function () { s2.resume() }, 500);



setTimeout(function () { sys.error(out) }, 1000);

