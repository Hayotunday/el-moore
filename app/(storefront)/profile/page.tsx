"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Camera, Heart, KeyRound, Loader2, LogOut, Save, User as UserIcon } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useAuthDrawer } from "@/contexts/auth-drawer-context";
import { useFavorites } from "@/hooks/useFavorites";
import { updateUser, uploadUserAvatar, removeUserAvatar } from "@/lib/api/users";
import { formatDate, getFullName, getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();

  if (!user) {
    return (
      <div className="container py-24 flex justify-center">
        <ScrollReveal>
          <div className="rounded-md bg-card p-12 text-center shadow-ambient max-w-md">
            <UserIcon className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h1 className="text-xl font-bold mb-2">Sign in to view your profile</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Create an account or sign in to manage your details and see your saved
              properties in one place.
            </p>
            <Button onClick={() => openAuthDrawer("signin")}>Sign In</Button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return <ProfileContent />;
}

function ProfileContent() {
  const { user, refreshProfile, logout } = useAuth();
  const { favorites } = useFavorites();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [middleName, setMiddleName] = useState(user?.middleName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);

  if (!user) return null;

  const initials = getInitials(user);

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email) {
      toast.error("First name, last name and email are required.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateUser(user.id, { firstName, middleName: middleName || undefined, lastName, email });
      await refreshProfile();
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      await updateUser(user.id, { password: newPassword });
      toast.success("Password changed.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await uploadUserAvatar(user.id, file);
      await refreshProfile();
      toast.success("Photo updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setRemovingAvatar(true);
    try {
      await removeUserAvatar(user.id);
      await refreshProfile();
      toast.success("Photo removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove photo.");
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out.");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:px-8">
      <ScrollReveal>
        <p className="eyebrow mb-4">My Account</p>
        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-10">Your Profile</h1>
      </ScrollReveal>

      <div className="space-y-6">
        {/* Identity */}
        <ScrollReveal>
          <div className="rounded-md bg-card p-6 shadow-ambient flex flex-col sm:flex-row gap-6 sm:items-center">
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={getFullName(user)}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-secondary-foreground text-xl font-bold">
                  {initials}
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-ambient hover:bg-primary/90 transition-colors">
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingAvatar}
                  onChange={(e) => {
                    handleAvatarChange(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold text-foreground">{getFullName(user)}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.createdAt && (
                <p className="text-xs text-muted-foreground pt-1">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {user.avatarUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={removingAvatar}
                  onClick={handleRemoveAvatar}
                >
                  {removingAvatar ? "Removing…" : "Remove Photo"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Saved properties shortcut */}
        <ScrollReveal delay={0.05}>
          <Link
            href="/saved"
            className="rounded-md bg-card p-6 shadow-ambient flex items-center justify-between gap-4 hover:shadow-ambient-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                <Heart className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="font-medium text-foreground">Saved Properties</p>
                <p className="text-sm text-muted-foreground">
                  {favorites.length} {favorites.length === 1 ? "property" : "properties"} on
                  your watchlist
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-foreground">View →</span>
          </Link>
        </ScrollReveal>

        {/* Profile details */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Middle Name (optional)</Label>
                <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                <Save className="h-4 w-4" /> {savingProfile ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Password */}
        <ScrollReveal delay={0.15}>
          <div className="rounded-md bg-card p-6 shadow-ambient space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Change Password
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="grid gap-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangePassword} disabled={savingPassword}>
                <KeyRound className="h-4 w-4" /> {savingPassword ? "Updating…" : "Update Password"}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
