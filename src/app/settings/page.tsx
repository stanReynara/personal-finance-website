"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { SaveAll, Loader2Icon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Config state
  const [config, setConfig] = useState({
    sidebarLocation: "left",
    variant: "sidebar",
    collapsible: "icon",
  });

  // Load config.json on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Save config.json
  async function saveConfig() {
    setSaving(true);
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
    } catch (err) {
      console.error("Failed to save config:", err);
    } finally {
      setSaving(false);
      toast("Settings saved. ✅");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2Icon className="animate-spin mr-2" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Page title */}
      <h1 className="text-4xl font-bold tracking-tight">Settings</h1>

      {/* Section title */}
      <h2 className="text-2xl font-semibold text-foreground">General</h2>

      <div className="space-y-8">
        {/* Sidebar Location */}
        <div className="grid grid-cols-2 items-center gap-8 border-b pb-6">
          <div>
            <h3 className="text-lg font-medium text-foreground">
              Sidebar Location
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose where the sidebar should be displayed.
            </p>
          </div>
          <div>
            <RadioGroup
              value={config.sidebarLocation}
              onValueChange={(val) =>
                setConfig({ ...config, sidebarLocation: val })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Variant */}
        <div className="grid grid-cols-2 items-center gap-8 border-b pb-6">
          <div>
            <h3 className="text-lg font-medium text-foreground">Variant</h3>
            <p className="text-sm text-muted-foreground">
              Choose the variant of the sidebar.
            </p>
          </div>
          <div>
            <RadioGroup
              value={config.variant}
              onValueChange={(val) => setConfig({ ...config, variant: val })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sidebar" id="sidebar" />
                <Label htmlFor="sidebar">Sidebar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inset" id="inset" />
                <Label htmlFor="inset">Inset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="floating" id="floating" />
                <Label htmlFor="floating">Floating</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Collapsible */}
        <div className="grid grid-cols-2 items-center gap-8">
          <div>
            <h3 className="text-lg font-medium text-foreground">Collapsible</h3>
            <p className="text-sm text-muted-foreground">
              Choose whether the sidebar should be collapsible.
            </p>
          </div>
          <div>
            <RadioGroup
              value={config.collapsible}
              onValueChange={(val) =>
                setConfig({ ...config, collapsible: val })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offcanvas" id="offcanvas" />
                <Label htmlFor="offcanvas">Offcanvas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="icon" id="icon" />
                <Label htmlFor="icon">Icon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <Button onClick={saveConfig} disabled={saving}>
        {saving ? (
          <>
            <Loader2Icon className="animate-spin mr-2" />
            Saving...
          </>
        ) : (
          <>
            <SaveAll className="mr-2" />
            Save
          </>
        )}
      </Button>
    </div>
  );
}
