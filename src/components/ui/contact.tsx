"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
	Mail,
	Phone,
	MapPin,
	Send,
	Clock,
	CheckCircle,
	AlertCircle,
	Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Contact() {
	const ref = useRef<HTMLDivElement | null>(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });
	const [formStatus, setFormStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState("");
	const { theme } = useTheme();
	const isLightTheme = theme === "light";

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormStatus("loading");
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setFormStatus("success");
		setMessage(
			"Your message has been sent! We\u0026#39;ll get back to you soon."
		);
		const form = e.target as HTMLFormElement;
		form.reset();
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	} as const;

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	} as const;

	return (
		<section
			id="contact"
			className="py-24 bg-black text-white relative overflow-hidden"
		>
			<div className="absolute inset-0 " />
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

			<div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={
							isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
						}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="inline-block mb-4"
					></motion.div>

					<h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gap-4 flex justify-center items-center leading-tight">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
							Contact
						</span>

						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
							Our Team
						</span>
					</h2>

					<motion.p
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300"
					>
						Have questions about YSN? We&apos;re here to help. Reach out to our
						team for more information about our facilities, events, or
						partnership opportunities.
					</motion.p>
				</motion.div>

				<motion.div
					ref={ref}
					variants={containerVariants}
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					className="relative max-w-6xl mx-auto"
				>
					<div
						className={`relative z-10 ${
							isLightTheme
								? "bg-white/95 backdrop-blur-xl border border-gray-200/50"
								: "bg-black/60 backdrop-blur-xl border border-white/10"
						} rounded-3xl p-8 md:p-12 shadow-2xl`}
					>
						<div
							className={`absolute inset-0 ${
								isLightTheme
									? "bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)]"
									: "bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)]"
							} bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)] rounded-3xl`}
						/>

						<div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16">
							<motion.div variants={itemVariants} className="space-y-10">
								<div className="space-y-8">
									<div className="mb-8">
										<h3
											className={`text-2xl font-bold mb-2 ${
												isLightTheme ? "text-gray-900" : "text-white"
											}`}
										>
											Let&apos;s Connect
										</h3>
										<p
											className={`text-lg ${
												isLightTheme ? "text-gray-600" : "text-gray-300"
											}`}
										>
											Choose your preferred way to reach us
										</p>
									</div>

								<ContactItem
									icon={<Mail className="h-6 w-6" />}
									title="Email Us"
									subtitle="Quick response guaranteed"
									content="ysnetwork.tv@gmail.com"
									href="mailto:ysnetwork.tv@gmail.com"
									isLightTheme={isLightTheme}
								/>

								<ContactItem
									icon={<Phone className="h-6 w-6" />}
									title="Call Us"
									subtitle="Speak directly with our team"
									content="(631) 555-0123"
									href="tel:+16315550123"
									isLightTheme={isLightTheme}
								/>

								<ContactItem
									icon={<MapPin className="h-6 w-6" />}
									title="Visit Us"
									subtitle="Come see our facilities"
									content={
										<>
											350 Old Northport Road
											<br />
											Kings Park, NY 11753
										</>
									}
									href="https://maps.google.com/?q=350+Old+Northport+Road,+Kings+Park,+NY+11753"
									isLightTheme={isLightTheme}
								/>
							</div>

							<motion.div
								variants={itemVariants}
								className={`${
									isLightTheme ? "bg-gray-50/80" : "bg-white/5"
								} rounded-2xl p-8 backdrop-blur-sm border ${
									isLightTheme ? "border-gray-200/50" : "border-white/10"
								}`}
							>
								<div className="flex items-center gap-4 mb-6">
									<div
										className={`p-3 ${
											isLightTheme ? "bg-purple-100" : "bg-purple-500/20"
										} rounded-xl`}
									>
										<Clock
											className={`h-6 w-6 ${
												isLightTheme ? "text-purple-600" : "text-purple-400"
											}`}
										/>
									</div>
									<div>
										<h3
											className={`text-xl font-bold ${
												isLightTheme ? "text-gray-900" : "text-white"
											}`}
										>
											Hours of Operation
										</h3>
										<p
											className={`text-sm ${
												isLightTheme ? "text-gray-600" : "text-gray-400"
											}`}
										>
											We&apos;re here when you need us
										</p>
									</div>
								</div>

								<div className="space-y-3">
									<HoursRow
										day="Monday - Friday"
										hours="6:00 AM - 10:00 PM"
										isLightTheme={isLightTheme}
									/>
									<HoursRow
										day="Saturday"
										hours="7:00 AM - 9:00 PM"
										isLightTheme={isLightTheme}
									/>
									<HoursRow
										day="Sunday"
										hours="8:00 AM - 8:00 PM"
										isLightTheme={isLightTheme}
									/>
								</div>

								<p
									className={`text-sm mt-4 ${
										isLightTheme ? "text-gray-500" : "text-gray-400"
									}`}
								>
									* Hours may vary during special events and holidays
								</p>
							</motion.div>
						</motion.div>

						<motion.div variants={itemVariants}>
							<div className="mb-8">
								<div className="flex items-center gap-4 mb-4">
									<div
										className={`p-3 ${
											isLightTheme ? "bg-blue-100" : "bg-blue-500/20"
										} rounded-xl`}
									>
										<Send
											className={`h-6 w-6 ${
												isLightTheme ? "text-blue-600" : "text-blue-400"
											}`}
										/>
									</div>
									<div>
										<h3
											className={`text-xl font-bold ${
												isLightTheme ? "text-gray-900" : "text-white"
											}`}
										>
											Send a Message
										</h3>
										<p
											className={`text-sm ${
												isLightTheme ? "text-gray-600" : "text-gray-400"
											}`}
										>
											We&apos;ll respond within 24 hours
										</p>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<LabeledInput
										id="first-name"
										label="First Name"
										placeholder="John"
										disabled={formStatus !== "idle"}
										isLightTheme={isLightTheme}
									/>
									<LabeledInput
										id="last-name"
										label="Last Name"
										placeholder="Doe"
										disabled={formStatus !== "idle"}
										isLightTheme={isLightTheme}
									/>
								</div>

								<LabeledInput
									id="email"
									label="Email Address"
									type="email"
									placeholder="john.doe@example.com"
									disabled={formStatus !== "idle"}
									isLightTheme={isLightTheme}
								/>

								<LabeledInput
									id="phone"
									label="Phone Number"
									type="tel"
									placeholder="(123) 456-7890"
									disabled={formStatus !== "idle"}
									isLightTheme={isLightTheme}
								/>

								<LabeledTextarea
									id="message"
									label="Your Message"
									placeholder="Tell us how we can help you..."
									rows={5}
									disabled={formStatus !== "idle"}
									isLightTheme={isLightTheme}
								/>

								<motion.div
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-14 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
										disabled={
											formStatus === "loading" || formStatus === "success"
										}
									>
										{formStatus === "loading" ? (
											<>
												<Loader2 className="mr-3 h-5 w-5 animate-spin" />
												Sending Message...
											</>
										) : formStatus === "success" ? (
											<>
												<CheckCircle className="mr-3 h-5 w-5" />
												Message Sent!
											</>
										) : (
											<>
												Send Message
												<Send className="ml-3 h-5 w-5" />
											</>
										)}
									</Button>
								</motion.div>

								{message && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										className={`flex items-center text-base p-4 rounded-xl ${
											formStatus === "error"
												? "text-red-400 bg-red-500/10 border border-red-500/20"
												: isLightTheme
												? "text-green-600 bg-green-50 border border-green-200"
												: "text-green-400 bg-green-500/10 border border-green-500/20"
										}`}
									>
										{formStatus === "error" ? (
											<AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
										) : (
											<CheckCircle className="mr-3 h-5 w-5 flex-shrink-0" />
										)}
										{message}
									</motion.div>
								)}
							</form>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	</section>
	);
}

interface ContactItemProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	content: React.ReactNode;
	href?: string;
	isLightTheme: boolean;
}

const ContactItem = ({
	icon,
	title,
	subtitle,
	content,
	href,
	isLightTheme,
}: ContactItemProps) => {
	return (
		<motion.div
			whileHover={{ x: 8 }}
			transition={{ duration: 0.2 }}
			className="group"
		>
			<div className="flex items-start gap-5">
				<motion.div
					whileHover={{ scale: 1.1, rotate: 5 }}
					transition={{ duration: 0.2 }}
					className={`p-4 ${
						isLightTheme
							? "bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200"
							: "bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30"
					} rounded-2xl transition-all duration-300 border ${
						isLightTheme ? "border-purple-200/50" : "border-purple-500/20"
					}`}
				>
					<div className={isLightTheme ? "text-purple-600" : "text-purple-400"}>
						{icon}
					</div>
				</motion.div>

				<div className="flex-1 min-w-0">
					<h4
						className={`text-lg font-bold mb-1 ${
							isLightTheme ? "text-gray-900" : "text-white"
						}`}
					>
						{title}
					</h4>

					{href ? (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className={`text- font-medium ${
								isLightTheme
									? "text-gray-700 hover:text-purple-600"
									: "text-gray-300 hover:text-purple-400"
							} transition-colors duration-200 hover:underline`}
						>
							{content}
						</a>
					) : (
						<div
							className={`text-lg font-medium ${
								isLightTheme ? "text-gray-700" : "text-gray-300"
							}`}
						>
							{content}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

const HoursRow = ({
	day,
	hours,
	isLightTheme,
}: {
	day: string;
	hours: string;
	isLightTheme: boolean;
}) => (
	<div className="flex justify-between items-center py-2">
		<span
			className={`font-medium ${
				isLightTheme ? "text-gray-700" : "text-gray-300"
			}`}
		>
			{day}
		</span>
		<span
			className={`font-bold ${isLightTheme ? "text-gray-900" : "text-white"}`}
		>
			{hours}
		</span>
	</div>
);

function LabeledInput({
	id,
	label,
	isLightTheme,
	disabled,
	...props
}: {
	id: string;
	label: string;
	isLightTheme: boolean;
	disabled?: boolean;
} & React.ComponentProps<typeof Input>) {
	return (
		<motion.div whileFocus={{ scale: 1.02 }} className="space-y-3">
			<label
				htmlFor={id}
				className={`block text-base font-semibold ${
					isLightTheme ? "text-gray-800" : "text-gray-200"
				}`}
			>
				{label}
			</label>
			<Input
				id={id}
				disabled={disabled}
				className={`h-12 text-base rounded-xl transition-all duration-200 ${
					isLightTheme
						? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
						: "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-400 focus-visible:border-purple-400"
				}`}
				{...props}
			/>
		</motion.div>
	);
}

function LabeledTextarea({
	id,
	label,
	isLightTheme,
	disabled,
	...props
}: {
	id: string;
	label: string;
	isLightTheme: boolean;
	disabled?: boolean;
} & React.ComponentProps<typeof Textarea>) {
	return (
		<motion.div whileFocus={{ scale: 1.02 }} className="space-y-3">
			<label
				htmlFor={id}
				className={`block text-base font-semibold ${
					isLightTheme ? "text-gray-800" : "text-gray-200"
				}`}
			>
				{label}
			</label>
			<Textarea
				id={id}
				disabled={disabled}
				className={`text-base rounded-xl transition-all duration-200 resize-none ${
					isLightTheme
						? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:border-purple-500"
						: "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-400 focus-visible:border-purple-400"
				}`}
				{...props}
			/>
		</motion.div>
	);
}


