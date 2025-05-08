import { Scatter } from 'react-chartjs-2';
import { useEffect, useState, useRef } from 'react';
import 'chart.js/auto';
import { Download, Eye, EyeOff, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';

Chart.register(zoomPlugin);

const CLUSTER_COLORS = ['#EF476F', '#118AB2', '#FFD166'];
const CENTER_COLORS = ['#ffffff', '#00FFAA', '#FF66CC']; // Fixed colors for centers

export default function ClusterChart() {
  const [dataPoints, setDataPoints] = useState([]);
  const [centers, setCenters] = useState([]);
  const [showCenters, setShowCenters] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch('/cluster_data.json')
      .then((res) => res.json())
      .then((data) => {
        setDataPoints(data);

        const grouped = d3.group(data, (d) => d.cluster);
        const centerPoints = Array.from(grouped).map(([cluster, points]) => {
          const avgX = d3.mean(points, (d) => d.x);
          const avgY = d3.mean(points, (d) => d.y);
          return { x: avgX, y: avgY, cluster: parseInt(cluster) };
        });
        setCenters(centerPoints);
      });
  }, []);

  const clusters = [0, 1, 2].map((cluster) => ({
    label: `Cluster ${cluster + 1}`,
    data: dataPoints.filter((d) => d.cluster === cluster),
    backgroundColor: CLUSTER_COLORS[cluster],
    pointRadius: 5,
    pointHoverRadius: 7,
    showLine: false,
  }));

  const centerDots = centers.map((center, index) => ({
    label: `Center ${index + 1}`,
    data: [center],
    backgroundColor: CENTER_COLORS[index % CENTER_COLORS.length],
    borderColor: '#ffffff',
    pointStyle: 'rectRot',
    pointRadius: 10,
    borderWidth: 2,
    pointHoverRadius: 14,
  }));

  const downloadChart = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas;
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = canvas.width;
    bgCanvas.height = canvas.height;

    const ctx = bgCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const base64Image = bgCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = base64Image;
    a.download = 'iris_clusters.png';
    a.click();
  };

  const handleZoomReset = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="h-[400px] md:h-[500px]">
        <Scatter
          ref={chartRef}
          data={{
            datasets: [...clusters, ...(showCenters ? centerDots : [])],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: 'easeOutQuart',
            },
            plugins: {
              legend: { position: 'bottom' },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: (x: ${ctx.raw.x.toFixed(2)}, y: ${ctx.raw.y.toFixed(2)})`,
                },
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'xy',
                },
                zoom: {
                  wheel: { enabled: true },
                  pinch: { enabled: true },
                  mode: 'xy',
                },
                limits: {
                  x: { min: -5, max: 10 },
                  y: { min: -5, max: 10 },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'PCA 1',
                  font: { size: 14, weight: 'bold' },
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'PCA 2',
                  font: { size: 14, weight: 'bold' },
                },
              },
            },
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={downloadChart}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-md transition-all"
        >
          <Download size={18} /> Download Chart
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowCenters(!showCenters)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-full font-medium transition"
        >
          {showCenters ? <EyeOff size={18} /> : <Eye size={18} />}
          {showCenters ? 'Hide Centers' : 'Show Centers'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleZoomReset}
          className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-5 py-2 rounded-full font-medium transition"
        >
          <Maximize2 size={18} /> Reset Zoom
        </motion.button>
      </div>
    </motion.div>
  );
}
