/*
References for these codes:
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
*/

var serial;   // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbmodem14101';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino

var minWidth = 600;   //set min width and height for canvas
var minHeight = 400;
var width, height;    // actual width and height for the sketch




function setup() {
  // set the canvas to match the window size
  if (window.innerWidth > minWidth){
    width = window.innerWidth;
  } else {
    width = minWidth;
  }
  if (window.innerHeight > minHeight) {
    height = window.innerHeight;
  } else {
    height = minHeight;
  }

  //set up canvas
  createCanvas(width, height);
  noStroke();

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
}

function draw() {
  // set background to black
  background(0);

  // drawing to visualize my LED light
  var leftBrightness = map(inData, 0, 255, 0, 255);   // map input to the correct range of brightness
  fill(leftBrightness);   // transfer the brightness to brightness of the color used for drawing
  rect(0,0,width,height);  
  
  var ellipseColor = map(leftBrightness, 0, 255,255,0);
  fill (ellipseColor);
  ellipseMode (CENTER);
  ellipse (width/2,height/2, 300, 300);

  // draw the text - left
  var textLColor = map(leftBrightness, 0, 255, 255,0);  // inverse the color for drawing the text on background
  fill(0,255,0);
  textAlign(CENTER, CENTER);
  textSize(50);
  textStyle(BOLD);
  text("" + inData, width/2, height/2);    // displaying the input

 
}

// Following functions print the serial communication status to the console for debugging purposes

function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
