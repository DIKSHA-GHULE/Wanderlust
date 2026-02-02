// 1. Coordinates Logic (MongoDB [lng, lat] -> Leaflet [lat, lng])
let mapCoords = [19.0760, 72.8777]; // Default Mumbai agar data na mile

if (typeof coordinates !== "undefined" && coordinates.length === 2) {
    mapCoords = [coordinates[1], coordinates[0]]; //
}

// 2. Initialize Map (Zoom level 10 rakha hai jaise aapki image mein tha)
const map = L.map('map').setView(mapCoords, 10);

// 3. Tile Layer (OpenStreetMap tiles)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 4. Custom Red Icon (Mapbox red marker look ke liye)
const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


L.marker(mapCoords, { icon: redIcon })
    .addTo(map)
    .bindPopup(`
        <div style="text-align: center;">
            <h4 style="margin: 0; color: #fe424d;">${listingTitle}</h4>
            <p style="margin: 5px 0; font-weight: 500;">${listingLocation}</p>
            <small style="color: gray;">Exact location provided after booking</small>
        </div>
    `)
    .openPopup();