//Cargamos mapa base es la clase principal de Leafleft. Indicamos las coordenadas iniciales y el nivel de zoom por defecto.
    let map = L.map('map', {
    center:[-34.6083, -58.3712],
    zoom: 10
    })

//Añadimos una capa (layer) con el mapa. En este caso usamos las imágenes (tiles) de OpenStreetMap (OSM)
let osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
}).addTo(map);


//Añadimos el GeoJson nombrado "asentamientos"
L.geoJson(asentamientos).addTo(map);

//Agregamos la escala
L.control.scale().addTo(map);

//Función con el estilo de cada uno de los "features" de la capa GeoJSON.
    function style(feature) {											
        return {
        fillColor: '#54278f',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
         };
        }
//Aquí creamos una capa de tipo GeoJSON, donde le indicamos el estilo 
        L.geoJson(asentamientos, {style: style}).addTo(map);

//Funcion de interaccion con el ususario: las zonas coloreadas se resalten visualmente 
//de alguna manera cuando se desplazan con el mouse
        function highlightFeature(e) {
            let layer = e.target;

            layer.setStyle({
            weight: 2,
            color: '#666', //establecemos un borde gris grueso en la capa como nuestro efecto de resaltado
            dashArray: '',
            fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();//y también lo llevamos al frente para que el borde no choque con los estados cercanos
            }
        }
//Función que define  lo que sucede en mouseout:
        function resetHighlight(e) {
        geojson.resetStyle(e.target); //método que restablecerá el estilo de la capa a su estado predeterminado
        }
//Asegurarse que la capa GJ sea accesible asignandola a una variable
        let geojson;
        geojson = L.geoJson(asentamientos);
//Funcion que hace que las zonas coloreadas se destaquen muy bien al pasar el mouse sobre ellos
        function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
        }
//Funcion que al hacer click en el mapa se veran los NOMBRES de las zonas en una ventana emergente           
        function popup(feature, layer) { 
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
                }); 
                if (feature.properties && feature.properties.NOMBRE) {
                     
                layer.bindPopup(feature.properties.NOMBRE);
                
                } 
                    }
            
        geojson = L.geoJson(asentamientos, {
        style: style, onEachFeature: popup
        }).addTo(map);

        //Control de leyenda personalizado y título 

        let legend = L.control();

        legend.onAdd = function () {
            this._div = L.DomUtil.create('div','legend'); // crea un div con la clase "legend"
            this.update();
            return this._div;
        };
        
        
        legend.update = function () {
            this._div.innerHTML = '<h4> Villas y Asentamientos en CABA y GBA  </h4>' + '<h5> Haz click en la zona coloreada </h5>';
        };
        legend.addTo(map);

        