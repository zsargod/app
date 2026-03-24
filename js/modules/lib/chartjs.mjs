import * as chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/+esm';

const chartComponents = [
    // Controllers (Diagram típusok)
    chartjs.LineController,
    chartjs.BarController,
    chartjs.PieController,
    chartjs.DoughnutController,
    chartjs.RadarController,
    chartjs.PolarAreaController,
    chartjs.BubbleController,
    chartjs.ScatterController,

    // Elements (Grafikai alapkövek)
    chartjs.LineElement,
    chartjs.BarElement,
    chartjs.PointElement,
    chartjs.ArcElement,

    // Scales (Tengelytípusok)
    chartjs.LinearScale,
    chartjs.CategoryScale,
    chartjs.LogarithmicScale,
    chartjs.TimeScale,
    chartjs.TimeSeriesScale,
    chartjs.RadialLinearScale,

    // Plugins (Kiegészítők)
    chartjs.Legend,
    chartjs.Tooltip,
    chartjs.Title,
    //chartjs.Subtitle, 
    chartjs.Filler,
    chartjs.Decimation
]

chartjs.Chart.register(...chartComponents);

export default chartjs.Chart;