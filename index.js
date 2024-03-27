const canvasQ = document.getElementById("canvasQ").getContext("2d");
const canvasI = document.getElementById("canvasI").getContext("2d");
const canvasU = document.getElementById("canvasU").getContext("2d");

let plotQ = undefined;
let plotI = undefined;
let plotU = undefined;

const setup = () => {
  plotQ = new Chart(canvasQ, {
    type: "line",
    data: { datasets: [] },
  });
  plotI = new Chart(canvasI, {
    type: "line",
    data: { datasets: [] },
  });
  plotU = new Chart(canvasU, {
    type: "line",
    data: { datasets: [] },
  });

  const [l, r, c, q0, phi0] = [1, 1, 1, 1, 0];

  document.getElementById("l").value = l;
  document.getElementById("r").value = r;
  document.getElementById("c").value = c;
  document.getElementById("q0").value = q0;
  document.getElementById("phi0").value = phi0;
  make_all_plots(make_data(l, r, c, q0, phi0));
}

const make_plot = (data, canvas, label, ytext) => {
  return new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: label,
          borderColor: "rgba(66, 200, 222, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "t, c" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: ytext }
        }
      },
      layout: {
        padding: 50,
      },
    }
  });
}

const make_plot_u = (ur, ul, uc, uu) => {
  return new Chart(canvasU, {
    type: "line",
    data: {
      datasets: [
        {
          label: "U_r (t)",
          borderColor: "rgba(180, 250, 27, .8)",
          data: ur,
          lineTension: 0.4,
          pointRadius: 0
        },
        {
          label: "U_l (t)",
          borderColor: "rgba(55, 123, 18, .8)",
          data: ul,
          lineTension: 0.4,
          pointRadius: 0
        },
        {
          label: "U_c (t)",
          borderColor: "rgba(180, 13, 111, .8)",
          data: uc,
          lineTension: 0.4,
          pointRadius: 0
        },
        {
          label: "U_o (t)",
          borderColor: "rgba(66, 200, 222, .8)",
          data: uu,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "t, c" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "U, В" }
        }
      },
      layout: {
        padding: 50,
      },
    }
  });
}

const make_all_plots = (data) => {
  plotQ.destroy();
  plotI.destroy();
  plotU.destroy();

  plotQ = make_plot(data.q, canvasQ, "q (t)", "q, Кл");
  plotI = make_plot(data.i, canvasI, "I (t)", "I, A");
  plotU = make_plot_u(data.ur, data.ul, data.uc, data.uu);
}

const make_data = (l, r, c, q0, phi0) => {
  const result = { q: [], i: [], ur: [], ul: [], uc: [], uu: [] };

  const beta = r / (2 * l);
  const omega0 = Math.sqrt(1 / (l * c));
  const omega = Math.sqrt(omega0 * omega0 - beta * beta);

  if (isNaN(omega)) {
    alert("Некорректный ввод: omega < 0.")
    return;
  }

  const right_border = Math.log(0.01 / q0) / (-beta);
  const step = right_border / 1000;

  for (let t = 0; t < right_border; t += step) {
    const q = q0 * Math.exp(-beta * t) * Math.cos(omega * t + phi0);
    const i = q0 * (-Math.exp(-beta * t)) * (beta * Math.cos(omega * t + phi0) + omega * Math.sin(omega * t + phi0));
    const x_l = omega * l;

    const uc = q / c;
    const ur = i * r;
    const ul = i * x_l;

    result.q.push({ x: t, y: q });
    result.i.push({ x: t, y: i });
    result.uc.push({ x: t, y: uc });
    result.ur.push({ x: t, y: ur });
    result.ul.push({ x: t, y: ul });
    result.uu.push({ x: t, y: uc + ur + ul });
  }

  return result;
}

const parse_input = () => {
  return [
    parseFloat(document.getElementById("l").value),
    parseFloat(document.getElementById("r").value),
    parseFloat(document.getElementById("c").value),
    parseFloat(document.getElementById("q0").value),
    parseFloat(document.getElementById("phi0").value),
  ]
}

const run = () => {
  const [l, r, c, q0, phi0] = parse_input();
  if (isNaN(l) || isNaN(r) || isNaN(c) || isNaN(q0) || isNaN(phi0)) {
    alert("Некорретный ввод!");
    return;
  }
  if (l <= 0 || r <= 0 || c <= 0 || q0 <= 0) {
    alert("Некорретный ввод!");
    return;
  }
  make_all_plots(make_data(l, r, c, q0, phi0));
}
