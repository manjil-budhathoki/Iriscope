import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Colors for different clusters
const CLUSTER_COLORS = ["hotpink", "cyan", "gold", "lime", "orange"];

// DataPoint component representing individual data points
function DataPoint({ position, color, cluster, opacity = 1 }) {
  const ref = useRef();
  
  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.2} 
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
}

// ClusterCenter component representing the centroid of a cluster
function ClusterCenter({ position, color, label, isActive }) {
  const ref = useRef();
  
  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={isActive ? 0.8 : 0.4} 
        wireframe={!isActive}
      />
      <Html center>
        <div className="text-xs font-semibold text-white bg-black/60 px-2 py-1 rounded">
          {label}
        </div>
      </Html>
    </mesh>
  );
}

// Generate random data points in 3D space
function generateRandomPoints(numPoints, range = 5) {
  return Array.from({ length: numPoints }, () => ({
    position: [
      (Math.random() * 2 - 1) * range,
      (Math.random() * 2 - 1) * range,
      (Math.random() * 2 - 1) * range
    ],
    cluster: null
  }));
}

// Generate initial cluster centers
function generateInitialCenters(k, range = 5) {
  return Array.from({ length: k }, (_, i) => ({
    position: [
      (Math.random() * 2 - 1) * range,
      (Math.random() * 2 - 1) * range,
      (Math.random() * 2 - 1) * range
    ],
    color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
    label: `Center ${i + 1}`
  }));
}

// Calculate Euclidean distance between two points in 3D
function calculateDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + 
    Math.pow(p1[1] - p2[1], 2) + 
    Math.pow(p1[2] - p2[2], 2)
  );
}

// Assign each point to nearest cluster
function assignPointsToClusters(points, centers) {
  return points.map(point => {
    const distances = centers.map((center, idx) => ({
      index: idx,
      distance: calculateDistance(point.position, center.position)
    }));
    
    // Find nearest center (replacing lodash's minBy)
    const nearestCenter = distances.reduce((min, current) => 
      current.distance < min.distance ? current : min
    , distances[0]);
    
    return {
      ...point,
      cluster: nearestCenter.index
    };
  });
}

// Calculate new center positions based on assigned points
function updateCenterPositions(points, centers) {
  return centers.map((center, centerIdx) => {
    const clusterPoints = points.filter(p => p.cluster === centerIdx);
    
    if (clusterPoints.length === 0) {
      return center;
    }
    
    // Calculate the average position of all points in this cluster
    const newPosition = [0, 0, 0];
    clusterPoints.forEach(point => {
      newPosition[0] += point.position[0];
      newPosition[1] += point.position[1];
      newPosition[2] += point.position[2];
    });
    
    newPosition[0] /= clusterPoints.length;
    newPosition[1] /= clusterPoints.length;
    newPosition[2] /= clusterPoints.length;
    
    return {
      ...center,
      position: newPosition
    };
  });
}

// Interpolate points to their new positions during animation
function interpolatePointPositions(points, targetPoints, progress) {
  return points.map((point, i) => ({
    ...point,
    position: [
      point.position[0] + (targetPoints[i].position[0] - point.position[0]) * progress,
      point.position[1] + (targetPoints[i].position[1] - point.position[1]) * progress,
      point.position[2] + (targetPoints[i].position[2] - point.position[2]) * progress
    ]
  }));
}

export default function KMeansSimulate() {
  // Simulation state
  const [numPoints, setNumPoints] = useState(100);
  const [k, setK] = useState(3);
  const [iteration, setIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(10);
  const [autoplay, setAutoplay] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(1);
  const [showTrajectories, setShowTrajectories] = useState(true);
  
  // Data state
  const [dataPoints, setDataPoints] = useState([]);
  const [prevDataPoints, setPrevDataPoints] = useState([]);
  const [clusterCenters, setClusterCenters] = useState([]);
  const [prevClusterCenters, setPrevClusterCenters] = useState([]);
  const [convergenceError, setConvergenceError] = useState(null);
  
  // Initialize simulation
  useEffect(() => {
    resetSimulation();
  }, [numPoints, k]);
  
  // Run autoplay timer
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      if (animationProgress < 1) {
        // Still animating, update progress
        setAnimationProgress(prev => Math.min(prev + 0.05, 1));
      } else {
        // Animation complete, proceed to next iteration
        runIteration();
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [autoplay, iteration, animationProgress]);
  
  // Reset the simulation with new random data
  const resetSimulation = () => {
    const points = generateRandomPoints(numPoints);
    const centers = generateInitialCenters(k);
    
    setDataPoints(points);
    setPrevDataPoints(points);
    setClusterCenters(centers);
    setPrevClusterCenters(centers);
    setIteration(0);
    setAnimationProgress(1);
    setConvergenceError(null);
  };
  
  // Run a single iteration of the K-means algorithm
  const runIteration = () => {
    if (iteration >= maxIterations) {
      setAutoplay(false);
      setConvergenceError("Max iterations reached");
      return;
    }
    
    // Save previous state for animation
    setPrevDataPoints([...dataPoints]);
    setPrevClusterCenters([...clusterCenters]);
    
    // Assign points to nearest clusters
    const assignedPoints = assignPointsToClusters(dataPoints, clusterCenters);
    
    // Calculate new center positions
    const newCenters = updateCenterPositions(assignedPoints, clusterCenters);
    
    // Check for convergence
    const centersMovement = newCenters.map((center, i) => 
      calculateDistance(center.position, clusterCenters[i].position)
    );
    
    const maxMovement = Math.max(...centersMovement);
    
    if (maxMovement < 0.01) {
      setConvergenceError("Converged");
      setAutoplay(false);
    }
    
    // Update state
    setDataPoints(assignedPoints);
    setClusterCenters(newCenters);
    setIteration(prev => prev + 1);
    setAnimationProgress(0); // Start animation
  };
  
  // Get current animated points based on progress
  const currentPoints = interpolatePointPositions(
    prevDataPoints, 
    dataPoints, 
    animationProgress
  );
  
  // Get animated centers based on progress
  const currentCenters = clusterCenters.map((center, i) => {
    if (!prevClusterCenters[i]) return center;
    
    return {
      ...center,
      position: [
        prevClusterCenters[i].position[0] + (center.position[0] - prevClusterCenters[i].position[0]) * animationProgress,
        prevClusterCenters[i].position[1] + (center.position[1] - prevClusterCenters[i].position[1]) * animationProgress,
        prevClusterCenters[i].position[2] + (center.position[2] - prevClusterCenters[i].position[2]) * animationProgress
      ]
    };
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0219] via-[#120926] to-[#0d051a] text-white flex flex-col items-center justify-start pt-8 pb-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-5xl font-bold text-center mb-4"
      >
        🎞️ Interactive K-Means Simulation
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-300 mb-4 max-w-xl text-center px-4"
      >
        Watch how data points cluster around centers in 3D space. Interact with the simulation by rotating, zooming, and changing parameters.
      </motion.p>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center mb-6 px-4">
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs">Points: {numPoints}</label>
            <input 
              type="range" 
              min="20" 
              max="300" 
              value={numPoints}
              onChange={(e) => setNumPoints(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs">Clusters: {k}</label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="bg-black/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs">Max Iterations:</label>
            <input 
              type="number" 
              min="1" 
              max="50" 
              value={maxIterations}
              onChange={(e) => setMaxIterations(parseInt(e.target.value))}
              className="w-12 bg-black/50 rounded px-1 text-xs"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-300">Iteration: {iteration}</label>
            {convergenceError && (
              <span className="text-xs px-2 py-0.5 bg-purple-800/50 rounded">
                {convergenceError}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            onClick={resetSimulation}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded"
          >
            Reset
          </button>
          
          <button 
            onClick={() => {
              if (animationProgress < 1) {
                setAnimationProgress(1);
              } else {
                runIteration();
              }
            }}
            disabled={convergenceError === "Converged"}
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded disabled:opacity-50"
          >
            Step
          </button>
          
          <button 
            onClick={() => setAutoplay(!autoplay)}
            className={`${
              autoplay ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white text-sm py-2 px-4 rounded`}
          >
            {autoplay ? 'Stop' : 'Play'}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showTrajectories"
            checked={showTrajectories}
            onChange={() => setShowTrajectories(!showTrajectories)}
          />
          <label htmlFor="showTrajectories" className="text-xs text-gray-300">
            Show Trajectories
          </label>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="w-full max-w-4xl h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-xl">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Stars radius={30} depth={60} count={3000} factor={7} fade speed={0.5} />
          
          {/* Render cluster centers */}
          {currentCenters.map((center, idx) => (
            <ClusterCenter 
              key={`center-${idx}`}
              position={center.position}
              color={center.color}
              label={center.label}
              isActive={true}
            />
          ))}
          
          {/* Render data points */}
          {currentPoints.map((point, idx) => (
            <DataPoint 
              key={`point-${idx}`}
              position={point.position}
              color={point.cluster !== null ? currentCenters[point.cluster].color : "white"}
              cluster={point.cluster}
              opacity={0.8}
            />
          ))}
          
          {/* Render trajectory lines */}
          {showTrajectories && iteration > 0 && dataPoints.map((point, idx) => {
            if (point.cluster === null || prevDataPoints[idx].cluster !== point.cluster) return null;
            
            return (
              <line key={`line-${idx}`}>
                <bufferGeometry attach="geometry">
                  <float32BufferAttribute 
                    attach="attributes-position" 
                    args={[new Float32Array([
                      ...prevDataPoints[idx].position,
                      ...point.position
                    ]), 3]} 
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  attach="material" 
                  color={currentCenters[point.cluster].color} 
                  opacity={0.3}
                  transparent
                  linewidth={1}
                />
              </line>
            );
          })}
          
          <OrbitControls enableZoom enablePan enableRotate />
        </Canvas>
      </div>
      
      {/* Legend */}
      <div className="mt-6 px-4 w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-2">Clusters Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentCenters.map((center, idx) => {
            const pointsInCluster = currentPoints.filter(p => p.cluster === idx).length;
            const percentage = (pointsInCluster / numPoints * 100).toFixed(1);
            
            return (
              <div key={`info-${idx}`} className="bg-black/20 p-3 rounded-lg border-l-4" style={{ borderColor: center.color }}>
                <div className="flex justify-between">
                  <span className="font-medium">{center.label}</span>
                  <span className="text-sm">{pointsInCluster} points ({percentage}%)</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Position: [{center.position[0].toFixed(2)}, {center.position[1].toFixed(2)}, {center.position[2].toFixed(2)}]
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 px-4 w-full max-w-4xl text-center">
        <h3 className="text-sm font-semibold mb-1 text-gray-300">How to use</h3>
        <p className="text-xs text-gray-400">
          Drag to rotate • Scroll to zoom • Reset to generate new data • 
          Step through iterations or Play for automatic simulation • 
          Adjust number of points and clusters
        </p>
      </div>
    </div>
  );
}