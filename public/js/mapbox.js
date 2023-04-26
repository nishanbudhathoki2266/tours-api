/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmlzaGFuYnVkaGF0aG9raSIsImEiOiJjbGZmNXV6Z3MwMDBnNDZuYjNmcDg5cXU1In0.4t3mFigagsbCghwxmk6B-A';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nishanbudhathoki/clff7t2r900ii01mrjxo6ke97',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 4,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create a marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add a marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
