import * as THREE from "three";

/* Draw GeoJSON
Updated to support drawing particles (dots) within geometries for a 'tech' look.
*/

export function drawThreeGeo({ json, radius, materalOptions, isParticles = false }) {
  const container = new THREE.Object3D();
  container.rotation.x = -Math.PI * 0.5; 

  const x_values = [];
  const y_values = [];
  const z_values = [];
  const json_geom = createGeometryArray(json);

  let coordinate_array = [];
  
  for (let geom_num = 0; geom_num < json_geom.length; geom_num++) {
    const geom = json_geom[geom_num];

    if (geom.type === 'LineString') {
      processCoordinates(geom.coordinates);
      if (isParticles) drawParticles(x_values, y_values, z_values, materalOptions);
      else drawLine(x_values, y_values, z_values, materalOptions);

    } else if (geom.type === 'Polygon') {
      for (const segment of geom.coordinates) {
        processCoordinates(segment);
        if (isParticles) drawParticles(x_values, y_values, z_values, materalOptions);
        else drawLine(x_values, y_values, z_values, materalOptions);
      }

    } else if (geom.type === 'MultiLineString') {
      for (const segment of geom.coordinates) {
        processCoordinates(segment);
        if (isParticles) drawParticles(x_values, y_values, z_values, materalOptions);
        else drawLine(x_values, y_values, z_values, materalOptions);
      }

    } else if (geom.type === 'MultiPolygon') {
      for (const polygon of geom.coordinates) {
        for (const segment of polygon) {
          processCoordinates(segment);
          if (isParticles) drawParticles(x_values, y_values, z_values, materalOptions);
          else drawLine(x_values, y_values, z_values, materalOptions);
        }
      }
    }
  }

  function processCoordinates(feature) {
      coordinate_array = createCoordinateArray(feature);
      for (const point of coordinate_array) {
          convertToSphereCoords(point, radius);
      }
  }

  function createGeometryArray(json) {
    let geometry_array = [];
    if (json.type === 'Feature') {
      if (json.geometry) geometry_array.push(json.geometry);
    } else if (json.type === 'FeatureCollection') {
      for (const feature of json.features) {
        if (feature.geometry) geometry_array.push(feature.geometry);
      }
    } else if (json.type === 'GeometryCollection') {
      for (const geom of json.geometries) {
        geometry_array.push(geom);
      }
    } 
    return geometry_array;
  }

  function createCoordinateArray(feature) {
    const temp_array = [];
    for (let point_num = 0; point_num < feature.length; point_num++) {
      const point1 = feature[point_num];
      const point2 = feature[point_num - 1];

      if (point_num > 0 && needsInterpolation(point2, point1)) {
        let interpolation_array = interpolatePoints([point2, point1]);
        temp_array.push(...interpolation_array);
      } else {
        temp_array.push(point1);
      }
    }
    return temp_array;
  }

  function needsInterpolation(point2, point1) {
    const lon1 = point1[0];
    const lat1 = point1[1];
    const lon2 = point2[0];
    const lat2 = point2[1];
    const lon_distance = Math.abs(lon1 - lon2);
    const lat_distance = Math.abs(lat1 - lat2);
    return lon_distance > 5 || lat_distance > 5;
  }

  function interpolatePoints(interpolation_array) {
    let temp_array = [];
    for (let point_num = 0; point_num < interpolation_array.length - 1; point_num++) {
      const point1 = interpolation_array[point_num];
      const point2 = interpolation_array[point_num + 1];

      if (needsInterpolation(point2, point1)) {
        temp_array.push(point1);
        temp_array.push(getMidpoint(point1, point2));
      } else {
        temp_array.push(point1);
      }
    }
    temp_array.push(interpolation_array[interpolation_array.length - 1]);
    
    if (temp_array.length > interpolation_array.length) {
      temp_array = interpolatePoints(temp_array);
    } 
    return temp_array;
  }

  function getMidpoint(point1, point2) {
    const midpoint_lon = (point1[0] + point2[0]) / 2;
    const midpoint_lat = (point1[1] + point2[1]) / 2;
    return [midpoint_lon, midpoint_lat];
  }

  function convertToSphereCoords(coordinates_array, sphere_radius) {
    const lon = coordinates_array[0];
    const lat = coordinates_array[1];

    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    x_values.push(-(sphere_radius * Math.sin(phi) * Math.cos(theta)));
    y_values.push(sphere_radius * Math.sin(phi) * Math.sin(theta));
    z_values.push(sphere_radius * Math.cos(phi));
  }

  function drawLine(x_values, y_values, z_values, options) {
    const verts = [];
    for (let i = 0; i < x_values.length; i++) {
      verts.push(x_values[i], y_values[i], z_values[i]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    
    const material = new THREE.LineBasicMaterial({
        color: options.color || 0x64FFDA,
        linewidth: options.linewidth || 1,
        transparent: true,
        opacity: options.opacity || 1
    });

    const line = new THREE.Line(geometry, material);
    container.add(line);
    clearArrays();
  }

  // NEW: Function to draw dots (particles) instead of lines
  function drawParticles(x_values, y_values, z_values, options) {
    const verts = [];
    // Use every Nth point to avoid too many dots (performance)
    const step = 2; 
    for (let i = 0; i < x_values.length; i+=step) {
      verts.push(x_values[i], y_values[i], z_values[i]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    
    const material = new THREE.PointsMaterial({
        color: options.color || 0x64FFDA,
        size: options.size || 0.5, // Tiny dots
        transparent: true,
        opacity: options.opacity || 0.8,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    container.add(points);
    clearArrays();
  }

  function clearArrays() {
    x_values.length = 0;
    y_values.length = 0;
    z_values.length = 0;
  }

  return container;
}