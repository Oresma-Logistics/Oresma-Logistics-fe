// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardFooter,
// } from "@/components/ui/card";
// import { PasswordInput } from "@/components/utility/form/password-input";
// import z from "zod";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// export default function RiderChangePasssword() {
//   const formScheme = z
//     .object({
//       password: z.string().min(1, "Password is required"),
//       oldPassword: z.string().min(1, "Password is required"),
//       confirmPassword: z.string().min(1, "Confirm Password is required"),
//     })
//     .refine((data) => data.confirmPassword === data.password, {
//       message: "Passwords doesn't match",
//       path: ["confirmPassword"],
//     });
//   return (
//     <div>
//       {" "}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground"> Change Password</h1>
//         <p className="text-muted-foreground">
//           Update your password to keep your account secure
//         </p>
//       </div>
//       <div>
//         <Card className="max-w-2xl">
//           <CardHeader>
//             <h2 className="text-2xl text-primaryT font-medium">
//               Update Profile Form
//             </h2>
//             <p>Update your profile information</p>
//           </CardHeader>

//           <form onSubmit={handleSubmit(onSubmit)}></form>
//         </Card>
//       </div>
//     </div>
//   );
// }
