import express from 'express'
import cors from 'cors'
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
const DATA_COUNT = 12;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const lineData = {
    labels: labels,
    datasets: [
      {
        label: 'Cubic interpolation (monotone)',
        data: datapoints,
        borderColor: '#ff0000',
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      }, {
        label: 'Cubic interpolation',
        data: datapoints,
        borderColor: '#00ff00',
        fill: false,
        tension: 0.4
      }, {
        label: 'Linear interpolation (default)',
        data: datapoints,
        borderColor: '#0000ff',
        fill: false
      }
    ]
  }

const barData = {
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10],
    },
  ],
}

const stats = {
    title: 'App visitor form AppStore',
    value: {
        value: 10964,
        valueMeasurement: '$',
        signOnTheLeft: false,
        valueSign: ''
    },
    delta: {
        value: 104,
        valueMeasurement: '',
        signOnTheLeft: true,
        valueSign: '+'
    }
}

// controllers

app.get('/stats', function (req, res) {
    res.json(stats);
})

app.get('/stats-slow', function (req, res) {
    setTimeout(() => {
        res.json(stats);
    }, 1500)
})

app.get('/charts-line', function (req, res) {
  setTimeout(() => {
    res.json(lineData);
  }, 1500)
})

app.get('/charts-bar-slow', function (req, res) {
  setTimeout(() => {
    res.json(barData);
  }, 5000)
})

app.get('/charts-bar', function (req, res) {
  res.json(barData);
})


/* error responses */
app.get('/stats-500', function (req, res) {
  res.status(500).send('Something broke!')
})

app.get('/stats-400', function (req, res) {
    res.status(400);
})



app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
