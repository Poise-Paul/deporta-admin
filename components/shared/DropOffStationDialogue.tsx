import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import GooglePlacesAutocompleteImproved from "./GooglePlacesAutocompleteImproved";
import {
  DropOffStation,
  EditPickupStationPayload,
  PickUpStation,
} from "@/types";

const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

interface DropOffStationDialogProps {
  mode?: "add" | "edit";
  existingData?: DropOffStation | PickUpStation;
  isOpen: boolean;
  type?: "pickup" | "drop-off";
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DropOffStation | PickUpStation) => void;
  isLoading?: boolean;
  title?: string;
}

export function DropOffStationDialog({
  mode = "add",
  existingData,
  type = "drop-off",
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
  title = "Drop-Off Station",
}: DropOffStationDialogProps) {
  const [locationValue, setLocationValue] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [area, setArea] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]); // [lng, lat]

  const GOOGLE_MAPS_API_KEY = "AIzaSyDiLLd0jxqJazTw8gV9FNyRvmvs6EDNVJs";
  // Initialize form with existing data when in edit mode
  useEffect(() => {
    if (mode === "edit" && existingData) {
      setLocationValue(existingData.address.value);
      setArea(existingData.area);

      // Handle state normalization
      const normalizedState = existingData.state
        .replace(/\s+State$/i, "")
        .trim();
      setSelectedState(normalizedState.toLowerCase());

      // Set coordinates [lng, lat]
      setCoordinates(existingData.address.coordinates);
    } else {
      // Reset form for add mode
      setLocationValue("");
      setArea("");
      setSelectedState("");
      setCoordinates([0, 0]);
    }
  }, [mode, existingData, isOpen]);

  const handlePlaceSelect = (place: {
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
  }) => {
    setLocationValue(place.address);

    // Set coordinates as [longitude, latitude]
    setCoordinates([place.longitude, place.latitude]);

    // Auto-populate area
    const extractedArea = place.area || place.city || "";
    setArea(extractedArea);

    // Auto-populate state
    if (place.state) {
      const stateName = place.state.replace(/\s+State$/i, "").trim();

      const matchedState = NIGERIA_STATES.find(
        (state) => state.toLowerCase() === stateName.toLowerCase(),
      );

      if (matchedState) {
        setSelectedState(matchedState.toLowerCase());
      } else {
        const partialMatch = NIGERIA_STATES.find(
          (state) =>
            stateName.toLowerCase().includes(state.toLowerCase()) ||
            state.toLowerCase().includes(stateName.toLowerCase()),
        );
        if (partialMatch) {
          setSelectedState(partialMatch.toLowerCase());
        }
      }
    }
  };

  const handleSubmit = () => {
    // Validate coordinates exist (user selected from dropdown)
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      alert("Please select a location from the dropdown suggestions");
      return;
    }

    if (!selectedState) {
      alert("Please select a state");
      return;
    }

    const data: DropOffStation = {
      ...(mode === "edit" &&
        existingData?.drop_off_location_id && {
          drop_off_location_id: existingData.drop_off_location_id,
        }),
      address: {
        value: locationValue,
        coordinates: coordinates, // [lng, lat]
      },
      area,
      state: selectedState,
      country: "Nigeria",
    };

    onSubmit(data);
  };

  const handleSubmitPickup = () => {
    // Validate coordinates exist (user selected from dropdown)
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      alert("Please select a location from the dropdown suggestions");
      return;
    }

    if (!selectedState) {
      alert("Please select a state");
      return;
    }

    const data: PickUpStation = {
      ...(mode === "edit" &&
        existingData?.pickup_station_id && {
          pickup_station_id: existingData.pickup_station_id,
        }),
      address: {
        value: locationValue,
        coordinates: coordinates, // [lng, lat]
      },
      area,
      state: selectedState,
      country: "Nigeria",
    };

    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-visible">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? `Edit ${title}` : `Add New ${title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-visible">
          {/* Google Places Autocomplete */}
          <GooglePlacesAutocompleteImproved
            apiKey={GOOGLE_MAPS_API_KEY}
            value={locationValue}
            onChange={setLocationValue}
            onPlaceSelect={handlePlaceSelect}
            label={type === "pickup" ? "Pickup Station" : "Drop-Off Location"}
            placeholder="Search for a location in Nigeria..."
            country="ng"
            showCurrentLocation={true}
          />

          {/* Show selected coordinates (for debugging/validation) */}
          {(coordinates[0] !== 0 || coordinates[1] !== 0) && (
            <p className="text-xs text-muted-foreground">
              ✓ Location selected (Lng: {coordinates[0].toFixed(4)}, Lat:{" "}
              {coordinates[1].toFixed(4)})
            </p>
          )}

          {/* Area Input */}
          <div className="space-y-2">
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area"
            />
          </div>

          {/* State Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full bg-transparent border-border">
                <SelectValue placeholder="Select a State" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIA_STATES.map((state) => (
                  <SelectItem key={state} value={state.toLowerCase()}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country Input (Disabled) */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              disabled
              defaultValue="Nigeria"
              placeholder="Enter country"
              className="bg-muted"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={type === "pickup" ? handleSubmitPickup : handleSubmit}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "edit" ? "Updating..." : "Adding..."}
              </>
            ) : mode === "edit" ? (
              `Update ${title}`
            ) : (
              `Add ${title}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component for Add mode
export function AddDropOffStationDialog({
  onSubmit,
  isLoading,
  setIsAddDialogOpen,
  type,
  isAddDialogOpen,
  title,
}: {
  onSubmit: (data: DropOffStation) => void;
  isLoading?: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
  isAddDialogOpen: boolean;
  type?: "pickup" | "drop-off";
  title?: string;
}) {
  return (
    <>
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        {type === "pickup" ? "Add Pickup Station" : "Add Drop-Off Station"}
      </Button>

      <DropOffStationDialog
        mode="add"
        type={type}
        title={title}
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          onSubmit(data);
        }}
        isLoading={isLoading}
      />
    </>
  );
}

// Wrapper component for Edit mode
export function EditDropOffStationDialog({
  data,
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  type,
  title,
}: {
  data: DropOffStation | EditPickupStationPayload;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DropOffStation) => void;
  isLoading?: boolean;
  type?: "pickup" | "drop-off";
  title?: string;
}) {
  return (
    <DropOffStationDialog
      mode="edit"
      title={title}
      existingData={data}
      isOpen={isOpen}
      type={type}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
}
