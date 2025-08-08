"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Contact() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormStatus("success");
    setMessage("Your message has been sent! We&#39;ll get back to you soon.");
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <section id="contact" className="py-20 bg-black text-white pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Contact Us</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${isLightTheme ? "text-gray-600" : "text-gray-300"}`}>
            Have questions about YSN? We&apos;re here to help. Reach out to our team for more information about our
            facilities, events, or partnership opportunities.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-6xl mx-auto"
        >
          <div
            className={`absolute -top-16 -left-16 w-40 h-40 ${
              isLightTheme ? "bg-gradient-to-r from-purple-500/5 to-blue-500/3" : "bg-gradient-to-r from-purple-500/10 to-blue-500/5"
            } rounded-full blur-3xl opacity-50`}
          />
          <div
            className={`absolute -bottom-16 -right-16 w-40 h-40 ${
              isLightTheme ? "bg-gradient-to-r from-blue-500/3 to-purple-500/5" : "bg-gradient-to-r from-blue-500/5 to-purple-500/10"
            } rounded-full blur-3xl opacity-50`}
          />

          <div
            className={`relative z-10 ${
              isLightTheme ? "bg-white/90 backdrop-blur border border-gray-200" : "bg-black/40 backdrop-blur border border-white/10"
            } rounded-2xl p-6 md:p-10 overflow-hidden`}
          >
            <div
              className={`absolute inset-0 ${
                isLightTheme
                  ? "bg-[linear-gradient(rgba(0,0,0,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_1px)]"
                  : "bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)]"
              } bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]`}
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-10">
              {/* Left: Info */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <ContactItem
                    icon={<Mail className={`h-5 w-5 ${isLightTheme ? "text-purple-500" : "text-purple-300"}`} />}
                    title="Email"
                    content="ysnetwork.tv@gmail.com"
                    href="mailto:ysnetwork.tv@gmail.com"
                    isLightTheme={isLightTheme}
                  />
                  <ContactItem
                    icon={<Phone className={`h-5 w-5 ${isLightTheme ? "text-purple-500" : "text-purple-300"}`} />}
                    title="Phone"
                    content="(631) 555-0123"
                    href="tel:+16315550123"
                    isLightTheme={isLightTheme}
                  />
                  <ContactItem
                    icon={<MapPin className={`h-5 w-5 ${isLightTheme ? "text-purple-500" : "text-purple-300"}`} />}
                    title="Address"
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

                <div className={`${isLightTheme ? "bg-gray-50" : "bg-white/5"} rounded-xl p-6 backdrop-blur-sm`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 ${isLightTheme ? "bg-gray-100" : "bg-white/10"} rounded-full`}>
                      <Clock className={`h-5 w-5 ${isLightTheme ? "text-purple-500" : "text-purple-300"}`} />
                    </div>
                    <h3 className={`font-semibold ${isLightTheme ? "text-gray-800" : "text-white"}`}>Hours of Operation</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isLightTheme ? "text-gray-600" : "text-gray-300"}>Monday - Friday</span>
                      <span className={`font-medium ${isLightTheme ? "text-gray-800" : "text-white"}`}>6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLightTheme ? "text-gray-600" : "text-gray-300"}>Saturday</span>
                      <span className={`font-medium ${isLightTheme ? "text-gray-800" : "text-white"}`}>7:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLightTheme ? "text-gray-600" : "text-gray-300"}>Sunday</span>
                      <span className={`font-medium ${isLightTheme ? "text-gray-800" : "text-white"}`}>8:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  <p className={`text-xs mt-3 ${isLightTheme ? "text-gray-500" : "text-gray-400"}`}>
                    Note: Hours may vary during special events and holidays.
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div>
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 ${isLightTheme ? "bg-gray-100" : "bg-white/10"} rounded-full`}>
                      <Send className={`h-5 w-5 ${isLightTheme ? "text-purple-500" : "text-purple-300"}`} />
                    </div>
                    <h3 className={`text-base font-medium uppercase tracking-wider ${isLightTheme ? "text-purple-600" : "text-purple-300"}`}>
                      Send a Message
                    </h3>
                  </div>
                  <p className={isLightTheme ? "text-gray-600" : "text-gray-300"}>
                    Fill out the form below and we&#39;ll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LabeledInput id="first-name" label="First Name" placeholder="John" disabled={formStatus !== "idle"} isLightTheme={isLightTheme} />
                    <LabeledInput id="last-name" label="Last Name" placeholder="Doe" disabled={formStatus !== "idle"} isLightTheme={isLightTheme} />
                  </div>
                  <LabeledInput id="email" label="Email" type="email" placeholder="john.doe@example.com" disabled={formStatus !== "idle"} isLightTheme={isLightTheme} />
                  <LabeledInput id="phone" label="Phone" type="tel" placeholder="(123) 456-7890" disabled={formStatus !== "idle"} isLightTheme={isLightTheme} />
                  <LabeledTextarea id="message" label="Message" placeholder="How can we help you?" rows={4} disabled={formStatus !== "idle"} isLightTheme={isLightTheme} />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 rounded-full transition-all"
                    disabled={formStatus === "loading" || formStatus === "success"}
                  >
                    {formStatus === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : formStatus === "success" ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" /> Sent!
                      </>
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {message && (
                    <div className={`flex items-center text-sm ${formStatus === "error" ? "text-red-400" : isLightTheme ? "text-green-600" : "text-green-400"}`}>
                      {formStatus === "error" ? <AlertCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      {message}
                    </div>
                  )}
                </form>
              </div>
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
  content: React.ReactNode;
  href?: string;
  isLightTheme: boolean;
}

const ContactItem = ({ icon, title, content, href, isLightTheme }: ContactItemProps) => {
  return (
    <div className="flex items-start gap-4 group">
      <div
        className={`p-3 ${
          isLightTheme
            ? "bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-purple-600/20 group-hover:to-blue-600/20"
            : "bg-white/10 group-hover:bg-gradient-to-r group-hover:from-purple-600/50 group-hover:to-blue-600/50"
        } backdrop-blur-sm rounded-full mt-1 transition-all`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`text-lg font-semibold ${isLightTheme ? "text-gray-800" : "text-white"} mb-1`}>{title}</h3>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${isLightTheme ? "text-gray-600 hover:text-purple-600" : "text-gray-300 hover:text-purple-300"} transition-colors`}
          >
            {content}
          </a>
        ) : (
          <p className={isLightTheme ? "text-gray-600" : "text-gray-300"}>{content}</p>
        )}
      </div>
    </div>
  );
};

function LabeledInput({ id, label, isLightTheme, disabled, ...props }: { id: string; label: string; isLightTheme: boolean; disabled?: boolean } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={`text-base font-medium ${isLightTheme ? "text-gray-700" : "text-gray-300"}`}>
        {label}
      </label>
      <Input
        id={id}
        disabled={disabled}
        className={`${isLightTheme ? "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus-visible:ring-purple-500" : "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"}`}
        {...props}
      />
    </div>
  );
}

function LabeledTextarea({ id, label, isLightTheme, disabled, ...props }: { id: string; label: string; isLightTheme: boolean; disabled?: boolean } & React.ComponentProps<typeof Textarea>) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={`text-base font-medium ${isLightTheme ? "text-gray-700" : "text-gray-300"}`}>
        {label}
      </label>
      <Textarea
        id={id}
        disabled={disabled}
        className={`${isLightTheme ? "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus-visible:ring-purple-500" : "bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"}`}
        {...props}
      />
    </div>
  );
}


