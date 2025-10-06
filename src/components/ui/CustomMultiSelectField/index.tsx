"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { defaultColor } from "@/utils/constant"

type Option = { value: string; label: string }

interface CustomMultiSelectFieldProps {
	label: string
	options: Option[]
	value: string[]
	onChange: (values: string[]) => void
	placeholder?: string
	name?: string
	id?: string
	height?: number
}

const CustomMultiSelectField: React.FC<CustomMultiSelectFieldProps> = ({
	label,
	options,
	value,
	onChange,
	placeholder = "Select…",
	name,
	id,
	height = 180,
}) => {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const wrapperRef = useRef<HTMLDivElement | null>(null)

	const selectedLabels = useMemo(() => {
		if (!value || value.length === 0) return ""
		const map = new Map(options.map((o) => [o.value, o.label]))
		return value.map((v) => map.get(v) ?? v).join(", ")
	}, [options, value])

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return options
		return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
	}, [options, query])

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	return (
		<div style={{ width: "100%", marginBottom: "12px" }} ref={wrapperRef}>
			<label
				htmlFor={id}
				style={{
					display: "block",
					fontSize: "12px",
					fontFamily: "sans-serif",
					fontWeight: 600,
					color: defaultColor.main_grey_2,
					paddingBottom: 10,
				}}
			>
				{label}
			</label>
			<div style={{ position: "relative", width: "100%" }}>
				<span
					style={{
						position: "absolute",
						left: 8,
						top: "50%",
						transform: "translateY(-50%)",
						pointerEvents: "none",
						color: "#1d4ed8",
					}}
				>
					<Search size={14} />
				</span>
				<div
					role="button"
					aria-haspopup="listbox"
					aria-expanded={open}
					onClick={() => setOpen((s) => !s)}
					style={{
						width: "100%",
						height: "26px",
						background: "transparent",
						border: "1px solid #000000",
						borderRadius: 4,
						fontSize: "12px",
						padding: "0 26px 0 28px",
						outline: "none",
						fontFamily: "sans-serif",
						display: "flex",
						alignItems: "center",
						cursor: "pointer",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					<span style={{ color: selectedLabels ? "inherit" : "#9ca3af" }}>
						{selectedLabels || placeholder}
					</span>
					<span style={{ position: "absolute", right: 8, color: "#374151" }}>
						<ChevronDown size={14} />
					</span>
				</div>

				{open ? (
					<div
						role="listbox"
						style={{
							position: "absolute",
							top: "100%",
							left: 0,
							right: 0,
							zIndex: 10,
							marginTop: 4,
							background: "#fff",
							border: "1px solid #e5e7eb",
							borderRadius: 6,
							boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
						}}
					>
						<div style={{ padding: 8, borderBottom: "1px solid #f3f4f6" }}>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search…"
								style={{
									width: "100%",
									height: 28,
									border: "1px solid #e5e7eb",
									borderRadius: 4,
									padding: "0 8px",
									fontSize: 12,
									outline: "none",
									fontFamily: "sans-serif",
								}}
							/>
						</div>
						<div style={{ maxHeight: height, overflowY: "auto", padding: 4 }}>
							{filtered.length === 0 ? (
								<div style={{ padding: 8, fontSize: 12, color: "#6b7280" }}>No results</div>
							) : (
								filtered.map((opt) => {
									const checked = value?.includes(opt.value)
									return (
										<label
											key={opt.value}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 8,
												padding: "6px 8px",
												cursor: "pointer",
											}}
										>
											<input
												type="checkbox"
												checked={!!checked}
												onChange={(e) => {
													const next = new Set(value ?? [])
													if (e.currentTarget.checked) {
														next.add(opt.value)
													} else {
														next.delete(opt.value)
													}
													onChange(Array.from(next))
												}}
												style={{ width: 14, height: 14 }}
											/>
											<span style={{ fontSize: 12 }}>{opt.label}</span>
										</label>
									)
								})
							)}
						</div>
						<div style={{ display: "flex", justifyContent: "flex-end", padding: 8, borderTop: "1px solid #f3f4f6" }}>
							<button
								onClick={() => setOpen(false)}
								style={{
									fontSize: 12,
									padding: "4px 10px",
									border: "1px solid #e5e7eb",
									borderRadius: 4,
									background: "#fff",
									cursor: "pointer",
								}}
							>
								Done
							</button>
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}

export default CustomMultiSelectField


