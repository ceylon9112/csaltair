import { FESTIVAL_MAP_IMAGE_PX } from '@/data/seed/mapImageAsset';

export function WebMapSvg() {
  return (
    <div style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${FESTIVAL_MAP_IMAGE_PX.width} / ${FESTIVAL_MAP_IMAGE_PX.height}`,
        }}>
        <img
          src="/jazz-fest-accessibility-map.png"
          alt="Jazz Fest map for people with disabilities — layout, stages, tents, accessibility legend, and walkways"
          width={FESTIVAL_MAP_IMAGE_PX.width}
          height={FESTIVAL_MAP_IMAGE_PX.height}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
        />
      </div>
      <p className="caption" style={{ marginTop: 8 }}>
        Official accessibility map image ({FESTIVAL_MAP_IMAGE_PX.width}×{FESTIVAL_MAP_IMAGE_PX.height}px). Use the list
        below for location details.
      </p>
    </div>
  );
}
