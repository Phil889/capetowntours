"use client";

import { Sun, Users, Info, Calendar } from "lucide-react";
import styles from "@/styles/tour-detail.module.css";

interface TourImportantInfoSectionProps {
  seasonalNotes?: string;
  childPolicy?: string;
  accessibility?: string;
  cancellationPolicy?: string;
}

export default function TourImportantInfoSection({
  seasonalNotes,
  childPolicy,
  accessibility,
  cancellationPolicy,
}: TourImportantInfoSectionProps) {
  if (!seasonalNotes && !childPolicy && !accessibility && !cancellationPolicy) {
    return null;
  }

  const infoItems = [
    {
      title: "Seasonal Notes",
      content: seasonalNotes,
      icon: Sun,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Child Policy",
      content: childPolicy,
      icon: Users,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      title: "Accessibility",
      content: accessibility,
      icon: Info,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
    },
    {
      title: "Cancellation Policy",
      content: cancellationPolicy,
      icon: Calendar,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  const activeItems = infoItems.filter(item => item.content);

  return (
    <section className={styles.contentCard} aria-labelledby="info-heading">
      <h2 id="info-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Info className="w-4 h-4" />
        </div>
        Important Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`${item.bgColor} rounded-lg p-4 border ${item.borderColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon 
                  className={`w-5 h-5 ${item.iconColor} flex-shrink-0 mt-1`} 
                  aria-hidden="true" 
                />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
