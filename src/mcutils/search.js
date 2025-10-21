
import SearchEngineAdvanced from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngineAdvanced";
import InseeAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/InseeAdvancedSearch";
import LocationAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/LocationAdvancedSearch";
import CoordinateAdvancedSearch from "geopf-extensions-openlayers/src/packages/Controls/SearchEngine/CoordinateAdvancedSearch";

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