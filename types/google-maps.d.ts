// types/google-maps.d.ts
// Add this file to your project to fix TypeScript errors

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: any);
    }

    class Geocoder {
      geocode(
        request: { location: { lat: number; lng: number } },
        callback: (results: any[], status: string) => void,
      ): void;
    }

    namespace places {
      enum PlacesServiceStatus {
        OK = "OK",
        ZERO_RESULTS = "ZERO_RESULTS",
        INVALID_REQUEST = "INVALID_REQUEST",
        OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
        REQUEST_DENIED = "REQUEST_DENIED",
        UNKNOWN_ERROR = "UNKNOWN_ERROR",
      }

      class AutocompleteService {
        getPlacePredictions(
          request: {
            input: string;
            componentRestrictions?: { country: string | string[] };
            types?: string[];
          },
          callback: (
            predictions: any[] | null,
            status: PlacesServiceStatus,
          ) => void,
        ): void;
      }

      class PlacesService {
        constructor(map: Map);
        getDetails(
          request: {
            placeId: string;
            fields?: string[];
          },
          callback: (place: any, status: PlacesServiceStatus) => void,
        ): void;
      }
    }
  }
}

export {};
