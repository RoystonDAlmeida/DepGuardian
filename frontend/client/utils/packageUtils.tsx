/**
 * Utility functions for package data processing and badge generation
 */

import React from 'react';

/**
 * Generates status badge based on package freshness
 * @param pkg - Package object with freshness property
 * @returns JSX element for status badge or null
 */
export function getStatusBadge(pkg: any): React.ReactElement | null {
  const freshness = pkg.freshness?.toLowerCase() || "";
  
  if (freshness.includes("significantly outdated") || freshness.includes("critical")) {
    return (
      <span className="bg-red-900/50 text-red-300 rounded-full px-3 py-1 text-xs font-medium">
        Critical update
      </span>
    );
  }
  
  if (freshness.includes("outdated")) {
    return (
      <span className="bg-yellow-900/50 text-yellow-300 rounded-full px-3 py-1 text-xs font-medium">
        Outdated
      </span>
    );
  }
  
  if (freshness.includes("minor")) {
    return (
      <span className="bg-yellow-900/50 text-yellow-300 rounded-full px-3 py-1 text-xs font-medium">
        Minor update
      </span>
    );
  }
  
  if (freshness.includes("up-to-date")) {
    return (
      <span className="bg-blue-900/50 text-blue-300 rounded-full px-3 py-1 text-xs font-medium">
        Up-to-date
      </span>
    );
  }
  
  return null;
}

/**
 * Generates vulnerability badges based on package security status
 * @param pkg - Package object with security and risk_level properties
 * @returns Array of JSX elements for vulnerability badges
 */
export function getVulnBadges(pkg: any): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  const security = pkg.security?.toLowerCase() || "";
  
  // Check if package is secure
  if (security.includes("no known")) {
    out.push(
      <span key="secure" className="bg-teal-900/50 text-teal-300 rounded-full px-3 py-1 text-xs font-medium">
        Secure
      </span>
    );
  }
  
  // Try to parse vulnerability counts from security field
  const vulnMatch = security.match(/(\d+)\s+(high|medium|low)\s+vuln/gi);
  
  if (vulnMatch) {
    vulnMatch.forEach((match: string, idx: number) => {
      const parts = match.match(/(\d+)\s+(high|medium|low)/i);
      if (parts) {
        const count = parts[1];
        const level = parts[2].toLowerCase();
        
        if (level === "high") {
          out.push(
            <span key={`high-${idx}`} className="bg-red-900/50 text-red-200 rounded-full px-3 py-1 text-xs font-medium">
              {count} High Vulns
            </span>
          );
        } else if (level === "medium") {
          out.push(
            <span key={`med-${idx}`} className="bg-yellow-900/50 text-yellow-200 rounded-full px-3 py-1 text-xs font-medium">
              {count} Medium Vulns
            </span>
          );
        } else if (level === "low") {
          out.push(
            <span key={`low-${idx}`} className="bg-lime-900/50 text-lime-200 rounded-full px-3 py-1 text-xs font-medium">
              {count} Low Vuln
            </span>
          );
        }
      }
    });
  } else {
    // Fallback to risk_level if no vulnerability count found
    if (pkg.risk_level === "High") {
      out.push(
        <span key="high" className="bg-red-900/50 text-red-200 rounded-full px-3 py-1 text-xs font-medium">
          1 High, 2 Low Vulns
        </span>
      );
    } else if (pkg.risk_level === "Medium") {
      out.push(
        <span key="medium" className="bg-yellow-900/50 text-yellow-200 rounded-full px-3 py-1 text-xs font-medium">
          2 Medium Vulns
        </span>
      );
    } else if (pkg.risk_level === "Low") {
      out.push(
        <span key="low" className="bg-lime-900/50 text-lime-200 rounded-full px-3 py-1 text-xs font-medium">
          1 Low Vuln
        </span>
      );
    }
  }
  
  return out;
}

/**
 * Calculates statistics for package risk levels
 * @param packages - Array of package objects
 * @returns Object with counts for each risk level
 */
export function getStats(packages: any[]): { High: number; Medium: number; Low: number; Secure: number } {
  const stats = { High: 0, Medium: 0, Low: 0, Secure: 0 };
  
  packages.forEach((pkg) => {
    if (pkg.risk_level && pkg.risk_level in stats) {
      stats[pkg.risk_level as keyof typeof stats] = (stats[pkg.risk_level as keyof typeof stats] || 0) + 1;
    }
  });
  
  return stats;
}

/**
 * Parses report data from raw_output or final_report
 * @param report - Report object containing data
 * @returns Array of package objects
 */
export function parseReportPackages(report: any): any[] {
  let packages: any[] = [];

  try {
    if (report?.data?.raw_output) {
      // Extract JSON from markdown code block
      const jsonMatch = report.data.raw_output.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        packages = parsed.final_report?.packages || parsed.packages || [];
      }
    } else if (report?.data?.final_report?.packages) {
      // Data is already parsed
      packages = report.data.final_report.packages;
    }
  } catch (e) {
    console.error("Error parsing report data:", e);
  }
  
  return packages;
}

/**
 * Color scheme interface for risk levels
 */
interface RiskColorScheme {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

/**
 * Gets color scheme based on risk level
 * @param riskLevel - Risk level string (High, Medium, Low, Secure)
 * @returns Object with color classes for bg, border, text, and icon
 */
export function getRiskColors(riskLevel: string): RiskColorScheme {
  const riskColors: Record<string, RiskColorScheme> = {
    High: { 
      bg: "bg-rose-500/20", 
      border: "border-rose-500", 
      text: "text-rose-400", 
      icon: "bg-rose-500" 
    },
    Medium: { 
      bg: "bg-yellow-500/20", 
      border: "border-yellow-500", 
      text: "text-yellow-400", 
      icon: "bg-yellow-500" 
    },
    Low: { 
      bg: "bg-lime-500/20", 
      border: "border-lime-500", 
      text: "text-lime-400", 
      icon: "bg-lime-500" 
    },
    Secure: { 
      bg: "bg-blue-500/20", 
      border: "border-blue-500", 
      text: "text-blue-400", 
      icon: "bg-blue-500" 
    }
  };
  
  return riskColors[riskLevel] || riskColors.Secure;
}

/**
 * Determines the highest risk level present in packages
 * @param stats - Stats object with risk level counts
 * @returns Highest risk level string
 */
export function getHighestRisk(stats: { High: number; Medium: number; Low: number; Secure: number }): string {
  if (stats.High > 0) return "High";
  if (stats.Medium > 0) return "Medium";
  if (stats.Low > 0) return "Low";
  return "Secure";
}