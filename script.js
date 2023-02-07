var canvas = document.getElementById("canvas");
var canvaswidth = 512;
var canvasheight = 512;

canvas.width = canvaswidth;
canvas.height = canvasheight;
var ctx = canvas.getContext("2d");
var dia = Math.sqrt(2)

function compile() {
    let input = document.getElementById("i").value
	//input = input.replaceAll("pass", document.getElementById("p").value)
    let output = ''
    let turtle = {x: 0, y: 0, stepSize: 1, loop: 0, loopStart: 0, inLoop: false, cx: 0, cy: 0}
	let inputArr = input.split('\n')
	for(var id = 0; id < inputArr.length; id++) {
		let inst = inputArr[id]
		if(inst.split(' ')[0] == 'call')
			input = input.replaceAll(inst, (document.getElementById(`func_${inst.split(' ')[1]}`).value))
	}
	inputArr = input.split('\n')

	
	for(var id = 0; id < inputArr.length; id++) {
		let Finst = inputArr[id]
	
		let inst = Finst.split(' ')[0];
		let args = Finst.split(' ').map(i => parseInt(i));
		args.shift();
		var arg = args[0];
		let mc = arg > 0 ? "вп" : "нд";
		arg = Math.abs(arg)
		arg = arg * turtle.stepSize;
		if(inst == "u") {
			output += (turtle.inLoop) ? '' : `нк 0 ${mc} ${arg} `
			turtle.y += arg;
		}
		else if(inst == "d") {
			output += (turtle.inLoop) ? '' : `нк 180 ${mc} ${arg} `
			turtle.y -= arg;
		}
		else if(inst == "l") {
			turtle.x -= arg;
			output += (turtle.inLoop) ? '' : `нк 270 ${mc} ${arg} `
		}
		else if(inst == "r") {
			output += (turtle.inLoop) ? '' : `нк 90 ${mc} ${arg} `
			turtle.x += arg;
		}
		else if(inst == "ul") {
			output += (turtle.inLoop) ? '' : `нк 315 ${mc} ${dia * arg} `
			turtle.x -= arg;
			turtle.y += arg;
		}
		else if(inst == "ur") {
			output += (turtle.inLoop) ? '' : `нк 45 ${mc} ${dia * arg} `
			turtle.x += arg;
			turtle.y += arg;
		}
		else if(inst == "dl") {
			output += (turtle.inLoop) ? '' : `нк 225 ${mc} ${dia * arg} `
			turtle.x -= arg;
			turtle.y -= arg;
		}
		else if(inst == "dr") {
			output += (turtle.inLoop) ? '' : `нк 135 ${mc} ${dia * arg} `
			turtle.x += arg;
			turtle.y -= arg;
		}
		else if(["go", "goto", "g"].includes(inst)) {
			let pNow = turtle
			let endPos = {x: args[0], y: args[1]}
			let x = endPos.x - pNow.x + pNow.cx;
			let y = endPos.y - pNow.y + pNow.cy;
			let oper = 1
			
			if(x < 0)
				oper = -1
			let calc = (Math.acos(y / Math.sqrt(y * y + x * x)) / Math.PI * 180).toFixed(5); // calculate rotation and convert to degrees
			let dist = Math.sqrt(y * y + x * x);
			output += (turtle.inLoop) ? '' : `${oper > 0 ? "пр" : "лв"} ${calc} вп ${dist} ${oper < 0 ? "пр" : "лв"} ${calc} `.replaceAll('.', ',')
			turtle.x = args[0]
			turtle.y = args[1]
		}
		
		else if(["rgo", "rgoto", "rg"].includes(inst)) {
			let pNow = turtle
			let endPos = {x: args[0] + pNow.x, y: args[1] + pNow.y}
			let x = endPos.x - pNow.x;
			let y = endPos.y - pNow.y;
			
			let oper = 1
			
			if(x < 0)
				oper = -1
			let calc = (Math.acos(y / Math.sqrt(y * y + x * x)) / Math.PI * 180).toFixed(5); // calculate rotation and convert to degrees
			let dist = Math.sqrt(y * y + x * x);
			output += (turtle.inLoop) ? '' : `${oper > 0 ? "пр" : "лв"} ${calc} вп ${dist} ${oper < 0 ? "пр" : "лв"} ${calc} `.replaceAll('.', ',')
			turtle.x = turtle.x + args[0]
			turtle.y = turtle.y + args[1]
			
		}
		else if(inst == "pu")
			output += "пп "
		else if(inst == "pd")
			output += "по "
		else if(inst == "*") {
			turtle.stepSize = args[0];
		}
		else if(["re", "repeat", "rep"].includes(inst)) {
			output += `повтори ${args[0]} [`
			turtle.loopStart = id;
			turtle.loop = args[0];
			
		}
		else if(["ere", "endrepeat", "endrep", "er"].includes(inst)) {
			turtle.loop -= 1
			turtle.inLoop = true
			if(turtle.loop == 0) {
				output += `] `
				turtle.inLoop = false 
			}
			else
				id = turtle.loopStart
			
		}
		else if(["sc", "sz"].includes(inst)) {
			turtle.cx = turtle.x
			turtle.cy = turtle.y
			
		}
		else {
			output += Finst
		}
		//debugger
		console.log(turtle)
		
	}
	
    document.getElementById("o").value = output
}

function toCircularInt(num, limit) {
	return Math.ceil((-num) / limit) * limit + num
}

function redraw() {
	ctx.clearRect(0, 0, canvaswidth, canvasheight)
	ctx.beginPath()
	ctx.fillStyle = 'black'
	ctx.strokeStyle = 'black'
	ctx.arc(256, 256, 10, 0, Math.PI * 2)
	ctx.fill()
	ctx.stroke()
	ctx.closePath()

	for(let i = 0; i < 8; i ++) {
		let angle = +document.getElementById('a').value
		angle = isNaN(angle) ? 30 : angle  
		let ang = i % 2 == 0 ? Math.floor(i / 2) * 90 - angle : Math.floor(i / 2) * 90 + angle
		//console.log(ang, angle)
		ang = ang / 180 * Math.PI
		ctx.beginPath()
		ctx.fillStyle = 'black'
		ctx.strokeStyle = 'black'
		ctx.moveTo(256, 256)
		ctx.lineTo(256 + Math.cos(ang) * 128, 256 + Math.sin(ang) * 128)
		ctx.stroke()
		ctx.closePath()
	}
}

function reformPasses() {
	let input = document.getElementById("i").value
	let inputArr = input.split('\n')
	let passes = []
	for(var id = 0; id < inputArr.length; id++) {
		let inst = inputArr[id].split(' ')
		if(inst[0] == 'call' && !passes.includes(`func_${inst[1]}`))
			passes.push(`func_${inst[1]}`)
	}
	//console.log(passes)
	
	passElems = document.getElementById('passes').children
	
	for(let i = 0; i < passElems.length; i++) {
		elem = passElems[i]
		if(!(passes.includes(elem.id))) // удаляем текстовое поле если такого на добавление нету
			elem.remove()
		else
			passes[passes.findIndex(function (e) {return e == elem.id})] = undefined //удаляем из списка на создание если такой есть
	}
	passes.forEach(i => { //добовляем
		if(!i)
			return
		elem = document.createElement('textarea');
		elem.id = i;
		elem.style = "width:200px;height:200px";
		elem.placeholder = `print code of function "${i.slice(5)}" here...`;
		document.getElementById('passes').appendChild(elem)
	})
	
}

setInterval(() => redraw(), 500)