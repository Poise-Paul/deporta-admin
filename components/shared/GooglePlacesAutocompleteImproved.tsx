import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceResult {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface Prediction {
  description: string;
  place_id: string;
}

interface GooglePlacesAutocompleteEnhancedProps {
  apiKey: string;
  value: string;
  onPlaceSelect: (place: PlaceResult) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  country?: string;
  showCurrentLocation?: boolean;
}

// Global flag to track if script is loading
let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // If already loading, return existing promise
  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  // Check if already loaded
  if (typeof window !== "undefined" && window.google?.maps?.places) {
    return Promise.resolve();
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]',
    );

    if (existingScript) {
      // Script exists, wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.google?.maps?.places) {
          resolve();
        } else {
          reject(new Error("Google Maps script load timeout"));
        }
      }, 10000);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback
    (window as any).initGoogleMaps = () => {
      delete (window as any).initGoogleMaps;
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export default function GooglePlacesAutocompleteEnhanced({
  apiKey,
  value,
  onPlaceSelect,
  onChange,
  placeholder = "Search for a location...",
  label = "Location",
  className,
  country = "ng",
  showCurrentLocation = true,
}: GooglePlacesAutocompleteEnhancedProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) {
      setLoadError("Google Maps API key is missing");
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        setScriptLoaded(true);
        setLoadError(null);
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
        setLoadError("Failed to load Google Maps");
      });
  }, [apiKey]);

  // Initialize services
  useEffect(() => {
    if (
      !scriptLoaded ||
      typeof window === "undefined" ||
      !window.google?.maps?.places
    )
      return;

    try {
      autocompleteServiceRef.current =
        new google.maps.places.AutocompleteService();

      const mapDiv = document.createElement("div");
      const map = new google.maps.Map(mapDiv);
      placesServiceRef.current = new google.maps.places.PlacesService(map);
    } catch (error) {
      console.error("Error initializing Google services:", error);
      setLoadError("Failed to initialize location services");
    }
  }, [scriptLoaded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch predictions
  const fetchPredictions = (input: string) => {
    if (
      !input ||
      !autocompleteServiceRef.current ||
      !window.google?.maps?.places
    ) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country },
          types: ["geocode", "establishment"],
        },
        (predictions, status) => {
          setIsLoading(false);

          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(
              predictions.map((p) => ({
                description: p.description,
                place_id: p.place_id,
              })),
            );
            setShowDropdown(true);
          } else {
            setPredictions([]);
          }
        },
      );
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setIsLoading(false);
      setPredictions([]);
    }
  };

  // Get place details
  const getPlaceDetails = (placeId: string) => {
    if (!placesServiceRef.current || !window.google?.maps?.places) return;

    setIsLoading(true);

    try {
      placesServiceRef.current.getDetails(
        {
          placeId,
          fields: [
            "geometry",
            "formatted_address",
            "name",
            "address_components",
          ], // Added address_components
        },
        (place, status) => {
          setIsLoading(false);

          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            // Parse address components
            const addressComponents = place.address_components || [];

            let area = "";
            let city = "";
            let state = "";
            let country = "";
            let postalCode = "";

            addressComponents.forEach((component: any) => {
              const types = component.types;

              // Sublocality level 1 or neighborhood (e.g., "Lekki", "Ajah")
              if (
                types.includes("sublocality_level_1") ||
                types.includes("sublocality")
              ) {
                area = component.long_name;
              }
              // Neighborhood (more specific area)
              else if (types.includes("neighborhood") && !area) {
                area = component.long_name;
              }
              // Locality (city/town - e.g., "Lagos", "Abuja")
              else if (types.includes("locality")) {
                city = component.long_name;
              }
              // Administrative area level 1 (state - e.g., "Lagos State")
              else if (types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
              // Country
              else if (types.includes("country")) {
                country = component.long_name;
              }
              // Postal code
              else if (types.includes("postal_code")) {
                postalCode = component.long_name;
              }
            });

            // If no area found, try to use the first part of formatted address
            if (!area && place.formatted_address) {
              const addressParts = place.formatted_address
                .split(",")
                .map((s) => s.trim());
              if (addressParts.length > 0) {
                area = addressParts[0];
              }
            }

            const result: PlaceResult = {
              address: place.formatted_address || place.name || "",
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0,
              placeId,
              area,
              city,
              state,
              country,
              postalCode,
            };

            onPlaceSelect(result);
            setShowDropdown(false);
            setPredictions([]);
          }
        },
      );
    } catch (error) {
      console.error("Error getting place details:", error);
      setIsLoading(false);
    }
  };

  // Handle current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    if (!window.google?.maps) {
      alert("Google Maps is still loading. Please wait a moment.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              setIsLoading(false);

              if (status === "OK" && results && results[0]) {
                // Parse address components
                const addressComponents = results[0].address_components || [];

                let area = "";
                let city = "";
                let state = "";
                let country = "";
                let postalCode = "";

                addressComponents.forEach((component: any) => {
                  const types = component.types;

                  if (
                    types.includes("sublocality_level_1") ||
                    types.includes("sublocality")
                  ) {
                    area = component.long_name;
                  } else if (types.includes("neighborhood") && !area) {
                    area = component.long_name;
                  } else if (types.includes("locality")) {
                    city = component.long_name;
                  } else if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                  } else if (types.includes("country")) {
                    country = component.long_name;
                  } else if (types.includes("postal_code")) {
                    postalCode = component.long_name;
                  }
                });

                const result: PlaceResult = {
                  address: results[0].formatted_address,
                  latitude,
                  longitude,
                  placeId: results[0].place_id,
                  area,
                  city,
                  state,
                  country,
                  postalCode,
                };

                onPlaceSelect(result);
                setShowDropdown(false);
              }
            },
          );
        } catch (error) {
          setIsLoading(false);
          console.error("Error geocoding location:", error);
          alert("Unable to get address for your location");
        }
      },
      (error) => {
        setIsLoading(false);
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
      },
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    fetchPredictions(newValue);
  };

  const handleSelectPrediction = (prediction: Prediction) => {
    onChange?.(prediction.description);
    getPlaceDetails(prediction.place_id);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || predictions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < predictions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectPrediction(predictions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {label && <Label htmlFor="google-places-input">{label}</Label>}

      <div className="relative">
        <Input
          id="google-places-input"
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            value && predictions.length > 0 && setShowDropdown(true)
          }
          placeholder={placeholder}
          disabled={!scriptLoaded || !!loadError}
          className={cn("pr-10", className)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : loadError ? (
            <AlertCircle className="h-4 w-4 text-destructive" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && predictions.length > 0 && (
        <Card className="absolute z-9999 w-full mt-1 p-2 shadow-lg border-border max-h-[300px] overflow-y-auto bg-background">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectPrediction(prediction);
              }}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-md hover:bg-accent transition-colors flex items-start gap-3 cursor-pointer",
                selectedIndex === index && "bg-accent",
              )}
            >
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <span className="text-sm">{prediction.description}</span>
            </button>
          ))}
        </Card>
      )}

      {/* Current Location Button */}
      {showCurrentLocation && scriptLoaded && !loadError && (
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <Navigation className="h-3 w-3" />
          Use current location
        </button>
      )}

      {/* Status Messages */}
      {loadError && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {loadError}
        </p>
      )}

      {!scriptLoaded && !loadError && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading location services...
        </p>
      )}
    </div>
  );
}
