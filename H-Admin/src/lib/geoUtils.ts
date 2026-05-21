/**
 * Utilitaires pour l'export et la sauvegarde des données géographiques
 */

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'Circle';
    coordinates: [number, number];
    radius?: number;
  };
  properties: {
    name: string;
    type: string;
    radius?: number;
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  metadata: {
    exported_at: string;
    center: [number, number];
    count: number;
  };
}

/**
 * Envoyer les données au backend FastAPI
 * @param features - Tableau des features GeoJSON
 * @param apiEndpoint - URL du backend (ex: http://localhost:8000/api/map-zones)
 */
export async function sendToBackendAPI(
  features: GeoJSONFeature[],
  apiEndpoint: string
): Promise<{ success: boolean; message: string }> {
  try {
    const payload: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features,
      metadata: {
        exported_at: new Date().toISOString(),
        center: [-4.3224, 15.307],
        count: features.length,
      },
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      message: `${features.length} éléments sauvegardés au backend`,
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi au backend:', error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    };
  }
}

/**
 * Télécharger les données en JSON local
 * @param features - Tableau des features GeoJSON
 */
export function downloadGeoJSON(features: GeoJSONFeature[]): void {
  const data: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features,
    metadata: {
      exported_at: new Date().toISOString(),
      center: [-4.3224, 15.307],
      count: features.length,
    },
  };

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `zones-sanitaires-${new Date().toISOString().split('T')[0]}.geojson`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Charger les données depuis localStorage
 */
export function loadFromLocalStorage(key: string = 'map_data'): any[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return [];
  }
}

/**
 * Sauvegarder les données dans localStorage
 */
export function saveToLocalStorage(data: any[], key: string = 'map_data'): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error);
  }
}
