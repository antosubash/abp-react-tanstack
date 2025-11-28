import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { IdentityUserDto } from "@/client/types.gen";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const userFormSchema = z.object({
	userName: z.string().min(1, "Username is required"),
	name: z.string().optional(),
	surname: z.string().optional(),
	email: z.string().email("Invalid email address"),
	phoneNumber: z.string().optional(),
	isActive: z.boolean().default(true),
	lockoutEnabled: z.boolean().default(true),
	password: z.string().optional(),
	confirmPassword: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
	user?: IdentityUserDto | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: UserFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function UserForm({
	user,
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
	mode,
}: UserFormProps) {
	const form = useForm<UserFormData>({
		resolver: zodResolver(
			mode === "create"
				? userFormSchema.refine(
						(data) => data.password === data.confirmPassword,
						{
							message: "Passwords don't match",
							path: ["confirmPassword"],
						},
					)
				: userFormSchema,
		),
		defaultValues: {
			userName: user?.userName || "",
			name: user?.name || "",
			surname: user?.surname || "",
			email: user?.email || "",
			phoneNumber: user?.phoneNumber || "",
			isActive: user?.isActive ?? true,
			lockoutEnabled: user?.lockoutEnabled ?? true,
			password: "",
			confirmPassword: "",
		},
	});

	const handleSubmit = async (data: UserFormData) => {
		try {
			await onSubmit(data);
			onOpenChange(false);
			form.reset();
		} catch (error) {
			toast.error("Failed to save user");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create User" : "Edit User"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new user to the system."
							: "Update user information."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="userName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username *</FormLabel>
										<FormControl>
											<Input placeholder="Enter username" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter first name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="surname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter last name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="Enter phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{mode === "create" && (
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password *</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm Password *</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						<div className="flex items-center space-x-4">
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Active</FormLabel>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lockoutEnabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Lockout Enabled</FormLabel>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
