import Carte from "mcutils/Carte";
import StoryMap from "mcutils/StoryMap";

import { api } from "../api";

/**
 * 
 * @param carte Carte dans laquelle charger la nouvelle carte
 * @param mapId Id de la carte
 * @returns Vrai si la carte est chargée, faux sinon
 */
export const loadMapFromMapId = async (
  carte: Carte,
  mapId: string,
): Promise<boolean> => {
  try {
    const metadataResponse = await api.map.getMapByViewId(mapId);
    if (metadataResponse.status !== 200) {
      return false;
    }

    const metadata = metadataResponse.data;
    carte.dispatchEvent("loading");

    const fileResponse = await api.map.getMapFileByViewId(metadata.view_id);
    if (fileResponse.status !== 200) {
      return false;
    }

    carte.getMap().getLayers().clear();
    carte.set("id", metadata.view_id);
    carte.read(fileResponse.data, metadata);
    return true;
  } catch (error) {
    console.error("Impossible de charger la carte", error);
    carte.dispatchEvent("error");
    return false;
  }
};

export const loadStoryMapFromMetadata = async (
  story: StoryMap,
  mapId: string,
): Promise<boolean> => {
  try {
    const metadataResponse = await api.map.getMapByViewId(mapId);
    if (metadataResponse.status !== 200) {
      return false;
    }

    const metadata = metadataResponse.data;
    story.dispatchEvent("read:start");

    const fileResponse = await api.map.getMapFileByViewId(metadata.view_id);
    if (fileResponse.status !== 200) {
      return false;
    }

    story.readData(fileResponse.data, metadata.view_id, metadata);
    return true;
  } catch (error) {
    console.error("Impossible de charger la story map", error);
    story.dispatchEvent("error");
    return false;
  }
};