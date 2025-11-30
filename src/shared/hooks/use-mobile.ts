import * as React from "react";
import { useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined,
	);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}

// Table hook for managing table state
export function useTable<T>(initialData: T[] = []) {
	const [data, setData] = useState<T[]>(initialData);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	return {
		data,
		setData,
		loading,
		setLoading,
		error,
		setError,
		sorting,
		setSorting,
		pagination,
		setPagination,
	};
}
