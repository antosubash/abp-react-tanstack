import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import type { IdentityRoleDto } from "@/client/types.gen";
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

const roleFormSchema = z.object({
	name: z.string().min(1, "Role name is required"),
	isDefault: z.boolean(),
	isPublic: z.boolean(),
	isStatic: z.boolean(),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
	role?: IdentityRoleDto | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: RoleFormData) => Promise<void>;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function RoleForm({
	role,
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
	mode,
}: RoleFormProps) {
	const form = useForm<RoleFormData>({
		resolver: zodResolver(roleFormSchema),
		defaultValues: {
			name: role?.name || "",
			isDefault: role?.isDefault || false,
			isPublic: role?.isPublic || false,
			isStatic: role?.isStatic || false,
		},
	});

	const handleSubmit = async (data: RoleFormData) => {
		try {
			await onSubmit(data);
			onOpenChange(false);
			form.reset();
		} catch (_error) {
			toast.error("Failed to save role");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create Role" : "Edit Role"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new role to the system."
							: "Update role information."}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role Name *</FormLabel>
									<FormControl>
										<Input placeholder="Enter role name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center space-x-4">
							<FormField
								control={form.control}
								name="isDefault"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Default Role</FormLabel>
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
								name="isPublic"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Public Role</FormLabel>
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

						<FormField
							control={form.control}
							name="isStatic"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel>Static Role</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={mode === "edit"} // Static roles cannot be changed after creation
										/>
									</FormControl>
								</FormItem>
							)}
						/>

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
