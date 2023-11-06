// const { default: Colours } = require("./colours")

const canvas = document.getElementById('myCanvas')

const height = window.innerHeight * 0.75
const width = window.innerWidth * 0.75
const maxTreeDepth = 10

canvas.height = height
canvas.width = width

let darkMode = true

const ctx = canvas.getContext('2d')
ctx.strokeStyle = darkMode ? 'white' : 'black' //Colours.white : Colours.black
var checkBox = document.getElementById('bidirectionalCheck')

let startPoint = null
let trees = []

function mobileAndTabletCheck() {
	let check = false
	;(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true
	})(navigator.userAgent || navigator.vendor || window.opera)
	return check
}

function draw() {
	ctx.fillStyle = '#303030'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < trees.length; i++) {
		drawTree(trees[i])
	}
}

function drawTree(t) {
	if (!t) return
	drawLine(t.point1, t.point2)
	for (let i = 0; i < t.branches.length; i++) {
		drawTree(t.branches[i])
	}
}

function drawLine(point1, point2) {
	ctx.beginPath()
	ctx.moveTo(point1.x, point1.y)
	ctx.lineTo(point2.x, point2.y)
	ctx.stroke()
}

function getMousePosition(c, event) {
	let rect = c.getBoundingClientRect()
	let x = event.clientX - rect.left
	let y = event.clientY - rect.top

	return { x, y }
}

function createBranch(point1, point2, direction = 1) {
	const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) + Math.random() * (Math.PI / 4) * direction

	const length = Math.hypot(point2.x - point1.x, point2.y - point1.y) * 0.8

	const x = length * Math.cos(angle)
	const y = length * Math.sin(angle)
	const point3 = { x: point2.x + x, y: point2.y + y }

	let branch = { point1: point2, point2: point3, branches: [] }
	drawLine(point2, point3)
	return branch
}

function addTree(startPoint, endPoint) {
	tree1 = { point1: startPoint, point2: endPoint, branches: [] }
	trees.push(tree1)

	if (checkBox.checked == true) {
		tree2 = { point2: startPoint, point1: endPoint, branches: [] }
		trees.push(tree2)
	}
}

function growTree(t, depth = 0) {
	if (!t) return
	if (depth >= maxTreeDepth) return t

	if (t.branches.length === 0) {
		let branches = []
		branches.push(createBranch(t.point1, t.point2))
		branches.push(createBranch(t.point1, t.point2, -1))

		let treeAddition = { point1: t.point1, point2: t.point2, branches }
		return treeAddition
	} else {
		let newBranches = []
		for (let i = 0; i < t.branches.length; i++) {
			newBranches.push(growTree(t.branches[i], depth + 1))
		}
		return { point1: t.point1, point2: t.point2, branches: newBranches }
	}
}

function growTrees() {
	if (trees.length === 0) return
	for (let i = 0; i < trees.length; i++) {
		trees[i] = growTree(trees[i])
	}
}

canvas.addEventListener('mousedown', function (e) {
	mousePos = getMousePosition(canvas, e)

	if (startPoint) {
		addTree(startPoint, mousePos)
		if(mobileAndTabletCheck())
		draw()
		startPoint = null
		return
	} else {
		startPoint = mousePos
		return
	}
})

canvas.addEventListener('mouseup', function (e) {
	if (!startPoint) return
	if(mobileAndTabletCheck()) return

	//Mouse hasn't moved, so don't draw a line
	if (startPoint.x === mousePos.x && startPoint.y === mousePos.y) return

	addTree(startPoint, mousePos)
	startPoint = null
})

canvas.addEventListener('mousemove', function (e) {
	if(mobileAndTabletCheck()) return
	if (startPoint) {
		draw()
		mousePos = getMousePosition(canvas, e)
		drawLine(startPoint, mousePos)
	}
})

document.body.onkeyup = function (e) {
	if (e.key == ' ' || e.code == 'Space' || e.keyCode == 32) {
		growTrees()
	}
}

const clearBtn = document.getElementById('clearBtn')
clearBtn.onclick = function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	startPoint = null
	tree = null
	trees = []
}

const growBtn = document.getElementById('growBtn')
growBtn.onclick = function () {
	growTrees()
}

const downloadBtn = document.getElementById('downloadBtn')
downloadBtn.onclick = function () {
	// Create an image element
	const image = new Image()

	// Assign the canvas content as the source of the image
	image.src = canvas.toDataURL()

	// Create a temporary link element to download the image
	const link = document.createElement('a')
	link.href = image.src
	link.download = 'tree.png'

	// Trigger the link programmatically to start the download
	link.click()
}
