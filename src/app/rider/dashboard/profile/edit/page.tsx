import { EditComponent } from "@/components/pages/rider/dashbord/profile/profile-edit";
import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";

export default function RiderProfileEdit() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/rider/dashboard" },
          { label: "Profile", href: "/rider/dashboard/profile" },
          { label: "Edit Profile" },
        ]}
      />
      <EditComponent />
    </div>
  );
}
