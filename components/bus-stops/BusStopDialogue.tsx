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
import GooglePlacesAutocompleteBusstop from "./GooglePlacesAutocompleteBusstop";
import {
  DropOffStation,
  EditPickupStationPayload,
  NewBusStopPayload,
  PickUpStation,
} from "@/types";
import { BusStopPayload } from "@/api/bus-stops";

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
  existingData?: NewBusStopPayload;
  isOpen: boolean;
  type?: "pickup" | "drop-off";
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewBusStopPayload) => void;
  isLoading?: boolean;
  title?: string;
}

export function BusStopDialog({
  mode = "add",
  existingData,
  type = "drop-off",
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading = false,
  title = "Bus Stop",
}: DropOffStationDialogProps) {
  const [locationValue, setLocationValue] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [area, setArea] = useState("");
  const [routes, setRoutes] = useState(0);
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]); // [lng, lat]

  const GOOGLE_MAPS_API_KEY = "AIzaSyDiLLd0jxqJazTw8gV9FNyRvmvs6EDNVJs";
  // Initialize form with existing data when in edit mode
  useEffect(() => {
    if (mode === "edit" && existingData) {
      setLocationValue(existingData.location.value);
      setArea(existingData.area);
      setRoutes(existingData.routes);

      // Handle state normalization
      const normalizedState = existingData.state
        .replace(/\s+State$/i, "")
        .trim();
      setSelectedState(normalizedState.toLowerCase());

      // Set coordinates [lng, lat]
      setCoordinates(existingData.location.coordinates);
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

    const data: NewBusStopPayload = {
      ...(mode === "edit" &&
        existingData?.bus_stop_id && {
          drop_off_location_id: existingData.bus_stop_id,
        }),
      routes,
      location: {
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
          <div className="space-y-2">
            <Label htmlFor="name">Enter Number of Routes</Label>
            <Input
              id="route-count"
              type="number"
              value={routes === 0 ? "" : routes}
              onChange={(e) => {
                const val = e.target.value;
                setRoutes(val === "" ? 0 : Number(val));
              }}
              placeholder="e.g. 5"
              min={0}
            />
          </div>
          {/* Google Places Autocomplete */}
          <GooglePlacesAutocompleteBusstop
            apiKey={GOOGLE_MAPS_API_KEY}
            value={locationValue}
            onChange={setLocationValue}
            onPlaceSelect={handlePlaceSelect}
            label={"Enter Bus-Stop Name / Location"}
            placeholder="Search for a location in Nigeria..."
            country="ng"
            types={["geocode", "establishment"]}
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
            onClick={handleSubmit}
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
export function AddBusStopDialog({
  onSubmit,
  isLoading,
  setIsAddDialogOpen,
  isAddDialogOpen,
  title,
}: {
  onSubmit: (data: NewBusStopPayload) => void;
  isLoading?: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
  isAddDialogOpen: boolean;
  title?: string;
}) {
  return (
    <>
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Bus-Stop
      </Button>

      <BusStopDialog
        mode="add"
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
export function EditBusStopDialog({
  data,
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  title,
}: {
  data: NewBusStopPayload;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewBusStopPayload) => void;
  isLoading?: boolean;
  title?: string;
}) {
  return (
    <BusStopDialog
      mode="edit"
      title={title}
      existingData={data}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
}
