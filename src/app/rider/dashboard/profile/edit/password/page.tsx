import { Breadcrumb } from "@/components/shared/dashboard/breadcrumb";
// import RiderChangePasssword from "@/components/pages/rider/dashbord/profile/change-password";
export default function EditProfilePassword() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/rider/dashboard" },
          { label: "Profile", href: "/rider/dashboard/profile" },
          { label: "Edit Profile", href: "/rider/dashboard/profile/edit" },
          { label: "Change Password" },
        ]}
      />
      <div>
        {/* <RiderChangePasssword /> */}
        testing
      </div>
    </div>
  );
}
