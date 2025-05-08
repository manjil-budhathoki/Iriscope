export default function ProjectSummary() {
    return (
      <div className="group relative w-fit mx-auto my-10">
        <div className="text-xl font-semibold underline decoration-pink-500 cursor-pointer text-center">
          Hover to learn how this project works 💡
        </div>
        <div className="absolute w-[90vw] max-w-3xl mt-4 hidden group-hover:block bg-white text-gray-800 p-6 rounded-xl shadow-xl z-10 transition-all duration-500">
          <h3 className="text-2xl font-bold mb-2">🌸 Iris Insights — How It Works</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm leading-relaxed">
            <li>Python script (`iris_kmeans.py`) loads the Iris dataset</li>
            <li>Applies PCA to reduce to 2D features</li>
            <li>Trains a KMeans clustering model with 3 clusters</li>
            <li>Exports the results as `cluster_data.json` for frontend</li>
            <li>React app loads this JSON, plots it using Chart.js</li>
            <li>Chart includes download, tooltips, and cluster info</li>
            <li>Everything styled with TailwindCSS and fully responsive</li>
          </ul>
        </div>
      </div>
    );
  }
  