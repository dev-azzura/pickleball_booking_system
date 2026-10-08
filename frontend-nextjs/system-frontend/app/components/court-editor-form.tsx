"use client";

import { useState, type FormEvent } from "react";
import type { Court } from "../data/courts";
import { formatTime } from "../lib/booking-utils";
import Button from "./button";

const amenityOptions = [
  "Parking",
  "Restrooms",
  "Lighting",
  "Seating",
  "Equipment rental",
  "Air-conditioned",
  "Changing rooms",
  "Water station",
  "Open-air",
  "Pro surface",
  "Spectator seating",
  "Cafe nearby",
];

type CourtFormValues = {
  name: string;
  description: string;
  category: "Indoor" | "Outdoor" | "";
  location: string;
  pricePerHour: string;
  openingTime: string;
  closingTime: string;
  amenities: string[];
  available: "true" | "false" | "";
};

type CourtChanges = Omit<Court, "id">;
type CourtEditorFormProps = {
  initialCourt: Court | null;
  onSave: (changes: CourtChanges) => void;
  onCancel: () => void;
};

type FieldErrors = Partial<Record<keyof CourtFormValues, string>>;

const fieldStyles =
  "mt-1.5 min-h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-foreground outline-none transition hover:border-primary/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

function initialValues(court: Court | null): CourtFormValues {
  if (!court) {
    return {
      name: "",
      description: "",
      category: "",
      location: "",
      pricePerHour: "",
      openingTime: "",
      closingTime: "",
      amenities: [],
      available: "",
    };
  }

  return {
    name: court.name,
    description: court.description,
    category: court.category,
    location: court.location,
    pricePerHour: String(court.pricePerHour),
    openingTime: court.openingTime,
    closingTime: court.closingTime,
    amenities: [...court.amenities],
    available: String(court.available) as "true" | "false",
  };
}

function validate(values: CourtFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Court name is required.";
  if (!values.description.trim()) errors.description = "Description is required.";
  if (!values.category) errors.category = "Select a court type.";
  if (!values.location.trim()) errors.location = "Location is required.";
  const rate = Number(values.pricePerHour);
  if (!values.pricePerHour || !Number.isFinite(rate) || rate <= 0) {
    errors.pricePerHour = "Enter an hourly rate greater than zero.";
  }
  if (!values.openingTime) errors.openingTime = "Opening time is required.";
  if (!values.closingTime) errors.closingTime = "Closing time is required.";
  if (values.openingTime && values.closingTime && values.closingTime <= values.openingTime) {
    errors.closingTime = "Closing time must be later than opening time.";
  }
  if (values.amenities.length === 0) errors.amenities = "Select at least one amenity.";
  if (!values.available) errors.available = "Select an availability status.";
  return errors;
}

export default function CourtEditorForm({ initialCourt, onSave, onCancel }: CourtEditorFormProps) {
  const [values, setValues] = useState(() => initialValues(initialCourt));
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateField<Key extends keyof CourtFormValues>(field: Key, value: CourtFormValues[Key]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function toggleAmenity(amenity: string) {
    const nextAmenities = values.amenities.includes(amenity)
      ? values.amenities.filter((item) => item !== amenity)
      : [...values.amenities, amenity];
    updateField("amenities", nextAmenities);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const category = values.category as "Indoor" | "Outdoor";
    const openingTime = values.openingTime;
    const closingTime = values.closingTime;
    onSave({
      name: values.name.trim(),
      description: values.description.trim(),
      category,
      location: values.location.trim(),
      pricePerHour: Number(values.pricePerHour),
      operatingHours: `Daily, ${formatTime(openingTime)} - ${formatTime(closingTime)}`,
      openingTime,
      closingTime,
      operatingDays: initialCourt?.operatingDays,
      amenities: [...values.amenities],
      artwork: category === "Indoor" ? "indoor" : "outdoor",
      available: values.available === "true",
    });
  }

  function fieldError(field: keyof CourtFormValues) {
    const id = `court-${field}-error`;
    return errors[field] ? <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-700">{errors[field]}</p> : null;
  }

  return (
    <section aria-labelledby="court-editor-title" className="rounded-2xl border border-primary/15 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Demo action</p>
          <h2 id="court-editor-title" className="mt-1 text-xl font-bold text-foreground">{initialCourt ? "Edit Court" : "Add Court"}</h2>
          <p className="mt-1 text-sm text-muted">Changes apply to this page only and are not saved.</p>
        </div>
        <button type="button" onClick={onCancel} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-background hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          Close form
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="court-name" className="text-sm font-semibold text-foreground">Court Name</label>
          <input id="court-name" required aria-required="true" value={values.name} onChange={(event) => updateField("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "court-name-error" : undefined} className={fieldStyles} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="court-location" className="text-sm font-semibold text-foreground">Location</label>
          <input id="court-location" required aria-required="true" value={values.location} onChange={(event) => updateField("location", event.target.value)} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? "court-location-error" : undefined} className={fieldStyles} />
          {fieldError("location")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="court-description" className="text-sm font-semibold text-foreground">Description</label>
          <textarea id="court-description" rows={3} required aria-required="true" value={values.description} onChange={(event) => updateField("description", event.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "court-description-error" : undefined} className={`${fieldStyles} py-3`} />
          {fieldError("description")}
        </div>
        <div>
          <label htmlFor="court-type" className="text-sm font-semibold text-foreground">Type</label>
          <select id="court-type" required aria-required="true" value={values.category} onChange={(event) => updateField("category", event.target.value as CourtFormValues["category"])} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "court-category-error" : undefined} className={fieldStyles}>
            <option value="">Select type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
          {fieldError("category")}
        </div>
        <div>
          <label htmlFor="court-rate" className="text-sm font-semibold text-foreground">Hourly Rate (PHP)</label>
          <input id="court-rate" type="number" required aria-required="true" min="0.01" step="0.01" inputMode="decimal" value={values.pricePerHour} onChange={(event) => updateField("pricePerHour", event.target.value)} aria-invalid={Boolean(errors.pricePerHour)} aria-describedby={errors.pricePerHour ? "court-pricePerHour-error" : undefined} className={fieldStyles} />
          {fieldError("pricePerHour")}
        </div>
        <div>
          <label htmlFor="court-opening-time" className="text-sm font-semibold text-foreground">Opening Time</label>
          <input id="court-opening-time" type="time" required aria-required="true" value={values.openingTime} onChange={(event) => updateField("openingTime", event.target.value)} aria-invalid={Boolean(errors.openingTime)} aria-describedby={errors.openingTime ? "court-openingTime-error" : undefined} className={fieldStyles} />
          {fieldError("openingTime")}
        </div>
        <div>
          <label htmlFor="court-closing-time" className="text-sm font-semibold text-foreground">Closing Time</label>
          <input id="court-closing-time" type="time" required aria-required="true" value={values.closingTime} onChange={(event) => updateField("closingTime", event.target.value)} aria-invalid={Boolean(errors.closingTime)} aria-describedby={errors.closingTime ? "court-closingTime-error" : undefined} className={fieldStyles} />
          {fieldError("closingTime")}
        </div>
        <div className="sm:col-span-2">
          <fieldset aria-required="true" aria-describedby={errors.amenities ? "court-amenities-error" : undefined}>
            <legend className="text-sm font-semibold text-foreground">Amenities</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-background focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary sm:text-sm">
                  <input type="checkbox" checked={values.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="size-4 rounded accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  {amenity}
                </label>
              ))}
            </div>
            {fieldError("amenities")}
          </fieldset>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="court-status" className="text-sm font-semibold text-foreground">Availability Status</label>
          <select id="court-status" required aria-required="true" value={values.available} onChange={(event) => updateField("available", event.target.value as CourtFormValues["available"])} aria-invalid={Boolean(errors.available)} aria-describedby={errors.available ? "court-available-error" : undefined} className={fieldStyles}>
            <option value="">Select status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
          {fieldError("available")}
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{initialCourt ? "Save Changes" : "Add Court"}</Button>
        </div>
      </form>
    </section>
  );
}
