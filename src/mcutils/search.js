
import SearchEngineAdvanced from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngineAdvanced.js";
import InseeAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/InseeAdvancedSearch.js";
import LocationAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/LocationAdvancedSearch.js";
import CoordinateAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/CoordinateAdvancedSearch.js";

const insee = new InseeAdvancedSearch({
})

const location = new LocationAdvancedSearch({
})

const coordinates = new CoordinateAdvancedSearch({
})

let search = new SearchEngineAdvanced({
  advancedSearch: [insee, location, coordinates],
  returnTrueGeometry: true,
})

export default search;