import { EditComponent } from "@/components/pages/dashboard/profile/profile-edit";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";

export default function UserProfileEdit() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile", href: "/dashboard/profile" },
          { label: "Edit Profile" },
        ]}
      />
      <EditComponent />
    </div>
  );
}
