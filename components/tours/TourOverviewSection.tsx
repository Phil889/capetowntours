"use client";

import { CheckCircle, Sparkles, Zap } from "lucide-react";
import styles from "@/styles/tour-detail.module.css";

interface TourOverviewSectionProps {
  description: string;
  highlights?: string[];
}

export default function TourOverviewSection({ 
  description, 
  highlights 
}: TourOverviewSectionProps) {
  return (
    <section className={styles.contentCard} aria-labelledby="overview-heading">
      <h2 id="overview-heading" className={styles.sectionTitle}>
        <div className={styles.sectionIcon} aria-hidden="true">
          <Sparkles className="w-4 h-4" />
        </div>
        About this Experience
      </h2>
      
      <p className="text-gray-700 mb-6 leading-relaxed text-lg">
        {description}
      </p>
      
      {highlights && highlights.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center text-gray-800">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" aria-hidden="true" /> 
            Tour Highlights
          </h3>
          <div className={styles.highlightsGrid} role="list">
            {highlights.map((item, idx) => (
              <div key={idx} className={styles.highlightCard} role="listitem">
                <div className={styles.highlightIcon} aria-hidden="true">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className={styles.highlightContent}>
                  <p>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
