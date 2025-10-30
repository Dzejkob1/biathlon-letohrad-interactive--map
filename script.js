// Souřadnice pro Letohrad (přibližné centrum areálu)
const LETOHRAD_COORDS = [50.04229263166373, 16.515718020675035];
const INITIAL_ZOOM = 15;

// Inicializace mapy
const map = L.map('map').setView(LETOHRAD_COORDS, INITIAL_ZOOM);

// ------------------------------------------------------------------
// PODKLADOVÉ VRSTVY
// ------------------------------------------------------------------

// OpenStreetMap
const OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Ortofoto ČÚZK (WMS)
const Ortofoto_CUZK = L.tileLayer.wms('https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx?', {
  layers: 'GR_ORTFOTORGB',
  format: 'image/jpeg',
  version: '1.3.0',
  attribution: '&copy; <a href="https://geoportal.cuzk.cz/">ČÚZK</a>'
});
 
// ------------------------------------------------------------------
// VRSTVY A OVLÁDACÍ PANEL
// ------------------------------------------------------------------
const baseLayers = {
  "OSM - Klasická mapa": OpenStreetMap_Mapnik,
  "ČÚZK - Ortofoto": Ortofoto_CUZK
};

// Načtení GeoJSON vrstvy tratí z GitHubu
fetch('data/layers/trasy.geojson')
  .then(res => res.json())
  .then(data => {
    const trasyLayer = L.geoJSON(data, {
      style: {
        color: '#1565c0',   // modrá čára
        weight: 3,
        opacity: 0.8
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.nazev) {
          layer.bindPopup(`<strong>${feature.properties.nazev}</strong>`);
        }
      }
    });

    trasyLayer.addTo(map);
  })
  .catch(err => console.error('Chyba při načítání GeoJSON:', err));


// Výchozí vrstva
OpenStreetMap_Mapnik.addTo(map);

// Přepínač vrstev
L.control.layers(baseLayers, {}, { collapsed: false }).addTo(map);

// Testovací popup (volitelné)
L.marker(LETOHRAD_COORDS)
  .addTo(map)
  .bindPopup("<h2>Biatlonový areál Letohrad</h2><p>Centr mapy</p>");

