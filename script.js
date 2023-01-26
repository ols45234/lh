/*var canvas = document.getElementById("canvas");
var canvaswidth = 512;
var canvasheight = 512;

canvas.width = canvaswidth;
canvas.height = canvasheight;
var ctx = canvas.getContext("2d");*/
var dia = Math.sqrt(2)

function compile() {
    let input = document.getElementById("i").value
    let output = ''
    let turtle = {x: 0, y: 0, stepSize: 1}
	input.split('\n').forEach((Finst, id) => {
		let inst = Finst.split(' ')[0];
		let args = Finst.split(' ').map(i => parseInt(i));
		args.shift();
		var arg = args[0];
		let mc = arg > 0 ? "вп" : "нд";
		arg = Math.abs(arg)
		arg = arg * turtle.stepSize;
		if(inst == "u") {
			output += `пр 0 ${mc} ${arg} лв 0 `
			turtle.y += arg;
		}
		else if(inst == "d") {
			output += `пр 180 ${mc} ${arg} лв 180 `
			turtle.y -= arg;
		}
		else if(inst == "l") {
			turtle.x -= arg;
			output += `пр 270 ${mc} ${arg} лв 270 `
		}
		else if(inst == "r") {
			output += `пр 90 ${mc} ${arg} лв 90 `
			turtle.x += arg;
		}
		else if(inst == "ul") {
			output += `пр 315 ${mc} ${dia * arg} лв 315 `
			turtle.x -= arg;
			turtle.y += arg;
		}
		else if(inst == "ur") {
			output += `пр 45 ${mc} ${dia * arg} лв 45 `
			turtle.x += arg;
			turtle.y += arg;
		}
		else if(inst == "dl") {
			output += `пр 225 ${mc} ${dia * arg} лв 225 `
			turtle.x -= arg;
			turtle.y -= arg;
		}
		else if(inst == "dr") {
			output += `пр 135 ${mc} ${dia * arg} лв 135 `
			turtle.x += arg;
			turtle.y -= arg;
		}
		else if(["go", "goto", "g"].includes(inst)) {
			let pNow = turtle
			let endPos = {x: args[0], y: args[1]}
			/*let rx = pNow.x > endPos.x ? "лв 90" : "пр 90"
			let ry = pNow.y > endPos.y ? "лв 90" : "пр 90"
			
			output += `${rx} вп ${Math.abs(pNow.x - endPos.x)} ${ry} нд ${Math.abs(pNow.y - endPos.y)}`*/
			let x = endPos.x - pNow.x;
			let y = endPos.y - pNow.y;
			let oper = 1
			
			console.log(x, y)
			if(x < 0 || y < 0)
				oper = -1
			let calc = (Math.acos(y / Math.sqrt(y * y + x * x)) / Math.PI * 180).toFixed(5); // calculate rotation and convert to degrees
			
			let dist = Math.sqrt(y * y + x * x);
			console.log(calc)
			output += `${oper > 0 ? "пр" : "лв"} ${calc} вп ${dist} ${oper < 0 ? "пр" : "лв"} ${calc} `.replaceAll('.', ',')
			turtle.x = args[0]
			turtle.y = args[1]
			
		}
		
		else if(["rgo", "rgoto", "rg", "r"].includes(inst)) {

			
		}
		else if(inst == "pu")
			output += "пп "
		else if(inst == "pd")
			output += "по "
		else if(inst == "*") {
			turtle.stepSize = arg;
		}
		//debugger
		console.log(turtle)
		
	})
	
    document.getElementById("o").value = output
}

function toCircularInt(num, limit) {
	return Math.ceil((-num) / limit) * limit + num
}