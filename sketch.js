var XPos = 10
var XSize = 70
var XDSize = XPos + XSize - 10
var XText = 150

function setup() {

  createCanvas(220, 120);
  diam = createInput(100)
  diam.position(XPos, 10)
  diam.size(50)

  diamD = createSelect()
  diamD.option('nm')
  diamD.option('µm')
  diamD.position(XDSize, 10)
  diamD.size(XSize)
  diamD.input(draw)

  weight = createInput('1.05')
  weight.position(XPos, 35)
  weight.input(draw)
  weight.size(50)

  weightD = createSelect()
  weightD.option('g/mL')
  weightD.option('g/L')
  weightD.position(XDSize, 35)
  weightD.size(XSize)
  weightD.input(draw)

  solids = createInput('1')
  solids.position(XPos, 60)
  solids.input(draw)
  solids.size(50)

  text1 = createSpan()
  text1.position(12, 85)

}

function draw() {
  background(255);
  text('Diameter', XText, 26)
  text('Density', XText, 51)
  text('% Solids', XText, 76)

  switch (diamD.value() ){
    case 'nm':
    number = diam.value() / 1000;
      break
    case 'µm':
    number = diam.value();
  }

  w = weight.value();
  s = solids.value();
  //diam = number;

  a1 = 6 * (s / 100) * pow(10, 12)
  calc = a1 / (w * PI * pow(number, 3))

  power = Math.round(Math.log10(calc));
  mantissa = (calc / (Math.pow(10, Math.abs(power)))).toFixed(3) //* 10;
  str1 = mantissa + ' &times; 10<sup>' + (power) + '</sup>' + ' particles mL<sup>' + -1;
  text1.html(str1);

}