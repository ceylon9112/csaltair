/**
 * Pixel dimensions of `assets/images/jazz-fest-accessibility-map.png` (Jazz Fest map for people with disabilities).
 * Map screen shows this image only (no SVG overlays). `mapZones` remains for list/detail seeds elsewhere.
 */
export const FESTIVAL_MAP_IMAGE_PX = { width: 700, height: 583 } as const;

export const FESTIVAL_MAP_ASPECT_HEIGHT_OVER_WIDTH =
  FESTIVAL_MAP_IMAGE_PX.height / FESTIVAL_MAP_IMAGE_PX.width;
