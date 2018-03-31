var yyy = document.getElementById('xxx')
var context = yyy.getContext('2d');

autoSetCanvasSize(yyy)

listenToUser(yyy)

var eraserEnabled = false
eraser.onclick = function () {
    eraserEnabled = true
    actions.className = 'actions x'

}
brush.onclick = function () {
    eraserEnabled = false
    actions.className = 'actions'
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
    context.fillstyle = 'black'
    // 圆心，半径，开始弧度，结束弧度，默认为顺时针false
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

// 画条线
function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    context.strokeStyle = 'black'
    context.moveTo(x1, y1) //起点
    context.lineWidth = 5 //线的宽度
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
        canvas.ontouchstart = function(aaa){
            console.log('开始摸我了')
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            console.log(x,y)
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

        canvas.ontouchmove = function(aaa){
            console.log('边摸边动')
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            console.log(x,y)
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

        canvas.ontouchend = function(){
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