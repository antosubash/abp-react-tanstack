import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { userGetAssignableRolesOptions } from "@/client/@tanstack/react-query.gen";
import { userGetRoles } from "@/client/sdk.gen";

const userFormSchema = z.object({
	userName: z.string().min(1, "Username is required"),
	name: z.string().optional(),
	surname: z.string().optional(),
	email: z.email(),
	phoneNumber: z.string().optional(),
	isActive: z.boolean(),
	lockoutEnabled: z.boolean(),
	password: z.string().optional(),
	confirmPassword: z.string().optional(),
	roles: z.array(z.string()).optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;

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
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	// Fetch available roles
	const { data: assignableRolesData, isLoading: rolesLoading } = useQuery(
		userGetAssignableRolesOptions({}),
	);

	// Fetch current user roles when editing
	const { data: userRolesData } = useQuery({
		queryKey: ["userRoles", user?.id],
		queryFn: async () => {
			if (!user?.id) return { items: [] };
			const { data } = await userGetRoles({
				path: { id: user.id },
			});
			return data;
		},
		enabled: !!user?.id && mode === "edit",
	});

	const assignableRoles = assignableRolesData?.items || [];
	const userRoles = userRolesData?.items || [];

	// Update selected roles when user roles data changes
	useEffect(() => {
		if (mode === "edit" && userRoles.length > 0) {
			const roleNames = userRoles
				.map((role) => role.name || "")
				.filter(Boolean);
			setSelectedRoles(roleNames);
		} else {
			setSelectedRoles([]);
		}
	}, [userRoles, mode]);

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
			isActive: user?.isActive !== undefined ? user.isActive : true,
			lockoutEnabled:
				user?.lockoutEnabled !== undefined ? user.lockoutEnabled : true,
			password: "",
			confirmPassword: "",
			roles: selectedRoles,
		},
	});

	// Update form values when selected roles change
	useEffect(() => {
		form.setValue("roles", selectedRoles);
	}, [selectedRoles, form]);

	const handleRoleChange = (roleName: string, checked: boolean) => {
		if (checked) {
			setSelectedRoles((prev) => [...prev, roleName]);
		} else {
			setSelectedRoles((prev) => prev.filter((name) => name !== roleName));
		}
	};

	const handleSubmit = async (data: UserFormData) => {
		try {
			// Include selected roles in the form data
			const formDataWithRoles = {
				...data,
				roles: selectedRoles,
			};
			await onSubmit(formDataWithRoles);
			onOpenChange(false);
			form.reset();
			setSelectedRoles([]);
		} catch (_error) {
			toast.error("Failed to save user");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
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

						{/* Roles Selection */}
						{mode === "edit" && (
							<FormItem>
								<FormLabel>Roles</FormLabel>
								<div className="space-y-2 mt-2">
									{rolesLoading ? (
										<div className="text-sm text-muted-foreground">
											Loading roles...
										</div>
									) : assignableRoles.length > 0 ? (
										assignableRoles.map((role) => (
											<div
												key={role.id}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={`role-${role.id}`}
													checked={selectedRoles.includes(role.name || "")}
													onCheckedChange={(checked) =>
														handleRoleChange(
															role.name || "",
															checked as boolean,
														)
													}
												/>
												<label
													htmlFor={`role-${role.id}`}
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
												>
													{role.name}
												</label>
												{role.isDefault && (
													<Badge variant="secondary" className="text-xs">
														Default
													</Badge>
												)}
											</div>
										))
									) : (
										<div className="text-sm text-muted-foreground">
											No roles available
										</div>
									)}
								</div>
								<FormMessage />
							</FormItem>
						)}

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
								{isLoading
									? "Saving..."
									: mode === "create"
										? "Create"
										: "Update"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
