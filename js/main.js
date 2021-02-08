var canvas;
var center_x = 100;
var center_y = 100;
var gunit = 1;
var unitSize = 36;
var unit_point = 2;
var msg = "";

var x = 0, y = 0;
var oldy = 0;

var funcs = [];

var ctx;

function start() {
    ctx = canvas.getContext("2d");
}

function ToString(n, p) {
    n = n + "";
    if (n.indexOf(".") < 0) {
        n += ".";
    }
    for (var i = 0; i < p; i++) {
        n += "0";
    }
    var m = -1; 
    for (var i = 0; i < n.length; i++) {
        if (n.charAt(i) == '.') {
            m = 0;
        }
        if (m >= 0) {
            m += 1;
        }
    }
    return n.substring(0, n.length - (m - p - 1));
}

function update() {
    msg = "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#acacac";
    ctx.beginPath();
    ctx.moveTo(0, center_y);
    ctx.lineTo(canvas.width, center_y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(center_x, 0);
    ctx.lineTo(center_x, canvas.height);
    ctx.stroke();
    for (var i = 1; ; i++) {
        var xx = i * unitSize + center_x;
        if (xx >= canvas.width) break;
        ctx.beginPath();
        ctx.moveTo(xx, center_y);
        ctx.lineTo(xx, center_y - 5);
        ctx.stroke();
        ctx.fillText(ToString(i * gunit, unit_point), xx, center_y + unitSize / 2);
    }
    for (var i = -1; ; i--) {
        var xx = i * unitSize + center_x;
        if (xx < 0) break;
        ctx.beginPath();
        ctx.moveTo(xx, center_y);
        ctx.lineTo(xx, center_y - 5);
        ctx.stroke();
        ctx.fillText(ToString(i * gunit, unit_point), xx, center_y + unitSize / 2);
    }
    for (var i = 1; ; i++) {
        var yy = i * unitSize + center_y;
        if (yy >= canvas.height) break;
        ctx.beginPath();
        ctx.moveTo(center_x, yy);
        ctx.lineTo(center_x + 5, yy);
        ctx.stroke();
        ctx.fillText(ToString(i * gunit, unit_point), center_x + unitSize / 2, yy);
    }
    for (var i = -1; ; i--) {
        var yy = i * unitSize + center_y;
        if (yy < 0) break;
        ctx.beginPath();
        ctx.moveTo(center_x, yy);
        ctx.lineTo(center_x + 5, yy);
        ctx.stroke();
        ctx.fillText(ToString(i * gunit, unit_point), center_x + unitSize / 2, yy);
    }

    for (var i = 0; i < funcs.length; i++) {
        var f = funcs[i][0];
        var c = (funcs[i][1] && funcs[i][2]) ? funcs[i][1] : "#acacac";
        y = center_y;
        oldy = center_y;
        drawIt(f, c, funcs, i);
    }
}



function drawIt(f, c, fs, thisi) {
    var first = true;
    var pxl = gunit / unitSize;
    
    var suc = true;
    for (var xx = 0; xx < canvas.width; xx++) {
        x = (xx - center_x) / unitSize * gunit;
        var yy = 0;
        
        try {
            var realy = eval(f);
            yy = center_y - (realy / gunit * unitSize);
            try {
                for (var i = thisi; i < fs.length; i++) {
                    if (i != thisi && fs[thisi][2] && fs[i][2]) {
                        var realx = x;
                        var x1 = x;
                        var x2 = x + pxl;
                        x = x1;
                        var cy1 = eval(f);
                        var dy1 = eval(fs[i][0]);
                        x = x2;
                        var cy2 = eval(f);
                        var dy2 = eval(fs[i][0]);

                        var aa1 = (cy1 - cy2) / (x1 - x2);
                        var bb1 = cy1 - aa1 * x1;

                        var aa2 = (dy1 - dy2) / (x1 - x2);
                        var bb2 = dy1 - aa2 * x1;

                        var c_x = (bb2 - bb1) / (aa1 - aa2);
                        var c_y = aa1 * c_x + bb1;

                        if (c_x > x1 && c_x <= x2) {
                            var pos = [center_x + c_x / gunit * unitSize, center_y - c_y / gunit * unitSize];
                            ctx.fillRect(pos[0] - 1, pos[1] - 1, 3, 3);
                            ctx.fillText("( " + ToString(c_x, unit_point) + " , " + ToString(c_y, unit_point) + " )", pos[0] + unitSize / gunit / 4, pos[1] + unitSize / gunit / 4);
                        }


                    }
                }
                // ctx.fillRect(xx - 1, yy - 1, 2, 2);
            } catch {}
            y = realy;
            x = realx;
        } catch {
            y = center_y;
            suc = false;
        }
        

        ctx.strokeStyle = c;
        /*if (first) {
            first = false;
            ctx.moveTo(xx, yy);
        } else {
            ctx.lineTo(xx, yy);
        }
        */
        if (xx > 0 && (yy < canvas.height && yy >= 0) || (oldy < canvas.height && oldy >= 0)) {
            ctx.beginPath();
            ctx.moveTo(xx - 1, oldy);
            ctx.lineTo(xx, yy);
            ctx.stroke();
            oldy = yy;
            if (fs[thisi][3] == 1) {
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.moveTo(xx, yy - canvas.height / 4);
                ctx.lineTo(xx, yy);
                ctx.stroke();
            }
            if (fs[thisi][3] == -1) {
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.moveTo(xx, yy + canvas.height / 4);
                ctx.lineTo(xx, yy);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
    }
    msg += "function (" + thisi + ") " + (suc ? "DONE" : "ERROR") + "\n";
}