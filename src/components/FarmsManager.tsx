import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Sprout,
  Image as ImageIcon,
  Compass,
  Edit,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Plot } from "../types/farm";

interface FarmsManagerProps {
  plots: Plot[];
  onAddPlot: (plot: Omit<Plot, "id" | "createdAt">) => void;
  onUpdatePlot: (plot: Plot) => void;
  onDeletePlot: (plotId: string) => void;
}

export const FarmsManager: React.FC<FarmsManagerProps> = ({
  plots,
  onAddPlot,
  onUpdatePlot,
  onDeletePlot,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [areaAcres, setAreaAcres] = useState<number | "">(3.5);
  const [maturePlants, setMaturePlants] = useState<number | "">(1800);
  const [youngPlants, setYoungPlants] = useState<number | "">(300);
  const [newlyPlanted, setNewlyPlanted] = useState<number | "">(100);
  const [plantingYear, setPlantingYear] = useState<number | "">(2022);
  const [variety, setVariety] = useState<Plot["variety"]>("Njallani Green Gold");
  const [lat, setLat] = useState<number>(9.8724);
  const [lng, setLng] = useState<number>(77.1645);
  const [address, setAddress] = useState("Vandanmedu, Idukki, Kerala");
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1592417817098-8f3d6eb16117?auto=format&fit=crop&w=600&q=80");
  const [notes, setNotes] = useState("");

  const handleOpenNew = () => {
    setEditingPlot(null);
    setName(`Plot ${plots.length + 1} - New Block`);
    setAreaAcres(3.0);
    setMaturePlants(1500);
    setYoungPlants(200);
    setNewlyPlanted(100);
    setPlantingYear(2023);
    setVariety("Njallani Green Gold");
    setNotes("Highland slope with shade canopy.");
    setShowModal(true);
  };

  const handleOpenEdit = (p: Plot) => {
    setEditingPlot(p);
    setName(p.name);
    setAreaAcres(p.areaAcres);
    setMaturePlants(p.maturePlants);
    setYoungPlants(p.youngPlants);
    setNewlyPlanted(p.newlyPlanted);
    setPlantingYear(p.plantingYear);
    setVariety(p.variety);
    setLat(p.gpsLocation?.lat || 9.8724);
    setLng(p.gpsLocation?.lng || 77.1645);
    setAddress(p.gpsLocation?.address || "");
    setPhotoUrl(p.photos[0] || "");
    setNotes(p.notes);
    setShowModal(true);
  };

  const handleGetCurrentGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
          setAddress(`GPS Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert("GPS location simulation active: 9.8724 N, 77.1645 E (Idukki High Ranges)");
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const plotData = {
      name,
      areaAcres: Number(areaAcres) || 1,
      maturePlants: Number(maturePlants) || 0,
      youngPlants: Number(youngPlants) || 0,
      newlyPlanted: Number(newlyPlanted) || 0,
      plantingYear: Number(plantingYear) || 2022,
      variety,
      gpsLocation: { lat, lng, address },
      photos: photoUrl ? [photoUrl] : [],
      notes,
    };

    if (editingPlot) {
      onUpdatePlot({
        ...editingPlot,
        ...plotData,
      });
    } else {
      onAddPlot(plotData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-16 md:pb-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Farm Plots & Blocks Management</span>
          </h2>
          <p className="text-xs text-emerald-300">
            Track acreage, plant counts, planting age, varieties, and GPS coordinates
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Plot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plots.map((plot) => {
          const totalPlants = plot.maturePlants + plot.youngPlants + plot.newlyPlanted;
          return (
            <div
              key={plot.id}
              className="bg-emerald-950 border border-emerald-800/80 rounded-2xl overflow-hidden shadow-md hover:border-emerald-600 transition flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="h-40 w-full relative bg-emerald-900">
                  <img
                    src={
                      plot.photos[0] ||
                      "https://images.unsplash.com/photo-1592417817098-8f3d6eb16117?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={plot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/30 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(plot)}
                      className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-amber-300 backdrop-blur-xs transition"
                      title="Edit Plot"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {plots.length > 1 && (
                      <button
                        onClick={() => onDeletePlot(plot.id)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-900 text-rose-300 backdrop-blur-xs transition"
                        title="Delete Plot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-emerald-950 text-[10px] font-extrabold uppercase">
                        {plot.variety}
                      </span>
                      <span className="text-xs text-emerald-200">Est. {plot.plantingYear}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-white mt-0.5">{plot.name}</h3>
                  </div>
                </div>

                {/* Plot Metadata Details */}
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-2 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800 text-center">
                    <div>
                      <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Area</span>
                      <span className="font-black text-amber-300">{plot.areaAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Mature</span>
                      <span className="font-black text-white">{plot.maturePlants.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Total Plants</span>
                      <span className="font-black text-emerald-200">{totalPlants.toLocaleString()}</span>
                    </div>
                  </div>

                  {plot.gpsLocation && (
                    <div className="flex items-center gap-2 text-emerald-300 bg-emerald-900/30 p-2 rounded-lg border border-emerald-800/60 text-[11px]">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">
                        GPS: {plot.gpsLocation.lat}, {plot.gpsLocation.lng} ({plot.gpsLocation.address || "Idukki"})
                      </span>
                    </div>
                  )}

                  {plot.notes && (
                    <p className="text-emerald-300/90 italic bg-emerald-900/20 p-2 rounded-lg border border-emerald-800/40">
                      "{plot.notes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Plot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-lg bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <h3 className="font-bold text-base text-emerald-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>{editingPlot ? "Edit Farm Plot" : "Add New Farm Plot"}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-emerald-800 text-emerald-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs mt-4">
              <div>
                <label className="block text-emerald-300 font-medium mb-1">Plot Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High Ridge Block C"
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Planting Year</label>
                  <input
                    type="number"
                    value={plantingYear}
                    onChange={(e) => setPlantingYear(parseInt(e.target.value) || 2022)}
                    className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Cardamom Variety</label>
                <select
                  value={variety}
                  onChange={(e) => setVariety(e.target.value as Plot["variety"])}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Njallani Green Gold">Njallani Green Gold (High Yield)</option>
                  <option value="Malabar">Malabar Variety</option>
                  <option value="Mysore">Mysore Variety</option>
                  <option value="Vazhukka">Vazhukka Variety</option>
                  <option value="Avinash">Avinash Clonal Selection</option>
                  <option value="Custom">Custom / Mixed Variety</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Mature Plants</label>
                  <input
                    type="number"
                    value={maturePlants}
                    onChange={(e) => setMaturePlants(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Young Plants</label>
                  <input
                    type="number"
                    value={youngPlants}
                    onChange={(e) => setYoungPlants(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-1">Newly Planted</label>
                  <input
                    type="number"
                    value={newlyPlanted}
                    onChange={(e) => setNewlyPlanted(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-emerald-300 font-medium">GPS Location Coordinates</label>
                  <button
                    type="button"
                    onClick={handleGetCurrentGPS}
                    className="text-[11px] text-amber-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Compass className="w-3.5 h-3.5" /> Capture Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    placeholder="Latitude"
                    className="p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    placeholder="Longitude"
                    className="p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-1">Plot Notes & Observations</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg bg-emerald-900/80 border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm shadow-md transition"
              >
                {editingPlot ? "Update Plot Details" : "Save New Plot"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
