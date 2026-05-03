import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { MoonStar, SunMedium } from "lucide-react";
import { changePassword, updateProfile } from "@/lib/api";
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
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

const profileSchema = z.object({
  firstName: z.string().min(2, "At least 2 characters"),
  lastName: z.string().min(2, "At least 2 characters"),
  email: z.string().email("Valid email required"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ProfileSettingsPage() {
  const { theme, setTheme } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const role = user?.role ?? "employee";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [digestEnabled, setDigestEnabled] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = profileForm.handleSubmit(async (data) => {
    try {
      const res = await updateProfile(data);
      updateUser(res.user);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change password.");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Profile & settings</h2>
        <p className="mt-2 text-muted-foreground">
          Personal details, role context, password updates, notifications, and
          theme preferences in one structured page.
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
              <CardDescription>Update your name and email address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onProfileSubmit} className="grid gap-5 md:grid-cols-2">
                <Field label="First name">
                  <Input {...profileForm.register("firstName")} placeholder="First name"  />
                  {profileForm.formState.errors.firstName && (
                    <span className="text-xs text-danger">
                      {profileForm.formState.errors.firstName.message}
                    </span>
                  )}
                </Field>
                <Field label="Last name">
                  <Input {...profileForm.register("lastName")} placeholder="Last name" />
                  {profileForm.formState.errors.lastName && (
                    <span className="text-xs text-danger">
                      {profileForm.formState.errors.lastName.message}
                    </span>
                  )}
                </Field>
                <Field label="Email" className="md:col-span-2">
                  <Input
                    {...profileForm.register("email")}
                    type="email"
                    placeholder="Email address"
                  />
                  {profileForm.formState.errors.email && (
                    <span className="text-xs text-danger">
                      {profileForm.formState.errors.email.message}
                    </span>
                  )}
                </Field>
                <Field label="Role" className="md:col-span-2">
                  <Input value={role} readOnly className="capitalize" />
                </Field>
                <div className="flex justify-end md:col-span-2">
                  <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>
                Protect account access with a new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onPasswordSubmit} className="grid gap-5 md:grid-cols-2">
                <Field label="Current password" className="md:col-span-2">
                  <Input
                    {...passwordForm.register("currentPassword")}
                    type="password"
                    placeholder="Current password"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <span className="text-xs text-danger">
                      {passwordForm.formState.errors.currentPassword.message}
                    </span>
                  )}
                </Field>
                <Field label="New password">
                  <Input
                    {...passwordForm.register("newPassword")}
                    type="password"
                    placeholder="New password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <span className="text-xs text-danger">
                      {passwordForm.formState.errors.newPassword.message}
                    </span>
                  )}
                </Field>
                <Field label="Confirm password">
                  <Input
                    {...passwordForm.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm new password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <span className="text-xs text-danger">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </span>
                  )}
                </Field>
                <div className="flex justify-end md:col-span-2">
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? "Updating..." : "Update password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>
                  Choose how Mission Flow keeps you informed.
                </CardDescription>
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
                <CardDescription>
                  Light and dark mode support with a clean switchable system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border/60",
                  )}
                >
                  <div>
                    <p className="font-medium">Light mode</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Bright, airy surfaces for daytime work.
                    </p>
                  </div>
                  <SunMedium className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition",
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border/60",
                  )}
                >
                  <div>
                    <p className="font-medium">Dark mode</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Low-glare contrast for deep operational focus.
                    </p>
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
