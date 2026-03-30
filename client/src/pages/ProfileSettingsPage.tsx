import { MoonStar, SunMedium } from "lucide-react";
import { PreferenceRow, Field } from "@/components/mission-flow/primitives";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Role, Theme } from "@/types/app";

export function ProfileSettingsPage({
  theme,
  setTheme,
  notificationsEnabled,
  setNotificationsEnabled,
  digestEnabled,
  setDigestEnabled,
  role,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  digestEnabled: boolean;
  setDigestEnabled: (enabled: boolean) => void;
  role: Role;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Profile & settings</h2>
        <p className="mt-2 text-muted-foreground">
          Personal details, role context, password updates, notifications, and theme preferences in one structured page.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid max-w-xl grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Editable form fields with role visibility and clean spacing.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <Input defaultValue="Khaled Ben Salah" />
              </Field>
              <Field label="Email">
                <Input defaultValue="khaled@missionflow.io" />
              </Field>
              <Field label="Department">
                <Input defaultValue="Operations" />
              </Field>
              <Field label="Role">
                <Input value={role} readOnly className="capitalize" />
              </Field>
              <Field label="Phone">
                <Input defaultValue="+216 20 145 986" />
              </Field>
              <Field label="Location">
                <Input defaultValue="Tunis, Tunisia" />
              </Field>
              <div className="flex justify-end md:col-span-2">
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Protect account access with clear form controls and modern card styling.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <Field label="Current password">
                <Input type="password" placeholder="Current password" />
              </Field>
              <Field label="New password">
                <Input type="password" placeholder="New password" />
              </Field>
              <Field label="Confirm password" className="md:col-span-2">
                <Input type="password" placeholder="Confirm new password" />
              </Field>
              <div className="flex justify-end md:col-span-2">
                <Button>Update password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose how Mission Flow keeps you informed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PreferenceRow
                  label="Instant mission updates"
                  description="Receive immediate approval and rejection alerts."
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
                <PreferenceRow
                  label="Daily activity digest"
                  description="Summarized mission events and reminders every morning."
                  checked={digestEnabled}
                  onCheckedChange={setDigestEnabled}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Theme preferences</CardTitle>
                <CardDescription>Light and dark mode support with a clean switchable system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                    theme === "light" ? "border-primary bg-primary/5" : "border-border/60",
                  )}
                >
                  <div>
                    <p className="font-medium">Light mode</p>
                    <p className="mt-1 text-sm text-muted-foreground">Bright, airy surfaces for daytime work.</p>
                  </div>
                  <SunMedium className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border/60",
                  )}
                >
                  <div>
                    <p className="font-medium">Dark mode</p>
                    <p className="mt-1 text-sm text-muted-foreground">Low-glare contrast for deep operational focus.</p>
                  </div>
                  <MoonStar className="h-5 w-5" />
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
