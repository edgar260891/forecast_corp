var tabla_central;
var tabla_sucursales_ntw;

var sucursales = [];
var valores_variacion = [];
var valores_inventario=[];
var etiquetas_variacion=[];
var etiquetas_inventario=[];

var logo;
var fg1;

let s1;
let b1;

var c1='rgb(255,0,0)';
var c2='rgb(0,0,255)';

let x_vals=[];
let y_vals=[];

let x_vals_2=[];
let y_vals_2=[];

let x_vals_3=[];
let y_vals_3=[];

let x_vals_4=[];
let y_vals_4=[];

let constantes =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
let constantes2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

let constantes3 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
let constantes4 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];

let s2;

let s3;

let m,b;
let m2,b2;

const learningRate=0.5;
const learningRate2=0.5;
const learningRate3=0.2;
const learningRate4=0.2;

var optimizer;
var optimizer2;
var optimizer3;
var optimizer4;

var px1;
var px2;
var py1;
var py2;

var px1_inventario;
var px2_inventario;
var py1_inventario;
var py2_inventario;

var px1_variacion_polinomial;
var px2_variacion_polinomial;
var py1_variacion_polinomial;
var py2_variacion_polinomial;

var px1_inventario_polinomial;
var px2_inventario_polinomial;
var py1_inventario_polinomial;
var py2_inventario_polinomial;

var escala_1_min = -10000;
var escala_1_max = 10000;
var escala_2_min = 0;
var escala_2_max = 3000000;

var color_1 = 'rgb(0,255,0)';
var color_2 = 'rgb(255,0,0)';

function preload()
{
  
  tabla_central = loadTable('data/tabla_central.csv','csv','header');
  tabla_sucursales_ntw = loadTable('data/sucursales_NTW.csv','csv','header');
  
  ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: etiquetas_variacion,
    datasets: [
    {
        label: 'Behavior of total variation',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: c1,
        data: [],
    },],
    },
    options: {},
});

ctx2 = document.getElementById('chart2').getContext('2d');
    chart2 = new Chart(ctx2, {
     type: 'line',
    data: {
    labels: etiquetas_inventario,
    datasets: [
    {
        label: 'Behavior of total inventory',
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: c2,
        data: [],
    },],
    },
    options: {},
});
}


function setup() 
{
  
  logo=loadImage('data/logo.png');
  fg1=loadImage('data/fg1.png');
  
  optimizer = tf.train.sgd(learningRate);
  optimizer2 = tf.train.sgd(learningRate2);
  optimizer3 = tf.train.adam(learningRate3);
  optimizer4 = tf.train.adam(learningRate4);
  
  createCanvas(windowWidth,(182*windowHeight)/100);
  
  s1=createSelect();
  s1.position();
  s1.position((2*windowWidth)/100,(17*windowHeight)/100);
  s1.size((12*windowWidth)/100,(5*windowHeight)/100);
  for(var i=0;i<tabla_sucursales_ntw.getRowCount();i++)
  {
    var nombre_temp = tabla_sucursales_ntw.getString(i,0);
    s1.option(nombre_temp);
  }
  
  s2=createSelect();
  s2.position((38*windowWidth)/100,(132*windowHeight)/100);
  s2.size((10*windowWidth)/100,(5*windowHeight)/100);
  s2.option('Orden del polinomio 1');
  for(var t2=3;t2<=40;t2++)
  {
    s2.option(t2);
  }
  s2.changed(cambio1);
  
  s3=createSelect();
  s3.position((88*windowWidth)/100,(132*windowHeight)/100);
  s3.size((10*windowWidth)/100,(5*windowHeight)/100);
  s3.option('Orden del polinomio 2');
  for(var t3=3;t3<=40;t3++)
  {
    s3.option(t3);
  }
  s3.changed(cambio2);
  
  for(var n=0;n<constantes.length;n++)
  {
    constantes[n]=tf.variable(tf.scalar(0.2));
    constantes3[n]=tf.variable(tf.scalar(0.2));
  }
  
  b1=createButton('Search');
  b1.position((15*windowWidth)/100,(17*windowHeight)/100);
  b1.size((12*windowWidth)/100,(5*windowHeight)/100);
  b1.mousePressed(buscar);
  
  m=tf.variable(tf.scalar(0.3));
  b=tf.variable(tf.scalar(0.3));
  
  m2=tf.variable(tf.scalar(0.3));
  b2=tf.variable(tf.scalar(0.3));
  
  px1=5;
  px2=px1+(49*windowWidth)/100;
  py1=(80*windowHeight)/100;
  py2=py1+(45*windowHeight)/100;
  
  px1_inventario=(50*windowWidth)/100;
  px2_inventario=px1_inventario+(49*windowWidth)/100;
  py1_inventario=(80*windowHeight)/100;
  py2_inventario=py1_inventario+(45*windowHeight)/100;
  
  px1_variacion_polinomial= 5;
  px2_variacion_polinomial = px1_variacion_polinomial+(51*windowWidth)/100;
  py1_variacion_polinomial = (130*windowHeight)/100;
  py2_variacion_polinomial = py1_variacion_polinomial + (45*windowHeight)/100;
  
  px1_inventario_polinomial = (50*windowWidth)/100;
  px2_inventario_polinomial = px1_inventario_polinomial+(51*windowWidth)/100;
  py1_inventario_polinomial = (130*windowHeight)/100;
  py2_inventario_polinomial = py1_inventario_polinomial + (45*windowHeight)/100;
  
}

function draw() 
{
  background(255);
  fill(223,223,223);
  noStroke();
  rect(0,0,windowWidth,windowHeight/8);
  textSize((3)*(windowWidth)/100);
  fill(0);
  text("TBC-DS-AUDIT-FORECAST",(30*windowWidth)/100,(8.5*windowHeight)/100);
  image(logo,0,0,windowWidth/10,windowHeight/8);
  
  fill(0);
  
  image(fg1,0,(80*windowHeight)/100,(49*windowWidth)/100,(45*windowHeight)/100);
  
  image(fg1,(50*windowWidth)/100,(80*windowHeight)/100,(49*windowWidth)/100,(45*windowHeight)/100);
  
  image(fg1,0,(130*windowHeight)/100,(49*windowWidth)/100,(45*windowHeight)/100);
  
  image(fg1,(50*windowWidth)/100,(130*windowHeight)/100,(49*windowWidth)/100,(45*windowHeight)/100);
  
  tf.tidy(() => {
  if(x_vals.length>0)
  {
     const ys = tf.tensor1d(y_vals);
     optimizer.minimize(() => loss(predict(x_vals),ys));
  }
  if(x_vals_2.length>0)
  {
    const ys2 = tf.tensor1d(y_vals_2);
     optimizer2.minimize(() => loss2(predict2(x_vals_2),ys2));
  }
  if(x_vals_3.length>0)
  {
    const ys3 = tf.tensor1d(y_vals_3);
     optimizer3.minimize(() => loss3(predict3(x_vals_3),ys3));
  }
  if(x_vals_4.length>0)
  {
    const ys4 = tf.tensor1d(y_vals_4);
     optimizer4.minimize(() => loss4(predict4(x_vals_4),ys4));
  }
  });
  
  stroke(0);
  strokeWeight(8);
  for(let i=0;i<x_vals.length;i++)
  {
    let px = map(x_vals[i],0,1,px1,px2);
    let py = map(y_vals[i],0,1,py1,py2);
    strokeWeight(10);
    point(px,py);
    if(i>0)
    {
      let pxa = map(x_vals[i-1],0,1,px1,px2);
      let pya = map(y_vals[i-1],0,1,py1,py2);
      strokeWeight(3);
      line(pxa,pya,px,py);
    }
  }
 
  for(let i2=0;i2<x_vals_2.length;i2++)
  {
    let px2 = map(x_vals_2[i2],0,1,px1_inventario,px2_inventario);
    let py2 = map(y_vals_2[i2],0,1,py1_inventario,py2_inventario);
    strokeWeight(10);
    point(px2,py2);
    if(i2>0)
    {
      let pxa2 = map(x_vals_2[i2-1],0,1,px1_inventario,px2_inventario);
      let pya2 = map(y_vals_2[i2-1],0,1,py1_inventario,py2_inventario);
      strokeWeight(3);
      line(pxa2,pya2,px2,py2);
    }
  }
  
  for(let i3=0;i3<x_vals_3.length;i3++)
  {
    let px3 = map(x_vals_3[i3],0,1,px1_variacion_polinomial,px2_variacion_polinomial);
    let py3 = map(y_vals_3[i3],0,1,py1_variacion_polinomial,py2_variacion_polinomial);
    strokeWeight(10);
    point(px3,py3);
    if(i3>0)
    {
      let pxa3 = map(x_vals_3[i3-1],0,1,px1_variacion_polinomial,px2_variacion_polinomial);
      let pya3 = map(y_vals_3[i3-1],0,1,py1_variacion_polinomial,py2_variacion_polinomial);
      strokeWeight(3);
      line(pxa3,pya3,px3,py3);
    }
  }
  
  for(let i4=0;i4<x_vals_4.length;i4++)
  {
    let px4 = map(x_vals_4[i4],0,1,px1_inventario_polinomial,px2_inventario_polinomial);
    let py4 = map(y_vals_4[i4],0,1,py1_inventario_polinomial,py2_inventario_polinomial);
    strokeWeight(10);
    point(px4,py4);
    if(i4>0)
    {
      let pxa4 = map(x_vals_4[i4-1],0,1,px1_inventario_polinomial,px2_inventario_polinomial);
      let pya4 = map(y_vals_4[i4-1],0,1,py1_inventario_polinomial,py2_inventario_polinomial);
      strokeWeight(3);
      line(pxa4,pya4,px4,py4);
    }
  }
  
  const lineX = [0,1,];
  const ys = tf.tidy(() => predict(lineX));
  let lineY = ys.dataSync();
  ys.dispose();
  
  const lineX2 = [0,1,];
  const ys2 = tf.tidy(() => predict2(lineX2));
  let lineY2 = ys2.dataSync();
  ys2.dispose();
  
  const curveX = [];
  for(let x=0;x<1.01;x+=0.08)
  {
    curveX.push(x);
  }
  
  const curveX2 = [];
  for(let xa=0;xa<1.01;xa+=0.08)
  {
    curveX2.push(xa);
  }
  
  const ys3 = tf.tidy(() => predict3(curveX));
  let curveY = ys3.dataSync();
  ys3.dispose();
  
  const ys4 = tf.tidy(() => predict4(curveX2));
  let curveY2 = ys4.dataSync();
  ys4.dispose();
  
  
  let x1 = map(lineX[0],0,1,px1,px2);
  let x2 = map(lineX[1],0,1,px1,px2);
  
  let x12 = map(lineX2[0],0,1,px1_inventario,px2_inventario);
  let x22 = map(lineX2[1],0,1,px1_inventario,px2_inventario);
  
  

  let y1 = map(lineY[0],0,1,py1,py2);
  let y2 = map(lineY[1],0,1,py1,py2);
  
  let y12 = map(lineY2[0],0,1,py1_inventario,py2_inventario);
  let y22 = map(lineY2[1],0,1,py1_inventario,py2_inventario);
  
  beginShape();
  noFill();
  stroke(color_1);
  strokeWeight(5);
  for(let ic1=0;ic1<curveX.length;ic1++)
  {
    let x3 = map(curveX[ic1],0,1,px1_variacion_polinomial,px2_variacion_polinomial);
    let y3 = map(curveY[ic1],0,1,py1_variacion_polinomial,py2_variacion_polinomial);
    vertex(x3,y3);
  }
  endShape();
  
  beginShape();
  noFill();
  stroke(color_2);
  strokeWeight(5);
  for(let ic2=0;ic2<curveX2.length;ic2++)
  {
    let x4 = map(curveX2[ic2],0,1,px1_inventario_polinomial,px2_inventario_polinomial);
    let y4 = map(curveY2[ic2],0,1,py1_inventario_polinomial,py2_inventario_polinomial);
    vertex(x4,y4);
  }
  endShape();
  
  
  strokeWeight(12);
  //stroke(255,0,0);
  
  point(x2,y2);
  point(x22,y22);
  
  point(x1,y1);
  point(x12,x22);
  
  stroke(color_1);
  strokeWeight(4);
  line(x1,y1,x2,y2);
  
  stroke(color_2);
  line(x12,y12,x22,y22);
  

  textSize(25);
  fill(255);
  stroke(0);
  
  rect((8*windowWidth)/100,(73.5*windowHeight)/100,(34*windowWidth)/100,(5*windowHeight)/100);
  rect((58*windowWidth)/100,(73.5*windowHeight)/100,(34*windowWidth)/100,(5*windowHeight)/100);
  
  fill(0);
  stroke(255);
  
  text('Forecast linear and polinomial regresion A.I.',(10*windowWidth)/100,(77*windowHeight)/100);
  text('Forecast linear and polinomial regresion A.I.',(60*windowWidth)/100,(77*windowHeight)/100);
  
  fill(255);
  stroke(0);
  
  rect((0*windowWidth)/100,(124*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
  rect((50*windowWidth)/100,(124*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
  
  fill(0);
  stroke(255);
  
  var y1d =map(y_vals[x_vals.length-1],1,0,escala_1_min,escala_1_max);
  var ypred = nfc(map(lineY[1],1,0,escala_1_min,escala_1_max),2);
  var pendiente_1 = ((y2-y1)/(x2-x1))*-1;
  
  if(pendiente_1 < 0)
  {
    color_1 = 'rgb(255,0,0)';
  }
  else if(pendiente_1>=0)
  {
    color_1 = 'rgb(0,255,0)';
  }
  
  var y1d2 =map(y_vals_2[x_vals_2.length-1],1,0,escala_1_min,escala_1_max);
  var ypred2 = nfc(map(lineY2[1],1,0,escala_2_min,escala_2_max),2);
  var pendiente_2 = ((y22-y12)/(x22-x12))*-1;
  
  if(pendiente_2 < 0)
  {
    color_2 = 'rgb(255,0,0)';
  }
  else if(pendiente_2>=0)
  {
    color_2 = 'rgb(0,255,0)';
  }

  text('prediction: '+ypred,(0.5*windowWidth)/100,(127.5*windowHeight)/100);
  text('prediction: '+ypred2,(50.5*windowWidth)/100,(127.5*windowHeight)/100);
  
  fill(255);
  stroke(0);
  
  rect((28*windowWidth)/100,(124*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
  rect((78*windowWidth)/100,(124*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
  
  fill(0);
  stroke(255);
  
  text('slope: '+nfc(pendiente_1,2),(28.5*windowWidth)/100,(127.5*windowHeight)/100);
  text('slope: '+nfc(pendiente_2,2),(78.5*windowWidth)/100,(127.5*windowHeight)/100);
  
  fill(255);
  stroke(0);
  
  rect((0*windowWidth)/100,(176*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
   rect((50*windowWidth)/100,(176*windowHeight)/100,(20*windowWidth)/100,(5*windowHeight)/100);
  
  fill(0);
  stroke(255);
  
  var ypred_pol = nfc(map(curveY[curveY.length-1],1,0,escala_1_min,escala_1_max),2);
  var ypred_pol2 = nfc(map(curveY2[curveY2.length-1],1,0,escala_2_min,escala_2_max),2);
  
  text('prediction: '+ypred_pol,(0.5*windowWidth)/100,(179.5*windowHeight)/100);
  text('prediction: '+ypred_pol2,(50.5*windowWidth)/100,(179.5*windowHeight)/100);
 
}

function buscar()
{
  valores_variacion=[];
  valores_inventario=[];
  etiquetas_variacion=[];
  etiquetas_inventario=[];
  x_vals=[];
  y_vals=[];
  x_vals_2=[];
  y_vals_2=[];
  x_vals_3=[];
  y_vals_3=[];
  x_vals_4=[];
  y_vals_4=[];
  var n=0;
  var m=0;
  for(var j=0;j<tabla_central.getRowCount();j++)
  {
    var nombre_temp2 = tabla_central.getString(j,0);
    if(trim(nombre_temp2)==trim(s1.value()))
    {
      valores_variacion[n]=tabla_central.getNum(j,1);
      valores_inventario[n]=tabla_central.getNum(j,2);
      etiquetas_variacion[n]=str(n);
      etiquetas_inventario[n]=str(n);
      
      n=n+1;
    }
  }
  
  escala_1_min = min(valores_variacion)-1000;
  escala_1_max = max(valores_variacion)+1000;
  escala_2_min = min(valores_inventario)-1000;
  escala_2_max = max(valores_inventario)+1000;
  
  for(var k2=0;k2<valores_variacion.length;k2++)
  {
    let y = map(valores_variacion[k2],escala_1_min,escala_1_max,1,0);
    let y3 = map(valores_variacion[k2],escala_1_min,escala_1_max,1,0);
    
    y_vals.push(y);
    y_vals_3.push(y3);
  }
  
  for(var k3=0;k3<valores_inventario.length;k3++)
  {
    let y2 = map(valores_inventario[k3],escala_2_min,escala_2_max,1,0);
    let y4 = map(valores_inventario[k3],escala_2_min,escala_2_max,1,0);
    
    y_vals_2.push(y2);
    y_vals_4.push(y4);
  }
  
  
  for (var k=0;k<n;k++)
  {
    let x = map(m,px1,px2,0,1);
    let x2 = map(m+(50*windowWidth)/100,px1_inventario,px2_inventario,0,1);
    let x3 = map(m,px1_variacion_polinomial,px2_variacion_polinomial,0,1);
    let x4 = map(m+(50*windowWidth)/100,px1_inventario_polinomial,px2_inventario_polinomial,0,1);
    
    x_vals.push(x);
    x_vals_2.push(x2);
    x_vals_3.push(x3);
    x_vals_4.push(x4);
    
    var ancho = (49*windowWidth)/100;
    var aumento = ancho/n;
    m = m+aumento;
  }
  
  grafica(chart,valores_variacion,etiquetas_variacion,c1,'Behavior of total variation');
  grafica(chart2,valores_inventario,etiquetas_inventario,c2,'Behavior of total inventory');
}

function grafica(chart,valores_g1,etiquetas_g1,cg,l1)
{
  chart.data = {
    labels: etiquetas_g1,
    datasets: [{
        label: l1,
        backgroundColor: 'rgba(255,255,255,0)',
        borderColor: cg,
        data: valores_g1,
    },],
  };
  chart.update();
}

function loss(pred, labels)
{
  return pred.sub(labels).square().mean();
}

function loss2(pred, labels)
{
  return pred.sub(labels).square().mean();
}

function loss3(pred, labels)
{
  return pred.sub(labels).square().mean();
}

function loss4(pred, labels)
{
  return pred.sub(labels).square().mean();
}

function predict(x)
{
  const xs=tf.tensor1d(x);
  const ys = xs.mul(m).add(b);
  return ys;
}

function predict2(x2)
{
  const xs2=tf.tensor1d(x2);
  const ys2 = xs2.mul(m2).add(b2);
  return ys2;
}

function predict3(x3)
{
  const xs3=tf.tensor1d(x3);
  
  const ys3 = xs3.pow(tf.scalar(40)).mul(constantes[0]).mul(constantes2[37])
               .add(xs3.pow(tf.scalar(39)).mul(constantes[1])).mul(constantes2[36])
               .add(xs3.pow(tf.scalar(38)).mul(constantes[2])).mul(constantes2[35])
               .add(xs3.pow(tf.scalar(37)).mul(constantes[3])).mul(constantes2[34])
               .add(xs3.pow(tf.scalar(36)).mul(constantes[4])).mul(constantes2[33])
               .add(xs3.pow(tf.scalar(35)).mul(constantes[5])).mul(constantes2[32])
               .add(xs3.pow(tf.scalar(34)).mul(constantes[6])).mul(constantes2[31])
               .add(xs3.pow(tf.scalar(33)).mul(constantes[7])).mul(constantes2[30])
               .add(xs3.pow(tf.scalar(32)).mul(constantes[8])).mul(constantes2[29])
               .add(xs3.pow(tf.scalar(31)).mul(constantes[9])).mul(constantes2[28])
               .add(xs3.pow(tf.scalar(30)).mul(constantes[10])).mul(constantes2[27])
               .add(xs3.pow(tf.scalar(29)).mul(constantes[11])).mul(constantes2[26])
               .add(xs3.pow(tf.scalar(28)).mul(constantes[12])).mul(constantes2[25])
               .add(xs3.pow(tf.scalar(27)).mul(constantes[13])).mul(constantes2[24])
               .add(xs3.pow(tf.scalar(26)).mul(constantes[14])).mul(constantes2[23])
               .add(xs3.pow(tf.scalar(25)).mul(constantes[15])).mul(constantes2[22])
               .add(xs3.pow(tf.scalar(24)).mul(constantes[16])).mul(constantes2[21])
               .add(xs3.pow(tf.scalar(23)).mul(constantes[17])).mul(constantes2[20])
               .add(xs3.pow(tf.scalar(22)).mul(constantes[18])).mul(constantes2[19])
               .add(xs3.pow(tf.scalar(21)).mul(constantes[19])).mul(constantes2[18])
               .add(xs3.pow(tf.scalar(20)).mul(constantes[20])).mul(constantes2[17])
               .add(xs3.pow(tf.scalar(19)).mul(constantes[21])).mul(constantes2[16])
               .add(xs3.pow(tf.scalar(18)).mul(constantes[22])).mul(constantes2[15])
               .add(xs3.pow(tf.scalar(17)).mul(constantes[23])).mul(constantes2[14])
               .add(xs3.pow(tf.scalar(16)).mul(constantes[24])).mul(constantes2[13])
               .add(xs3.pow(tf.scalar(15)).mul(constantes[25])).mul(constantes2[12])
               .add(xs3.pow(tf.scalar(14)).mul(constantes[26])).mul(constantes2[11])
               .add(xs3.pow(tf.scalar(13)).mul(constantes[27])).mul(constantes2[10])
               .add(xs3.pow(tf.scalar(12)).mul(constantes[28])).mul(constantes2[9])
               .add(xs3.pow(tf.scalar(11)).mul(constantes[29])).mul(constantes2[8])
               .add(xs3.pow(tf.scalar(10)).mul(constantes[30])).mul(constantes2[7])
               .add(xs3.pow(tf.scalar(9)).mul(constantes[31])).mul(constantes2[6])
               .add(xs3.pow(tf.scalar(8)).mul(constantes[32])).mul(constantes2[5])
               .add(xs3.pow(tf.scalar(7)).mul(constantes[33])).mul(constantes2[4])
               .add(xs3.pow(tf.scalar(6)).mul(constantes[34])).mul(constantes2[3])
               .add(xs3.pow(tf.scalar(5)).mul(constantes[35])).mul(constantes2[2])
               .add(xs3.pow(tf.scalar(4)).mul(constantes[36])).mul(constantes2[1])
               .add(xs3.pow(tf.scalar(3)).mul(constantes[37])).mul(constantes2[0])
               .add(xs3.square().mul(constantes[38]))
               .add(xs3.mul(constantes[39]))
               .add(constantes[40]);
  return ys3;
}

function predict4(x4)
{
  const xs4=tf.tensor1d(x4);

  const ys4= xs4.pow(tf.scalar(4)).mul(constantes3[0]).mul(constantes4[37])
               .add(xs4.pow(tf.scalar(39)).mul(constantes3[1])).mul(constantes4[36])
               .add(xs4.pow(tf.scalar(38)).mul(constantes3[2])).mul(constantes4[35])
               .add(xs4.pow(tf.scalar(37)).mul(constantes3[3])).mul(constantes4[34])
               .add(xs4.pow(tf.scalar(36)).mul(constantes3[4])).mul(constantes4[33])
               .add(xs4.pow(tf.scalar(35)).mul(constantes3[5])).mul(constantes4[32])
               .add(xs4.pow(tf.scalar(34)).mul(constantes3[6])).mul(constantes4[31])
               .add(xs4.pow(tf.scalar(33)).mul(constantes3[7])).mul(constantes4[30])
               .add(xs4.pow(tf.scalar(32)).mul(constantes3[8])).mul(constantes4[29])
               .add(xs4.pow(tf.scalar(31)).mul(constantes3[9])).mul(constantes4[28])
               .add(xs4.pow(tf.scalar(30)).mul(constantes3[10])).mul(constantes4[27])
               .add(xs4.pow(tf.scalar(29)).mul(constantes3[11])).mul(constantes4[26])
               .add(xs4.pow(tf.scalar(28)).mul(constantes3[12])).mul(constantes4[25])
               .add(xs4.pow(tf.scalar(27)).mul(constantes3[13])).mul(constantes4[24])
               .add(xs4.pow(tf.scalar(26)).mul(constantes3[14])).mul(constantes4[23])
               .add(xs4.pow(tf.scalar(25)).mul(constantes3[15])).mul(constantes4[22])
               .add(xs4.pow(tf.scalar(24)).mul(constantes3[16])).mul(constantes4[21])
               .add(xs4.pow(tf.scalar(23)).mul(constantes3[17])).mul(constantes4[20])
               .add(xs4.pow(tf.scalar(22)).mul(constantes3[18])).mul(constantes4[19])
               .add(xs4.pow(tf.scalar(21)).mul(constantes3[19])).mul(constantes4[18])
               .add(xs4.pow(tf.scalar(20)).mul(constantes3[20])).mul(constantes4[17])
               .add(xs4.pow(tf.scalar(19)).mul(constantes3[21])).mul(constantes4[16])
               .add(xs4.pow(tf.scalar(18)).mul(constantes3[22])).mul(constantes4[15])
               .add(xs4.pow(tf.scalar(17)).mul(constantes3[23])).mul(constantes4[14])
               .add(xs4.pow(tf.scalar(16)).mul(constantes3[24])).mul(constantes4[13])
               .add(xs4.pow(tf.scalar(15)).mul(constantes3[25])).mul(constantes4[12])
               .add(xs4.pow(tf.scalar(14)).mul(constantes3[26])).mul(constantes4[11])
               .add(xs4.pow(tf.scalar(13)).mul(constantes3[27])).mul(constantes4[10])
               .add(xs4.pow(tf.scalar(12)).mul(constantes3[28])).mul(constantes4[9])
               .add(xs4.pow(tf.scalar(11)).mul(constantes3[29])).mul(constantes4[8])
               .add(xs4.pow(tf.scalar(10)).mul(constantes3[30])).mul(constantes4[7])
               .add(xs4.pow(tf.scalar(9)).mul(constantes3[31])).mul(constantes4[6])
               .add(xs4.pow(tf.scalar(8)).mul(constantes3[32])).mul(constantes4[5])
               .add(xs4.pow(tf.scalar(7)).mul(constantes3[33])).mul(constantes4[4])
               .add(xs4.pow(tf.scalar(6)).mul(constantes3[34])).mul(constantes4[3])
               .add(xs4.pow(tf.scalar(5)).mul(constantes3[35])).mul(constantes4[2])
               .add(xs4.pow(tf.scalar(4)).mul(constantes3[36])).mul(constantes4[1])
               .add(xs4.pow(tf.scalar(3)).mul(constantes3[37])).mul(constantes4[0])
               .add(xs4.square().mul(constantes3[38]))
               .add(xs4.mul(constantes3[39]))
               .add(constantes3[40]);
  return ys4;
}

function cambio1()
{
  if(s2.value() != 'Orden del polinomio 1')
  {
  for(var ca=0;ca<38;ca++)
  {
    if(ca<int(s2.value())-2)
    {
      constantes2[ca]=1;
    }
    else
    {
      constantes2[ca]=0;
    }
  }
  }
}

function cambio2()
{
  if(s2.value() != 'Orden del polinomio 2')
  {
  for(var ca2=0;ca2<38;ca2++)
  {
    if(ca2<int(s3.value())-2)
    {
      constantes4[ca2]=1;
    }
    else
    {
      constantes4[ca2]=0;
    }
  }
  }
}
