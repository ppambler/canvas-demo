var yyy = document.getElementById('xxx')
var context = yyy.getContext('2d');
var lineWidth = 5 //线的宽度




autoSetCanvasSize(yyy)

downloadImageBgc('#fff')

listenToUser(yyy)

var eraserEnabled = false
pen.onclick = function () {
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
eraser.onclick = function () {
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}

red.onclick = function () {
    context.fillStyle = 'red'
    context.strokeStyle = 'red'
    red.classList.add('active')
    green.classList.remove('active')
    blue.classList.remove('active')
}
green.onclick = function () {
    context.fillStyle = 'green'
    context.strokeStyle = 'green'
    red.classList.remove('active')
    green.classList.add('active')
    blue.classList.remove('active')
}
blue.onclick = function () {
    context.fillStyle = 'blue'
    context.strokeStyle = 'blue'
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.add('active')
}
// 画笔粗细
thin.onclick = function () {
    lineWidth = 5;
}
thick.onclick = function () {
    lineWidth = 8;
}

// 清屏
clear.onclick = function () {
    context.clearRect(0, 0, yyy.width, yyy.height);
}

//下载你画的画儿
download.onclick = function () {
    var url = yyy.toDataURL("image/png")
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = '我的画儿'
    a.target = '_blank'
    a.click()
}

//由于下载的是png格式的图，是透明的，如果你改为jpeg的话，那么背景即是黑色的
// 如何改为白色底
function downloadImageBgc(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, yyy.width, yyy.height);
}
// 封装好的函数

// 自适应画布大小
function autoSetCanvasSize(canvas) {
    setCanvasSize()

    // 当用户调整窗口大小时，会出现滚动条，所以需要监听。一旦用户改变窗口大小，就重新获取
    //视口的大小，不过也有个bug，你画的东西被清屏了
    window.onresize = function () {
        setCanvasSize()
    }
    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth
        var pageHeight = document.documentElement.clientHeight

        canvas.width = pageWidth
        canvas.height = pageHeight
    }
}

// 路径是没有线显示的
// 画个圆
function drawCircle(x, y, radius) {
    context.beginPath()
    // context.fillstyle = 'black'
    // 圆心，半径，开始弧度，结束弧度，默认为顺时针false
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

// 画条线
function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    // context.strokeStyle = 'black'
    context.moveTo(x1, y1) //起点
    context.lineWidth = lineWidth
    context.lineTo(x2, y2) //终点
    context.stroke()
    context.closePath()
}


//监听用户鼠标
function listenToUser(canvas) {
    var using = false
    var lastPoint = {
        x: undefined,
        y: undefined
    }
    // 特性检测，检测的不是设备
    if (document.body.ontouchstart !== undefined) {
        //触屏设备
        canvas.ontouchstart = function (aaa) {
            console.log('开始摸我了')
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            console.log(x, y)
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                lastPoint = {
                    "x": x,
                    "y": y
                }
            }
        }

        canvas.ontouchmove = function (aaa) {
            console.log('边摸边动')
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            console.log(x, y)
            if (!using) { return }

            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    "x": x,
                    "y": y
                }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }

        canvas.ontouchend = function () {
            console.log('摸完了')
            using = false
        }

    } else {
        // 非触屏设备
        // 鼠标按下
        canvas.onmousedown = function (aaa) {
            var x = aaa.clientX
            var y = aaa.clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10);
            } else {
                lastPoint = {
                    "x": x,
                    "y": y
                }
            }
        }

        // 鼠标滑动
        canvas.onmousemove = function (aaa) {
            var x = aaa.clientX
            var y = aaa.clientY

            if (!using) { return }

            if (eraserEnabled) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                var newPoint = {
                    "x": x,
                    "y": y
                }
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
                lastPoint = newPoint
            }
        }

        // 鼠标按下后松开触发
        canvas.onmouseup = function (aaa) {
            using = false
        }
    }

}