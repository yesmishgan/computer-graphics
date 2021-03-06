let canvas = document.getElementById('lab9');
let ctx = canvas.getContext('2d');

function line(ctx, x0, y0, x1, y1) {
    let delta = 2 * (y1 - y0);
    let eps = 0;
    let y = y0;
    let scale = 1;

    for (let x = x0; x < x1; x++) {
        if (eps >= (x1 - x0)) {
            y += 1;
            eps -= 2 * (x1 - x0);
        }
        eps += delta;
        ctx.fillRect(x * scale, y * scale, scale * 1, scale * 1);
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function fillTriangle(ctx, points, color) {
    ctx.fillStyle = color;
    let miny = points[0].y, maxy = points[0].y;
    for (let i = 1; i < points.length; i++) {
        if (points[i].y > maxy) maxy = points[i].y;
        if (points[i].y < miny) miny = points[i].y;
    }

    let yarray = [];
    for (let i = 0; i < points.length; i++) {
        let p = 0;
        if (i != points.length - 1) p = i + 1;
        let hi, lo;
        if (points[i].y > points[p].y) {
            hi = i;
            lo = p;
        } else if (points[i].y < points[p].y) {
            hi = p;
            lo = i;
        } else continue;

        if (points[hi].x == points[lo].x) {
            for (let j = points[lo].y; j < points[hi].y; j++) {
                if (typeof yarray[j] == 'undefined') yarray[j] = [];
                yarray[j].push(points[lo].x);
            }
        } else {
            let k = (points[hi].y - points[lo].y) /
                (points[hi].x - points[lo].x);
            for (let j = points[lo].y; j < points[hi].y; j++) {
                if (typeof yarray[j] == 'undefined') yarray[j] = [];
                yarray[j].push((j - points[lo].y) / k + points[lo].x);
            }
        }

    }


    let image_data = ctx.createImageData(500, 500);
    for (let y = miny; y < maxy; y++) {
        if (typeof (yarray[y]) == "undefined") {
            yarray[y] = [];
        }
        let xarray = yarray[y].sort(function (a, b) {
            return a - b;
        });
        for (let j = 0; j < xarray.length / 2; j++) {
            for (let x = xarray[j * 2]; x < xarray[j * 2 + 1]; x++) {
                ctx.fillRect(Math.floor(x), y, 1, 1);

                image_data.data[(y * 500 + Math.floor(x)) * 4 + 0] = 56;
                image_data.data[(y * 500 + Math.floor(x)) * 4 + 1] = 78;
                image_data.data[(y * 500 + Math.floor(x)) * 4 + 2] = 23;
                image_data.data[(y * 500 + Math.floor(x)) * 4 + 3] = 255;

            }
        }
    }
}

let diamond_v = [
    { x: 0, y: 0, z: 78 },
    { x: 45, y: 45, z: 0.0 },
    { x: 45, y: -45, z: 0.0 },
    { x: -45.0000, y: -45.0000, z: 0.0 },
    { x: -45.0000, y: 45.0000, z: 0.0 },
    { x: 0.0, y: 0.0, z: -78.0000 },
];

let diamond_f = [
    [1, 2, 3],
    [1, 3, 4],
    [1, 4, 5],
    [1, 5, 2],
];

let x_offset = canvas.width / 2, y_offset = canvas.height / 2;
let scale = 3;

let color_r = Math.random() * 200;
let color_g = Math.random() * 200;
let color_b = Math.random() * 200;
let color = "rgb(" + color_r + "," + color_g +
    "," + color_b + ")";

let light = { x: 0, y: -45, z: 38 };
let xO = 250, yO = 250, xScale = 200, yScale = 200;

let x;
let y;

let t = 10;
setInterval(
    function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        light.x = xScale * Math.cos(t);
        light.y = yScale * Math.sin(t);

        for (let f = 0; f < diamond_f.length; f++) {
            let points = [];
            let p0_idx = diamond_f[f][0];
            let p1_idx = diamond_f[f][1];
            let p2_idx = diamond_f[f][2];
            let vA = {
                x: diamond_v[p0_idx].x - diamond_v[p1_idx].x,
                y: diamond_v[p0_idx].y - diamond_v[p1_idx].y,
                z: diamond_v[p0_idx].z - diamond_v[p1_idx].z
            };
            let vB = {
                x: diamond_v[p2_idx].x - diamond_v[p1_idx].x,
                y: diamond_v[p2_idx].y - diamond_v[p1_idx].y,
                z: diamond_v[p2_idx].z - diamond_v[p1_idx].z
            };


            for (let i = 0; i < diamond_f[f].length; i++) {
                let index = diamond_f[f][i] - 1;
                points.push(new Point(scale * diamond_v[index].x + x_offset,
                    scale * diamond_v[index].y + y_offset));
            }

            let vN = { x: 0, y: 0, z: 1 };
            vN.y = (vB.x * vA.z - vB.z * vA.x) / (vB.y * vA.x - vB.x * vA.y);
            vN.x = -1 * (vA.z + vN.y * vA.y) / vA.x;
            if (vA.x === 0) {
                vN.x = (vB.y * vA.z - vB.z * vA.y) / (- vB.x * vA.y);
                vN.y = -1 * (vA.z) / vA.y;
            }

            let vL = {
                x: light.x - diamond_v[p1_idx].x,
                y: light.y - diamond_v[p1_idx].y,
                z: light.z - diamond_v[p1_idx].z
            };

            let cosa = (vN.x * vL.x + vN.y * vL.y + vN.z * vL.z) /
                Math.sqrt(vN.x * vN.x + vN.y * vN.y + vN.z * vN.z) /
                Math.sqrt(vL.x * vL.x + vL.y * vL.y + vL.z * vL.z)

            color = "rgb(" + color_r * cosa + "," + color_g * cosa +
                "," + color_b * cosa + ")";

            fillTriangle(ctx, points, color);
        }

        t += 0.05
    },
    10,
);