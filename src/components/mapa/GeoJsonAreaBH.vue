<template>
  <div>
    <l-geo-json :geojson="geojson" :options="geojsonOptions"></l-geo-json>
    <l-marker v-for="(m, idx) in markers" :lat-lng="m" :key="idx" />
    <l-marker v-if="markerP" :lat-lng="markerP" />
    <textarea v-model="textarea"></textarea>
  </div>
</template>

<script>
import GeometryUtil from "leaflet-geometryutil";
import { latLngBounds } from "leaflet";
import { LGeoJson, LMarker } from "vue2-leaflet";
import { getParadasProximas } from "@/services/onibusbh-api-gateway";

export default {
  name: "GeoJsonAreaBH",

  components: {
    LGeoJson,
    LMarker
  },

  data: () => ({
    geojson: null,
    markerP: null,
    textarea: "",
    geojsonOptions: {
      style: {
        color: "#3F51B5",
        weight: 3,
        opacity: 0.65,
        fill: false
      }
    }
  }),

  computed: {
    geojsonBounds() {
      if (!this.geojson) {
        return null;
      }
      const geojsonBounds = latLngBounds(
        this.geojson.features[0].geometry.coordinates[0].map(c => [c[1], c[0]])
      );
      return geojsonBounds;
    },
    markers() {
      if (!this.geojsonBounds) {
        return [];
      }
      const northWest = this.geojsonBounds.getNorthWest(); // Noroeste
      const northEast = this.geojsonBounds.getNorthEast(); // Nordeste
      const southWest = this.geojsonBounds.getSouthWest(); // Sudoeste
      const southEast = this.geojsonBounds.getSouthEast(); // Sudeste
      return [northWest, northEast, southWest, southEast];
    }
  },

  async created() {
    /** @typedef {object} AreaBeloHorizonteGeoJson
     * @property {string} type
     * @property {object[]} features
     * @property {string} features.type
     * @property {object} features.geometry
     * @property {string} features.geometry.type
     * @property {array[]|number[]} features.geometry.coordinates
     * @property {object} features.properties
     * @property {string} features.properties.codarea
     */

    const areaBHRes = await fetch("/geojson/area-belohorizonte.geojson");
    /** @type {AreaBeloHorizonteGeoJson} */
    const areaBH = await areaBHRes.json();
    Object.freeze(areaBH);
    this.geojson = areaBH;

    this.ready();
  },

  methods: {
    async ready() {
      console.debug("ready");
      return;

      // https://stackoverflow.com/questions/48085877/leaflet-create-a-marker-with-latlon-distance-meter-angle-degree
      const angleInDegrees = 90;
      // const radiusInKm = 10; // radiusInKm * 1000
      const northWest = this.geojsonBounds.getNorthWest(); // Noroeste
      const southEast = this.geojsonBounds.getSouthEast(); // Sudeste

      let radiusInMeters = 0;
      let initPoint = northWest;

      // const intervalUpdate = setInterval(() => {
      //   const p = GeometryUtil.destination(initPoint, angleInDegrees, radiusInMeters);
      //   this.markerP = Object.freeze(p);
      //   radiusInMeters += 500;

      //   if (p.lng > southEast.lng) {
      //     initPoint = GeometryUtil.destination(initPoint, 180, 500);
      //     radiusInMeters = 0;
      //   }

      //   if (p.lat < southEast.lat) {
      //     clearInterval(intervalUpdate);
      //     console.debug("FIM");
      //   }
      // }, 1);

      // this.$once("hook:beforeDestroy", () => clearInterval(intervalUpdate));

      const pontos = [];

      console.debug("Inicio");
      while (true) {
        const p = GeometryUtil.destination(initPoint, angleInDegrees, radiusInMeters);
        this.markerP = Object.freeze(p);
        radiusInMeters += 250;

        if (p.lng > southEast.lng) {
          initPoint = GeometryUtil.destination(initPoint, 180, 250);
          radiusInMeters = 0;
        }

        if (p.lat < southEast.lat) {
          // clearInterval(intervalUpdate);
          console.debug("FIM");
          break;
        }

        // await getParadasProximas(p.lat, p.lng);
        pontos.push(p);
      }

      console.debug({ pontos });

      const proms = pontos.map(p => async () => await getParadasProximas(p.lat, p.lng));
      console.debug({ proms });

      let stopLoop = false;
      this.$once("hook:beforeDestroy", () => {
        console.debug("stopLoop");
        stopLoop = true;
      });
      const paradas = [];
      while (proms.length && !stopLoop) {
        console.debug("restam", proms.length);
        // 100 at a time
        try {
          const ress = await Promise.all(proms.slice(0, 100).map(f => f()));
          paradas.push(...ress);
          proms.splice(0, 100);
        } catch (error) {
          console.debug(error);
        }
      }

      console.debug("fim", paradas);
      this.textarea = JSON.stringify({ paradas }, null, 2);
    }
  }
};
</script>
